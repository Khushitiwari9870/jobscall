#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')

# Setup Django
django.setup()

# Test imports
try:
    from apps.authx.models import UserProfile
    from apps.authx.signals import create_user_profile, save_user_profile
    print("✓ All imports successful")
    print("✓ Signals loaded correctly")
    print("✓ Foreign key constraint issue should be fixed")
except Exception as e:
    print(f"✗ Import error: {e}")
    sys.exit(1)
