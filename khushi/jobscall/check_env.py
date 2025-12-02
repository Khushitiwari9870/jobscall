import sys
import os
from pathlib import Path

print("=== Python Path ===")
print("\n".join(sys.path))
print("\n=== Current Directory ===")
print(os.getcwd())
print("\n=== Django Setup ===")

try:
    # Set up Django environment
    BASE_DIR = Path(__file__).resolve().parent
    sys.path.append(str(BASE_DIR))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')
    
    import django
    django.setup()
    
    print("Django setup successful!")
    print(f"Django version: {django.get_version()}")
    
    # Try importing the users app
    try:
        from apps.users import models as users_models
        print("Successfully imported users app")
        print(f"Users models: {dir(users_models)}")
    except ImportError as e:
        print(f"Error importing users app: {e}")
        
    # Try importing the saved_searches app
    try:
        from apps.saved_searches import models as saved_searches_models
        print("Successfully imported saved_searches app")
        print(f"SavedSearches models: {dir(saved_searches_models)}")
    except ImportError as e:
        print(f"Error importing saved_searches app: {e}")
        
except Exception as e:
    print(f"Error setting up Django: {e}")
    import traceback
    traceback.print_exc()
