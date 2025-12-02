from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Category, Tag, Post, Comment, Subscription
from .serializers import (
    CategorySerializer, TagSerializer,
    PostListSerializer, PostDetailSerializer,
    CommentSerializer, CommentCreateSerializer,
    SubscriptionSerializer
)
from .permissions import IsAuthorOrReadOnly

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing blog post categories."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return self.queryset.annotate(
            post_count=Count('posts', filter=Q(posts__status='published'))
        )
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get all published posts in this category."""
        category = self.get_object()
        posts = Post.objects.filter(
            categories=category,
            status='published',
            publish_date__lte=timezone.now()
        ).order_by('-publish_date')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing blog post tags."""
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return self.queryset.annotate(
            post_count=Count('posts', filter=Q(posts__status='published'))
        )
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get all published posts with this tag."""
        tag = self.get_object()
        posts = tag.posts.filter(
            status='published',
            publish_date__lte=timezone.now()
        ).order_by('-publish_date')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing blog posts."""
    queryset = Post.objects.filter(
        status='published',
        publish_date__lte=timezone.now()
    )
    serializer_class = PostListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['publish_date', 'view_count']
    ordering = ['-publish_date']
    lookup_field = 'slug'
    lookup_url_kwarg = 'post_slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(categories__slug=category)
        
        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        # Filter by author
        author = self.request.query_params.get('author')
        if author:
            queryset = queryset.filter(author__username=author)
        
        # Filter by featured
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(content__icontains=search)
            )
        
        return queryset.select_related('author')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return super().get_serializer_class()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        if request.user != instance.author:
            instance.increment_view_count()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, post_slug=None):
        """Get related posts."""
        post = self.get_object()
        
        # Get posts with same categories or tags
        related_posts = Post.objects.filter(
            Q(categories__in=post.categories.all()) |
            Q(tags__in=post.tags.all()),
            status='published',
            publish_date__lte=timezone.now()
        ).exclude(id=post.id).distinct()[:5]
        
        serializer = PostListSerializer(related_posts, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    """API endpoint for blog post comments."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        post_slug = self.kwargs.get('post_slug')
        return Comment.objects.filter(
            post__slug=post_slug,
            is_approved=True,
            parent__isnull=True
        ).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return super().get_serializer_class()
    
    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            slug=self.kwargs.get('post_slug'),
            status='published'
        )
        
        # For authenticated users, use their info
        if self.request.user.is_authenticated:
            serializer.save(
                post=post,
                author_name=self.request.user.get_full_name(),
                author_email=self.request.user.email,
                is_approved=not post.allow_comments  # Auto-approve if comments are moderated
            )
        else:
            serializer.save(
                post=post,
                is_approved=not post.allow_comments  # Auto-approve if comments are moderated
            )

class SubscriptionViewSet(viewsets.ModelViewSet):
    """API endpoint for blog subscriptions."""
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post', 'head', 'options']  # Only allow POST for subscription
    
    def get_queryset(self):
        return Subscription.objects.none()  # No list view needed
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already subscribed
        email = serializer.validated_data['email']
        if Subscription.objects.filter(email=email, is_active=True).exists():
            return Response(
                {'detail': _('You are already subscribed.')},
                status=status.HTTP_200_OK
            )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'detail': _('Thank you for subscribing!')},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """Unsubscribe from blog notifications."""
        email = request.data.get('email')
        token = request.data.get('token')
        
        if not email or not token:
            return Response(
                {'error': _('Email and token are required.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            subscription = Subscription.objects.get(
                email=email,
                token=token,
                is_active=True
            )
            subscription.is_active = False
            subscription.save()
            return Response(
                {'detail': _('You have been unsubscribed.')},
                status=status.HTTP_200_OK
            )
        except Subscription.DoesNotExist:
            return Response(
                {'error': _('Invalid subscription.')},
                status=status.HTTP_404_NOT_FOUND
            )
