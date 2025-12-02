#!/usr/bin/env python
"""
Script to clean up duplicate user profiles and fix database integrity issues.
Run this script to resolve the foreign key constraint errors.
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')

# Setup Django
django.setup()

from django.db import connection
from apps.authx.models import UserProfile
from apps.users.models import User
from apps.profile.models import UserProfile as ProfileUserProfile, EmployerProfile

def cleanup_database():
    """Clean up duplicate and corrupted profiles"""

    print("🧹 Starting database cleanup...")

    # 1. Remove duplicate UserProfiles from authx
    print("1. Checking for duplicate authx UserProfiles...")
    users_with_multiple_profiles = User.objects.filter(
        profile__isnull=False
    ).distinct()

    for user in users_with_multiple_profiles:
        profiles = UserProfile.objects.filter(user=user)
        if profiles.count() > 1:
            # Keep the first profile, delete others
            first_profile = profiles.first()
            deleted_count, _ = profiles.exclude(pk=first_profile.pk).delete()
            print(f"   Removed {deleted_count} duplicate profiles for user: {user.email}")

    # 2. Remove duplicate UserProfiles from profile app
    print("2. Checking for duplicate profile app UserProfiles...")
    for user in User.objects.filter(user_type='candidate'):
        profiles = ProfileUserProfile.objects.filter(user=user)
        if profiles.count() > 1:
            first_profile = profiles.first()
            deleted_count, _ = profiles.exclude(pk=first_profile.pk).delete()
            print(f"   Removed {deleted_count} duplicate candidate profiles for user: {user.email}")

    # 3. Ensure all users have exactly one profile
    print("3. Ensuring all users have proper profiles...")
    users_without_profile = []

    for user in User.objects.all():
        try:
            # Check if user has authx profile
            _ = user.profile
        except UserProfile.DoesNotExist:
            users_without_profile.append(user)

    for user in users_without_profile:
        # Create missing profile
        user_type = 'admin' if user.is_superuser or user.is_staff else 'candidate'
        UserProfile.objects.create(user=user, user_type=user_type)
        print(f"   Created missing profile for user: {user.email}")

    print("✅ Database cleanup completed!")

    # Show final state
    total_users = User.objects.count()
    total_authx_profiles = UserProfile.objects.count()
    total_profile_profiles = ProfileUserProfile.objects.count()
    total_employer_profiles = EmployerProfile.objects.count()

    print("
📊 Final Database State:"    print(f"   Total Users: {total_users}")
    print(f"   AuthX UserProfiles: {total_authx_profiles}")
    print(f"   Profile UserProfiles: {total_profile_profiles}")
    print(f"   Employer Profiles: {total_employer_profiles}")

if __name__ == "__main__":
    try:
        cleanup_database()
        print("\n🎉 Database cleanup successful! You can now restart your Django server.")
    except Exception as e:
        print(f"\n❌ Error during cleanup: {e}")
        sys.exit(1)
