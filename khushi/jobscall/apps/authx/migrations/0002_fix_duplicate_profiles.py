from django.db import migrations


def fix_duplicate_profiles(apps, schema_editor):
    """Fix duplicate user profiles."""
    User = apps.get_model('authx', 'User')
    UserProfile = apps.get_model('authx', 'UserProfile')
    
    # Find users with multiple profiles
    from django.db.models import Count
    
    # Get users with more than one profile
    duplicate_users = User.objects.annotate(
        profile_count=Count('profile')
    ).filter(profile_count__gt=1)
    
    for user in duplicate_users:
        # Get all profiles for this user
        profiles = UserProfile.objects.filter(user=user).order_by('pk')
        if profiles.exists():
            # Keep the first profile
            first_profile = profiles.first()
            # Delete all other profiles
            UserProfile.objects.filter(user=user).exclude(pk=first_profile.pk).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('authx', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(fix_duplicate_profiles, migrations.RunPython.noop),
    ]
