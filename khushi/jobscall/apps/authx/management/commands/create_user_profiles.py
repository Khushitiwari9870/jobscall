"""
Management command to create user profiles for existing users.
"""
from django.core.management.base import BaseCommand
from apps.authx.models import User, UserProfile


class Command(BaseCommand):
    help = 'Create user profiles for existing users who do not have one'

    def handle(self, *args, **options):
        users_without_profile = []
        
        for user in User.objects.all():
            try:
                # Try to access the profile
                _ = user.profile
            except UserProfile.DoesNotExist:
                # Profile doesn't exist, add to list
                users_without_profile.append(user)
        
        if not users_without_profile:
            self.stdout.write(
                self.style.SUCCESS('All users already have profiles!')
            )
            return
        
        created_count = 0
        for user in users_without_profile:
            user_type = UserProfile.UserType.ADMIN if (user.is_superuser or user.is_staff) else UserProfile.UserType.CANDIDATE
            UserProfile.objects.create(user=user, user_type=user_type)
            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Created profile for user: {user.email}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully created {created_count} user profiles!')
        )
