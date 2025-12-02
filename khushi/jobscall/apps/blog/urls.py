from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'blog'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')

# Nested router for comments
post_router = DefaultRouter()
post_router.register(
    r'comments',
    views.CommentViewSet,
    basename='post-comment'
)

urlpatterns = [
    path('', include(router.urls)),
    path('posts/<slug:post_slug>/', include(post_router.urls)),
    path('subscriptions/unsubscribe/', 
         views.SubscriptionViewSet.as_view({'post': 'unsubscribe'}), 
         name='unsubscribe'),
]
