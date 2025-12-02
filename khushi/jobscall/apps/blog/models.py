from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.text import slugify
from django.utils.functional import classproperty

class Category(models.Model):
    """Blog post category"""
    name = models.CharField(_('Name'), max_length=100)
    slug = models.SlugField(_('Slug'), max_length=100, unique=True)
    description = models.TextField(_('Description'), blank=True)
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ('name',)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blog:category_detail', args=[self.slug])

class Tag(models.Model):
    """Blog post tag"""
    name = models.CharField(_('Name'), max_length=50, unique=True)
    slug = models.SlugField(_('Slug'), max_length=50, unique=True)
    description = models.TextField(_('Description'), blank=True)
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)

    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')
        ordering = ('name',)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blog:tag_detail', args=[self.slug])

class PostStatus(models.TextChoices):
    DRAFT = 'draft', _('Draft')
    PUBLISHED = 'published', _('Published')
    ARCHIVED = 'archived', _('Archived')


class Post(models.Model):
    """Blog post model"""
    
    title = models.CharField(_('Title'), max_length=200)
    slug = models.SlugField(_('Slug'), max_length=200, unique_for_date='publish_date')
    excerpt = models.TextField(_('Excerpt'), blank=True)
    content = models.TextField(_('Content'))
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts',
        verbose_name=_('Author')
    )
    
    featured_image = models.ImageField(
        _('Featured Image'),
        upload_to='blog/images/%Y/%m/%d/',
        blank=True,
        null=True
    )
    
    categories = models.ManyToManyField(
        Category,
        related_name='posts',
        verbose_name=_('Categories')
    )
    
    tags = models.ManyToManyField(
        Tag,
        related_name='posts',
        verbose_name=_('Tags'),
        blank=True
    )
    
    status = models.CharField(
        _('Status'),
        max_length=10,
        choices=PostStatus.choices,
        default=PostStatus.DRAFT
    )
    
    is_featured = models.BooleanField(_('Is Featured'), default=False)
    allow_comments = models.BooleanField(_('Allow Comments'), default=True)
    view_count = models.PositiveIntegerField(_('View Count'), default=0)
    
    publish_date = models.DateTimeField(_('Publish Date'), default=timezone.now)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Post')
        verbose_name_plural = _('Posts')
        ordering = ('-publish_date',)
        indexes = [
            models.Index(fields=['-publish_date']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blog:post_detail', args=[
            self.publish_date.year,
            self.publish_date.month,
            self.publish_date.day,
            self.slug
        ])
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

class Comment(models.Model):
    """Blog post comment"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_('Post')
    )
    
    author_name = models.CharField(_('Author Name'), max_length=100)
    author_email = models.EmailField(_('Author Email'))
    author_website = models.URLField(_('Author Website'), blank=True)
    
    content = models.TextField(_('Content'))
    is_approved = models.BooleanField(_('Is Approved'), default=False)
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name=_('Parent Comment')
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Comment')
        verbose_name_plural = _('Comments')
        ordering = ('created_at',)
    
    def __str__(self):
        return f'Comment by {self.author_name} on {self.post}'

class Subscription(models.Model):
    """Blog subscription for email notifications"""
    email = models.EmailField(_('Email'), unique=True)
    is_active = models.BooleanField(_('Is Active'), default=True)
    token = models.CharField(_('Token'), max_length=100, unique=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Subscription')
        verbose_name_plural = _('Subscriptions')
        ordering = ('-created_at',)
    
    def __str__(self):
        return self.email
