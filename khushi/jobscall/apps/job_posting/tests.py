from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient, force_authenticate

from apps.companies.models import Company, CompanyAdmin
from .models import JobPosting, JobApplication, ApplicationNote
from .serializers import JobPostingListSerializer, JobPostingDetailSerializer

User = get_user_model()


class JobPostingModelTest(TestCase):
    """Test the JobPosting model."""
    
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
            industry='IT',
            size='1-10',
            founded_year=2020,
        )
        
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        # Create a company admin
        self.company_admin = User.objects.create_user(
            email='admin@testcompany.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        CompanyAdmin.objects.create(
            user=self.company_admin,
            company=self.company,
            position='HR Manager'
        )
        
        self.job_posting = JobPosting.objects.create(
            title='Software Engineer',
            description='We are looking for a skilled software engineer.',
            requirements='3+ years of experience with Python and Django',
            company=self.company,
            location='New York, NY',
            job_type='full_time',
            experience_level='mid_senior',
            min_salary=80000,
            max_salary=120000,
            salary_currency='USD',
            posted_by=self.company_admin,
            status='published',
            expires_at=timezone.now() + timezone.timedelta(days=30)
        )
    
    def test_job_posting_creation(self):
        ""Test job posting creation and string representation."""
        self.assertEqual(str(self.job_posting), 'Software Engineer at Test Company')
        self.assertEqual(self.job_posting.status, 'published')
        self.assertIsNotNone(self.job_posting.created_at)
        self.assertIsNotNone(self.job_posting.updated_at)
    
    def test_job_posting_slug_creation(self):
        ""Test that a slug is automatically created for the job posting."""
        job = JobPosting.objects.create(
            title='Another Software Engineer',
            description='Another job description',
            company=self.company,
            posted_by=self.company_admin
        )
        self.assertIsNotNone(job.slug)
        self.assertIn('another-software-engineer', job.slug)
    
    def test_job_posting_status_transitions(self):
        ""Test job posting status transitions and timestamps."""
        # Test draft to published
        job = JobPosting.objects.create(
            title='Draft Job',
            description='A draft job',
            company=self.company,
            posted_by=self.company_admin,
            status='draft'
        )
        self.assertIsNone(job.published_at)
        
        job.status = 'published'
        job.save()
        self.assertIsNotNone(job.published_at)
        
        # Test published to closed
        job.status = 'closed'
        job.save()
        self.assertIsNotNone(job.closed_at)


class JobApplicationModelTest(TestCase):
    ""Test the JobApplication model."""
    
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
        )
        
        self.company_admin = User.objects.create_user(
            email='admin@testcompany.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        CompanyAdmin.objects.create(
            user=self.company_admin,
            company=self.company,
            position='HR Manager'
        )
        
        self.job_posting = JobPosting.objects.create(
            title='Software Engineer',
            description='Job description',
            company=self.company,
            posted_by=self.company_admin,
            status='published'
        )
        
        self.applicant = User.objects.create_user(
            email='applicant@example.com',
            password='testpass123',
            first_name='Applicant',
            last_name='User'
        )
        
        self.application = JobApplication.objects.create(
            job_posting=self.job_posting,
            applicant=self.applicant,
            cover_letter='I am very interested in this position.',
            status='applied'
        )
    
    def test_application_creation(self):
        ""Test job application creation and string representation."""
        self.assertEqual(
            str(self.application),
            'Applicant User - Software Engineer'
        )
        self.assertEqual(self.application.status, 'applied')
        self.assertIsNotNone(self.application.applied_at)
    
    def test_application_status_updates(self):
        ""Test application status updates and timestamps."""
        self.application.status = 'reviewed'
        self.application.save()
        
        self.application.refresh_from_db()
        self.assertTrue(self.application.is_reviewed)
        self.assertIsNotNone(self.application.reviewed_at)
        
        # Test rejection
        self.application.status = 'rejected'
        self.application.rejection_reason = 'Not a good fit.'
        self.application.save()
        
        self.application.refresh_from_db()
        self.assertTrue(self.application.is_rejected)
    
    def test_application_notes(self):
        ""Test adding notes to an application."""
        note = ApplicationNote.objects.create(
            application=self.application,
            note='This candidate looks promising.',
            created_by=self.company_admin
        )
        
        self.assertEqual(
            str(note),
            'Note for Applicant User - Software Engineer by Admin User'
        )
        self.assertEqual(note.application, self.application)
        self.assertEqual(self.application.notes.count(), 1)


class JobPostingAPITest(APITestCase):
    ""Test the job posting API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        self.company_admin = User.objects.create_user(
            email='companyadmin@example.com',
            password='companyadmin123',
            first_name='Company',
            last_name='Admin'
        )
        
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )
        
        # Create a company and assign admin
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
        )
        
        CompanyAdmin.objects.create(
            user=self.company_admin,
            company=self.company,
            position='HR Manager'
        )
        
        # Create some job postings
        self.job1 = JobPosting.objects.create(
            title='Senior Software Engineer',
            description='Senior developer position',
            company=self.company,
            posted_by=self.company_admin,
            status='published',
            job_type='full_time',
            experience_level='mid_senior',
            min_salary=100000,
            max_salary=150000,
            is_remote=True
        )
        
        self.job2 = JobPosting.objects.create(
            title='Junior Developer',
            description='Entry level developer position',
            company=self.company,
            posted_by=self.company_admin,
            status='published',
            job_type='full_time',
            experience_level='entry',
            min_salary=60000,
            max_salary=80000,
            is_remote=False,
            location='New York, NY'
        )
        
        # Create a draft job
        self.draft_job = JobPosting.objects.create(
            title='Draft Job',
            description='This is a draft job',
            company=self.company,
            posted_by=self.company_admin,
            status='draft'
        )
    
    def test_list_job_postings_unauthorized(self):
        ""Test that anyone can list published job postings."""
        response = self.client.get(reverse('job-posting-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # Only published jobs
    
    def test_retrieve_job_posting(self):
        ""Test retrieving a single job posting."""
        url = reverse('job-posting-detail', kwargs={'pk': self.job1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Senior Software Engineer')
    
    def test_create_job_posting_unauthorized(self):
        ""Test that regular users cannot create job postings."""
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'title': 'New Job',
            'description': 'A new job posting',
            'company': self.company.id,
            'job_type': 'full_time',
            'experience_level': 'mid_senior',
        }
        response = self.client.post(reverse('job-posting-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_job_posting_company_admin(self):
        ""Test that company admins can create job postings."""
        self.client.force_authenticate(user=self.company_admin)
        data = {
            'title': 'New Job',
            'description': 'A new job posting',
            'company': self.company.id,
            'job_type': 'full_time',
            'experience_level': 'mid_senior',
            'min_salary': 90000,
            'max_salary': 110000,
            'is_remote': True
        }
        response = self.client.post(reverse('job-posting-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobPosting.objects.count(), 4)  # 3 existing + 1 new
    
    def test_apply_to_job(self):
        ""Test applying to a job."""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('job-posting-apply', kwargs={'pk': self.job1.pk})
        data = {
            'cover_letter': 'I am very interested in this position.',
            'linkedin_profile': 'https://linkedin.com/in/username'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 1)
        
        # Test that duplicate applications are not allowed
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_company_admin_can_view_applications(self):
        ""Test that company admins can view applications for their jobs."""
        # Create an application
        application = JobApplication.objects.create(
            job_posting=self.job1,
            applicant=self.regular_user,
            status='applied'
        )
        
        self.client.force_authenticate(user=self.company_admin)
        url = reverse('job-posting-applications', kwargs={'pk': self.job1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], application.id)
    
    def test_publish_job_posting(self):
        ""Test publishing a draft job posting."""
        self.client.force_authenticate(user=self.company_admin)
        url = reverse('job-posting-publish', kwargs={'pk': self.draft_job.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.draft_job.refresh_from_db()
        self.assertEqual(self.draft_job.status, 'published')
        self.assertIsNotNone(self.draft_job.published_at)
    
    def test_close_job_posting(self):
        ""Test closing a published job posting."""
        self.client.force_authenticate(user=self.company_admin)
        url = reverse('job-posting-close', kwargs={'pk': self.job1.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.job1.refresh_from_db()
        self.assertEqual(self.job1.status, 'closed')
        self.assertIsNotNone(self.job1.closed_at)


class JobApplicationAPITest(APITestCase):
    ""Test the job application API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        self.company_admin = User.objects.create_user(
            email='companyadmin@example.com',
            password='companyadmin123',
            first_name='Company',
            last_name='Admin'
        )
        
        self.regular_user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
            first_name='Regular',
            last_name='User'
        )
        
        # Create a company and assign admin
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company',
            website='https://testcompany.com',
        )
        
        CompanyAdmin.objects.create(
            user=self.company_admin,
            company=self.company,
            position='HR Manager'
        )
        
        # Create a job posting
        self.job_posting = JobPosting.objects.create(
            title='Software Engineer',
            description='We are looking for a skilled software engineer.',
            company=self.company,
            posted_by=self.company_admin,
            status='published',
            job_type='full_time',
            experience_level='mid_senior',
            min_salary=80000,
            max_salary=120000,
            salary_currency='USD'
        )
        
        # Create an application
        self.application = JobApplication.objects.create(
            job_posting=self.job_posting,
            applicant=self.regular_user,
            cover_letter='I am very interested in this position.',
            status='applied'
        )
    
    def test_list_applications_unauthorized(self):
        ""Test that regular users cannot list all applications."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('job-application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see their own applications
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.application.id)
    
    def test_list_applications_company_admin(self):
        ""Test that company admins can list applications for their jobs."""
        self.client.force_authenticate(user=self.company_admin)
        response = self.client.get(reverse('job-application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_update_application_status(self):
        ""Test updating an application status."""
        self.client.force_authenticate(user=self.company_admin)
        url = reverse('job-application-update-status', kwargs={'pk': self.application.pk})
        data = {'status': 'reviewed'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'reviewed')
        self.assertTrue(self.application.is_reviewed)
    
    def test_add_note_to_application(self):
        ""Test adding a note to an application."""
        self.client.force_authenticate(user=self.company_admin)
        url = reverse('job-application-add-note', kwargs={'pk': self.application.pk})
        data = {'note': 'This candidate looks promising.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertEqual(self.application.notes.count(), 1)
        note = self.application.notes.first()
        self.assertEqual(note.note, 'This candidate looks promising.')
        self.assertEqual(note.created_by, self.company_admin)
    
    def test_my_applications(self):
        ""Test that users can view their own applications."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('my-applications-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.application.id)
    
    def test_application_status_counts(self):
        ""Test getting application status counts."""
        # Create another application with a different status
        JobApplication.objects.create(
            job_posting=self.job_posting,
            applicant=User.objects.create_user(
                email='another@example.com',
                password='testpass123',
                first_name='Another',
                last_name='User'
            ),
            status='reviewed'
        )
        
        self.client.force_authenticate(user=self.company_admin)
        response = self.client.get(reverse('job-application-status-counts'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('applied', 0), 1)
        self.assertEqual(response.data.get('reviewed', 0), 1)
