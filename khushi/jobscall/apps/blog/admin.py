from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import Category, Tag, Post, Comment, Subscription

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ('created_at', 'updated_at')
    fields = ('author_name', 'author_email', 'content', 'is_approved')
    ordering = ('-created_at',)

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'publish_date', 'view_count')
    list_filter = ('status', 'publish_date', 'categories', 'tags')
    search_fields = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'publish_date'
    ordering = ('-publish_date',)
    readonly_fields = ('view_count', 'created_at', 'updated_at')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'author':
            User = get_user_model()
            # Get only active staff users who can add posts
            kwargs['queryset'] = User.objects.filter(is_staff=True, is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'author', 'featured_image')
        }),
        (_('Content'), {
            'fields': ('excerpt', 'content')
        }),
        (_('Metadata'), {
            'fields': ('categories', 'tags', 'status', 'is_featured', 'allow_comments')
        }),
        (_('Publishing'), {
            'fields': ('publish_date', 'view_count')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [CommentInline]
    
    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'post_count')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at', 'post_count')
    
    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = _('Posts')

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'post_count')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'post_count')
    
    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = _('Posts')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'post_title', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('author_name', 'author_email', 'content')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('post', 'author_name', 'author_email', 'author_website')
        }),
        (_('Content'), {
            'fields': ('content', 'is_approved')
        }),
        (_('Relations'), {
            'fields': ('parent',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = _('Post')
    post_title.admin_order_field = 'post__title'

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email', 'token')
    readonly_fields = ('token', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('email', 'is_active', 'token')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

admin.site.register(Post, PostAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
