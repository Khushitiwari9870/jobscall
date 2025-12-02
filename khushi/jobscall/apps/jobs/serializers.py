from rest_framework import serializers
from .models import Job, JobApplication
from apps.companies.models import Company
from django.contrib.auth import get_user_model

User = get_user_model()

class JobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name')
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    salary_range = serializers.SerializerMethodField()
    posted_on = serializers.DateTimeField(source='created_at', format='%d %b %Y')
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'company_logo', 'location',
            'employment_type', 'experience', 'salary_range', 'posted_on',
            'skills', 'status'
        ]
        read_only_fields = ['company_name', 'company_logo', 'posted_on']
    
    def get_salary_range(self, obj):
        return obj.salary_range
    
    def get_skills(self, obj):
        return obj.get_skills_list()


class JobDetailSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=True
    )
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_description = serializers.CharField(source='company.description', read_only=True)
    company_website = serializers.URLField(source='company.website', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    salary_range = serializers.SerializerMethodField()
    posted_on = serializers.DateTimeField(source='created_at', format='%d %b %Y')
    skills = serializers.SerializerMethodField()
    application_deadline = serializers.DateField(format='%d %b %Y')
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'requirements', 'company', 'company_name',
            'company_description', 'company_website', 'company_logo', 'location',
            'employment_type', 'experience', 'min_salary', 'max_salary', 'salary_range',
            'posted_on', 'application_deadline', 'category', 'skills',
            'is_active', 'status'
        ]
        read_only_fields = [
            'company_name', 'company_description', 'company_website', 'company_logo',
            'posted_on', 'status'
            'posted_on', 'salary_range'
        ]
    
    def get_salary_range(self, obj):
        return obj.salary_range
    
    def get_skills(self, obj):
        return obj.get_skills_list()


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.email', read_only=True)
    applied_on = serializers.DateTimeField(source='applied_at', format='%d %b %Y', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'applicant', 'applicant_name',
            'applicant_email', 'cover_letter', 'resume', 'status', 'applied_on',
            'updated_at'
        ]
        read_only_fields = [
            'job_title', 'company_name', 'applicant_name', 'applicant_email',
            'applied_on', 'status', 'updated_at'
        ]
    
    def validate(self, data):
        request = self.context.get('request')
        if request and request.method == 'POST':
            job = data.get('job')
            if JobApplication.objects.filter(job=job, applicant=request.user).exists():
                raise serializers.ValidationError("You have already applied for this job.")
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['applicant'] = request.user
        return super().create(validated_data)


class JobSearchSerializer(serializers.Serializer):
    search = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.ChoiceField(
        choices=Job.EXPERIENCE_LEVELS,
        required=False,
        allow_blank=True
    )
    employment_type = serializers.ChoiceField(
        choices=Job.EMPLOYMENT_TYPES,
        required=False,
        allow_blank=True
    )
    min_salary = serializers.IntegerField(required=False, min_value=0)
    sort_by = serializers.ChoiceField(
        choices=[
            ('relevance', 'Relevance'),
            ('date', 'Most Recent'),
            ('salary_high', 'Salary: High to Low'),
            ('salary_low', 'Salary: Low to High')
        ],
        required=False,
        default='relevance'
    )
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    page_size = serializers.IntegerField(required=False, min_value=1, max_value=50, default=10)

    def validate(self, data):
        if data.get('min_salary') is not None and data['min_salary'] < 0:
            raise serializers.ValidationError({"min_salary": "Minimum salary cannot be negative."})
        return data
