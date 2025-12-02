import os
import sys
from pathlib import Path

def main():
    # Add the project directory to the Python path
    project_dir = Path(__file__).resolve().parent
    sys.path.insert(0, str(project_dir))
    
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')
    
    try:
        import django
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Run makemigrations
    print("Running makemigrations...")
    execute_from_command_line(['manage.py', 'makemigrations', 'saved_searches'])
    
    # Run migrate
    print("\nRunning migrate...")
    execute_from_command_line(['manage.py', 'migrate', 'saved_searches'])

if __name__ == '__main__':
    main()
