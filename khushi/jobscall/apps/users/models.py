from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission, PermissionsMixin
from django.utils.translation import gettext_lazy as _


class UserType(models.TextChoices):
    CANDIDATE = 'candidate', _('Candidate')
    EMPLOYER = 'employer', _('Employer')
    ADMIN = 'admin', _('Admin')


class UserManager(BaseUserManager):
    """Custom user model manager where email is the unique identifier for authentication."""
    def create_user(self, email, password=None, user_type=UserType.CANDIDATE, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', UserType.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    """Custom user model that uses email as the unique identifier."""
    username = models.CharField(_('username'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(
        _('User Type'),
        max_length=20,
        choices=UserType.choices,
        default=UserType.CANDIDATE
    )
    is_verified = models.BooleanField(_('verified'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    # Remove the default username field from REQUIRED_FIELDS
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

    @property
    def is_candidate(self):
        return self.user_type == UserType.CANDIDATE

    @property
    def is_employer(self):
        return self.user_type == UserType.EMPLOYER

    @property
    def is_admin(self):
        return self.user_type == UserType.ADMIN or self.is_superuser

    def save(self, *args, **kwargs):
        # Ensure superusers are always admins
        if self.is_superuser and self.user_type != UserType.ADMIN:
            self.user_type = UserType.ADMIN
        super().save(*args, **kwargs)
