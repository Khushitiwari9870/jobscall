import os
import sys

if __name__ == "__main__":
    # Add the project root to the Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)
    
    # Set the Django settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobscall.settings")
    
    # Configure Django
    import django
    django.setup()
    
    # Run the migrations
    from django.core.management import execute_from_command_line
    
    # Run the migration for the jobs app
    execute_from_command_line(['manage.py', 'migrate', 'jobs'])
