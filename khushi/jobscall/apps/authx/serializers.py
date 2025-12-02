from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile, PasswordResetToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
        read_only_fields = ('id', 'is_staff', 'is_active')


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the UserProfile model."""
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = UserProfile
        fields = (
            'id', 'email', 'first_name', 'last_name', 'user_type',
            'phone_number', 'profile_picture', 'bio', 'date_of_birth',
            'address', 'city', 'country', 'postal_code'
        )
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
        # Update user data if present
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Update profile data
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    user_type = serializers.ChoiceField(
        choices=[('candidate', 'Candidate'), ('recruiter', 'Recruiter'), ('employer', 'Employer')],
        write_only=True,
        required=False,
        default='candidate'
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2', 'user_type')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user_type = validated_data.pop('user_type', 'candidate')
        
        # Create user with user_type (users.User model has user_type field)
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            user_type=user_type  # Pass user_type to the User model
        )
        
        # UserProfile will be automatically created by the post_save signal
        # No need to manually create it here
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token obtain pair serializer that includes user data in the response."""
    class Meta:
        ref_name = 'CustomTokenObtainPair'  # Add unique ref_name
        
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = UserSerializer(self.user).data
        return data

class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    class Meta:
        ref_name = 'CustomPasswordResetRequest'  # Add unique ref_name
        
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(_('User with this email does not exist.'))
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    token = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        ref_name = 'CustomPasswordResetConfirm'  # Add this line to avoid conflict with Djoser's serializer

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})
        
        try:
            self.reset_token = PasswordResetToken.objects.get(
                token=attrs['token'],
                is_used=False,
                expires_at__gt=timezone.now()
            )
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({"token": _("Invalid or expired token.")})
        
        return attrs

    def save(self):
        self.reset_token.user.set_password(self.validated_data['password'])
        self.reset_token.user.save()
        self.reset_token.is_used = True
        self.reset_token.save()
        return self.reset_token.user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(_('Your old password was entered incorrectly. Please enter it again.'))
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({'new_password': _("The two password fields didn't match.")})
        return data

    def save(self, **kwargs):
        password = self.validated_data['new_password']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user
