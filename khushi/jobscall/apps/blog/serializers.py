from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Category, Tag, Post, Comment, Subscription

class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(
        source='posts.count',
        read_only=True
    )
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description',
            'is_active', 'post_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'post_count']

class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(
        source='posts.count',
        read_only=True
    )
    
    class Meta:
        model = Tag
        fields = [
            'id', 'name', 'slug', 'description',
            'is_active', 'post_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'post_count']

class PostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source='author.get_full_name',
        read_only=True
    )
    
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt',
            'featured_image', 'author_name', 'categories',
            'tags', 'view_count', 'publish_date',
            'is_featured'
        ]
        read_only_fields = ['id', 'view_count']

class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            'content', 'status', 'allow_comments',
            'created_at', 'updated_at'
        ]
        read_only_fields = PostListSerializer.Meta.read_only_fields + [
            'created_at', 'updated_at'
        ]

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'author_name', 'author_email',
            'author_website', 'content', 'is_approved',
            'created_at', 'updated_at', 'replies'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'replies']
    
    def get_replies(self, obj):
        if hasattr(obj, 'replies'):
            return CommentSerializer(
                obj.replies.filter(is_approved=True),
                many=True,
                context=self.context
            ).data
        return []

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'author_name', 'author_email',
            'author_website', 'content', 'parent'
        ]
        extra_kwargs = {
            'parent': {'required': False}
        }
    
    def validate_parent(self, value):
        if value and value.post_id != self.context['post_id']:
            raise serializers.ValidationError(
                _("Parent comment does not belong to this post.")
            )
        return value

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['email', 'is_active']
        read_only_fields = ['is_active', 'token']
    
    def create(self, validated_data):
        from django.utils.crypto import get_random_string
        
        email = validated_data.get('email')
        token = get_random_string(length=32)
        
        subscription, created = Subscription.objects.update_or_create(
            email=email,
            defaults={
                'is_active': True,
                'token': token
            }
        )
        
        return subscription
