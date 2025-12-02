import os
import sys

if __name__ == "__main__":
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')
    
    # Add the project root and apps directory to the Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    apps_dir = os.path.join(project_root, 'apps')
    
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    if apps_dir not in sys.path:
        sys.path.insert(0, apps_dir)
    
    # Print the Python path for debugging
    print("Python path:")
    for path in sys.path:
        print(f" - {path}")
    
    # Initialize Django
    try:
        import django
        django.setup()
        
        from django.conf import settings
        print("\nInstalled apps:")
        for app in settings.INSTALLED_APPS:
            print(f" - {app}")
        
        # Run the migrations
        from django.core.management import execute_from_command_line
        
        print("\nCreating migrations for 'emails' app...")
        execute_from_command_line(['manage.py', 'makemigrations', 'emails'])
        
        print("\nApplying migrations for 'emails' app...")
        execute_from_command_line(['manage.py', 'migrate', 'emails'])
        
    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
