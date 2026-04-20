from rest_framework import serializers
from .models import Tag, Category, Post, PostAttachment, PollOption, PollVote, Comment

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class PostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAttachment
        fields = ['id', 'file', 'uploaded_at']

class PollOptionSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField(read_only=True)
    has_voted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PollOption
        fields = ['id', 'text', 'vote_count', 'has_voted']

    def get_vote_count(self, obj):
        return obj.votes.count()

    def get_has_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'author_username', 'author_role', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author', 'post']

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)
    
    tags = TagSerializer(many=True, read_only=True)
    attachments = PostAttachmentSerializer(many=True, read_only=True)
    poll_options = PollOptionSerializer(many=True, read_only=True)
    
    upvotes_count = serializers.IntegerField(source='upvotes.count', read_only=True)
    downvotes_count = serializers.IntegerField(source='downvotes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    has_upvoted = serializers.SerializerMethodField(read_only=True)
    has_downvoted = serializers.SerializerMethodField(read_only=True)
    
    # Custom fields for writing simpler payloads from frontend
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True, required=False
    )
    poll_option_texts = serializers.ListField(
        child=serializers.CharField(max_length=200), write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_name', 'author_username', 'author_role', 
            'title', 'content', 'post_type', 'category', 'tags', 
            'attachments', 'poll_options', 'poll_ends_at',
            'views_count', 'upvotes_count', 'downvotes_count', 'comments_count', 
            'has_upvoted', 'has_downvoted',
            'created_at', 'updated_at', 
            'tag_names', 'poll_option_texts'
        ]
        read_only_fields = ['author', 'views_count']

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False

    def get_has_downvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.downvotes.filter(id=request.user.id).exists()
        return False

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        poll_option_texts = validated_data.pop('poll_option_texts', [])
        
        post = Post.objects.create(**validated_data)
        
        # Handle tag creation/assignment
        for name in tag_names:
            # We enforce lowercase spacing here to avoid "React" vs "react" conflicts
            tag, _ = Tag.objects.get_or_create(name=name.strip().lower())
            post.tags.add(tag)
            
        # Handle poll options creation
        if post.post_type == Post.PostType.POLL:
            for text in poll_option_texts:
                PollOption.objects.create(post=post, text=text)
                
        return post
