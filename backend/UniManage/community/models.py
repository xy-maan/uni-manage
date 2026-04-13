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

    class Visibility(models.TextChoices):
        UNIVERSITY_ONLY = 'UNIVERSITY_ONLY', 'University Only (Private)'
        PUBLIC = 'PUBLIC', 'Public'

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)  # Optional for polls without a body
    post_type = models.CharField(max_length=20, choices=PostType.choices, default=PostType.TEXT)
    visibility = models.CharField(max_length=20, choices=Visibility.choices, default=Visibility.UNIVERSITY_ONLY)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    
    # Track when the post was created and edited
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def author_domain(self):
        """Helper to get the email domain of the author for university filtering."""
        if self.author and self.author.email and '@' in self.author.email:
            return self.author.email.split('@')[1]
        return None

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
        return f"{self.user.username} voted for {self.poll_option.text}"
