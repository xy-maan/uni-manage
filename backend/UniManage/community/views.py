from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.core.cache import cache

from .models import Post, Tag, Category, PostAttachment, PollOption, PollVote, Comment
from .serializers import PostSerializer, TagSerializer, CategorySerializer, PostAttachmentSerializer, CommentSerializer

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # We process posts for a single university for now.
        return Post.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """Override to increment view count on specific post fetch with TTL to prevent abusing."""
        instance = self.get_object()
        
        # Identifier for the viewer (we use ID because auth is required, could use IP if mostly anonymous)
        viewer_id = request.user.id
        cache_key = f"post_{instance.id}_viewed_by_{viewer_id}"

        # Setup TTL + Redis tracking: if this key hasn't been set in the cache recently
        if not cache.get(cache_key):
            instance.views_count += 1
            instance.save(update_fields=['views_count'])
            # Set TTL (e.g. 1 hour = 3600s or 24 hours = 86400s)
            cache.set(cache_key, True, timeout=86400)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """Toggle an upvote for the current user and ensure downvotes are removed."""
        post = self.get_object()
        
        if post.upvotes.filter(id=request.user.id).exists():
            post.upvotes.remove(request.user)
            has_upvoted = False
        else:
            post.upvotes.add(request.user)
            has_upvoted = True
            # Remove downvote if it exists
            if post.downvotes.filter(id=request.user.id).exists():
                post.downvotes.remove(request.user)

        return Response({
            "upvotes_count": post.upvotes.count(), 
            "downvotes_count": post.downvotes.count(),
            "has_upvoted": has_upvoted,
            "has_downvoted": post.downvotes.filter(id=request.user.id).exists()
        })

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """Toggle a downvote for the current user and ensure upvotes are removed."""
        post = self.get_object()
        
        if post.downvotes.filter(id=request.user.id).exists():
            post.downvotes.remove(request.user)
            has_downvoted = False
        else:
            post.downvotes.add(request.user)
            has_downvoted = True
            # Remove upvote if it exists
            if post.upvotes.filter(id=request.user.id).exists():
                post.upvotes.remove(request.user)

        return Response({
            "upvotes_count": post.upvotes.count(), 
            "downvotes_count": post.downvotes.count(),
            "has_upvoted": post.upvotes.filter(id=request.user.id).exists(),
            "has_downvoted": has_downvoted
        })

    @action(detail=True, methods=['post'])
    def vote_poll(self, request, pk=None):
        post = self.get_object()
        if post.post_type != Post.PostType.POLL:
            return Response({"detail": "This post is not a poll."}, status=status.HTTP_400_BAD_REQUEST)
        
        option_id = request.data.get('option_id')
        try:
            option = post.poll_options.get(id=option_id)
        except PollOption.DoesNotExist:
            return Response({"detail": "Invalid poll option."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure user hasn't already voted on this specific poll
        if PollVote.objects.filter(user=request.user, poll_option__post=post).exists():
            return Response({"detail": "You have already voted on this poll."}, status=status.HTTP_400_BAD_REQUEST)

        PollVote.objects.create(user=request.user, poll_option=option)
        return Response({"detail": "Vote recorded."})

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        
        if request.method == 'GET':
            comments = post.comments.order_by('-created_at')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
            
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(author=request.user, post=post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_attachment(self, request, pk=None):
        """
        Endpoint to attach a file to a specific post.
        Frontend should create the post first, get the ID, then hit this endpoint with files.
        """
        post = self.get_object()
        
        if post.author != request.user:
            return Response({"detail": "You do not have permission to edit this post."}, status=status.HTTP_403_FORBIDDEN)
            
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
            
        attachment = PostAttachment.objects.create(post=post, file=file_obj)
        serializer = PostAttachmentSerializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)