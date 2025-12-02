import os
import sys

# Add the project root to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')

# Configure Django
import django
django.setup()

# Now try to import the models
from apps.jobs.models import Job, JobApplication

print("Successfully imported models:")
print("- Job")
print("- JobApplication")
