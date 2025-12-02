import os
import sys

if __name__ == "__main__":
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')
    
    # Add the project root to the Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)
    
    # Initialize Django
    import django
    django.setup()
    
    # Run the migrations
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'makemigrations', 'emails'])
    execute_from_command_line(['manage.py', 'migrate', 'emails'])
