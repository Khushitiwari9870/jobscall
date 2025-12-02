"""
Views for authentication and user management.
"""

import logging
from django.conf import settings
from django.utils import timezone
from django.utils.decorators import method_decorator
from datetime import timedelta
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from .models import UserProfile, PasswordResetToken
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    CustomTokenObtainPairSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, ChangePasswordSerializer
)

User = get_user_model()

logger = logging.getLogger(__name__)


class PingView(APIView):
    """Simple ping view to check if the API is working."""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({"message": "pong"})


class RegisterView(generics.CreateAPIView):
    """View for user registration."""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    """View for user login."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class ChangePasswordView(generics.UpdateAPIView):
    """View for changing user password."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for retrieving and updating user profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Get or create user profile
        user = self.request.user
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'user_type': UserProfile.UserType.ADMIN if (user.is_superuser or user.is_staff) 
                            else UserProfile.UserType.CANDIDATE
            }
        )
        return profile


class PasswordResetRequestView(generics.GenericAPIView):
    """View for requesting a password reset."""
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Generate and save password reset token
        user = serializer.user
        token = RefreshToken.for_user(user).access_token
        
        # Create password reset token (you might want to use a more secure method)
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=str(token),
            expires_at=timezone.now() + timedelta(hours=24)  # Token expires in 24 hours
        )
        
        # In a real application, you would send an email with the reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token.token}"
        logger.info(f"Password reset link for {user.email}: {reset_link}")
        
        return Response(
            {"message": "If the email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    """View for confirming a password reset."""
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )
