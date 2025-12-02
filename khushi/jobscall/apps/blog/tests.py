from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import os

from .models import Category, Tag, Post, Comment, Subscription

User = get_user_model()

class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Technology',
            slug='technology',
            description='All about technology'
        )
    
    def test_category_creation(self):
        self.assertEqual(str(self.category), 'Technology')
        self.assertEqual(self.category.slug, 'technology')

class TagModelTest(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(
            name='Python',
            slug='python',
            description='Python programming language'
        )
    
    def test_tag_creation(self):
        self.assertEqual(str(self.tag), 'Python')
        self.assertEqual(self.tag.slug, 'python')

class PostModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        self.category = Category.objects.create(
            name='Technology',
            slug='technology'
        )
        
        self.tag = Tag.objects.create(
            name='Python',
            slug='python'
        )
        
        self.post = Post.objects.create(
            title='Test Post',
            slug='test-post',
            content='This is a test post',
            excerpt='Test excerpt',
            author=self.user,
            status='published',
            publish_date=timezone.now()
        )
        
        self.post.categories.add(self.category)
        self.post.tags.add(self.tag)
    
    def test_post_creation(self):
        self.assertEqual(str(self.post), 'Test Post')
        self.assertEqual(self.post.categories.count(), 1)
        self.assertEqual(self.post.tags.count(), 1)
        self.assertEqual(self.post.view_count, 0)
    
    def test_increment_view_count(self):
        self.post.increment_view_count()
        self.post.refresh_from_db()
        self.assertEqual(self.post.view_count, 1)

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        self.post = Post.objects.create(
            title='Test Post',
            slug='test-post',
            content='Content',
            author=self.user,
            status='published',
            publish_date=timezone.now()
        )
        
        self.comment = Comment.objects.create(
            post=self.post,
            author_name='Test User',
            author_email='test@example.com',
            content='Test comment',
            is_approved=True
        )
    
    def test_comment_creation(self):
        self.assertEqual(str(self.comment), 'Comment by Test User on Test Post')
        self.assertFalse(hasattr(self.comment, 'parent'))

class SubscriptionModelTest(TestCase):
    def test_subscription_creation(self):
        subscription = Subscription.objects.create(
            email='test@example.com',
            token='testtoken123'
        )
        self.assertEqual(str(subscription), 'test@example.com')
        self.assertTrue(subscription.is_active)

class BlogAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        
        self.category = Category.objects.create(
            name='Technology',
            slug='technology'
        )
        
        self.tag = Tag.objects.create(
            name='Python',
            slug='python'
        )
        
        self.post = Post.objects.create(
            title='Test Post',
            slug='test-post',
            content='This is a test post',
            excerpt='Test excerpt',
            author=self.user,
            status='published',
            publish_date=timezone.now(),
            allow_comments=True
        )
        
        self.post.categories.add(self.category)
        self.post.tags.add(self.tag)
        
        self.comment = Comment.objects.create(
            post=self.post,
            author_name='Test User',
            author_email='test@example.com',
            content='Test comment',
            is_approved=True
        )
        
        self.client = APIClient()
    
    def test_get_posts(self):
        """Test retrieving a list of blog posts."""
        url = reverse('blog:post-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Post')
    
    def test_get_single_post(self):
        """Test retrieving a single blog post."""
        url = reverse('blog:post-detail', args=[self.post.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post')
        self.assertEqual(response.data['view_count'], 1)  # View count should increment
    
    def test_get_comments(self):
        """Test retrieving comments for a post."""
        url = reverse('blog:post-comment-list', args=[self.post.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'Test comment')
    
    def test_create_comment(self):
        """Test creating a new comment."""
        url = reverse('blog:post-comment-list', args=[self.post.slug])
        data = {
            'author_name': 'New User',
            'author_email': 'new@example.com',
            'content': 'New test comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)
    
    def test_subscribe(self):
        """Test subscribing to the blog."""
        url = reverse('blog:subscription-list')
        data = {'email': 'new@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscription.objects.filter(email='new@example.com').exists())
    
    def test_get_categories(self):
        """Test retrieving categories."""
        url = reverse('blog:category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Technology')
    
    def test_get_tags(self):
        """Test retrieving tags."""
        url = reverse('blog:tag-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Python')
