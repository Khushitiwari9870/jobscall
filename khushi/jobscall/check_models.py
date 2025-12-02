import sys
import os
from pathlib import Path

# Add the project root to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')

import django
django.setup()

from django.apps import apps

def check_models():
    print("\n=== Installed Apps and Models ===")
    for app_config in apps.get_app_configs():
        print(f"\nApp: {app_config.verbose_name} ({app_config.name})")
        print("-" * 50)
        for model in app_config.get_models():
            print(f"  Model: {model.__name__}")
            print(f"    Table: {model._meta.db_table}")
            print(f"    Fields: {[f.name for f in model._meta.fields]}")

if __name__ == "__main__":
    check_models()
