from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    class PostType(models.TextChoices):
        TEXT = 'TEXT', 'Text Post'
        POLL = 'POLL', 'Poll'

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)  # Optional for polls without a body
    post_type = models.CharField(max_length=20, choices=PostType.choices, default=PostType.TEXT)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    
    # Interactions
    views_count = models.PositiveIntegerField(default=0)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvoted_posts', blank=True)
    downvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='downvoted_posts', blank=True)
    
    # Optional Poll expiration
    poll_ends_at = models.DateTimeField(null=True, blank=True)
    
    # Track when the post was created and edited
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PostAttachment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='community/attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.post.title}"

class PollOption(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='poll_options')
    text = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.text} - {self.post.title}"

class PollVote(models.Model):
    poll_option = models.ForeignKey(PollOption, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll_option', 'user')

    def __str__(self):
        return f"{self.user.username} voted for {self.poll_option.text} on {self.poll_option.post.title}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"
