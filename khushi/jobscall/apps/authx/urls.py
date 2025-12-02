from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    PingView, RegisterView, LoginView, UserProfileView,
    PasswordResetRequestView, PasswordResetConfirmView, ChangePasswordView
)

urlpatterns = [
    # Health check
    path('ping/', PingView.as_view(), name='authx-ping'),
    
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('password/change/', ChangePasswordView.as_view(), name='password-change'),
    
    # Password reset
    path('password/reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
