from rest_framework import serializers
from .models import SearchLog, SavedSearch
from django.utils import timezone
from datetime import timedelta


class SearchLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    search_type_display = serializers.CharField(source='get_search_type_display', read_only=True)
    
    class Meta:
        model = SearchLog
        fields = [
            "id",
            "user",
            "username",
            "search_type",
            "search_type_display",
            "query",
            "location",
            "experience",
            "salary",
            "job_type",
            "skills",
            "company",
            "posted_within",
            "work_from_home",
            "results_count",
            "created_at",
        ]
        read_only_fields = ["created_at", "username", "results_count"]


class JobSearchSerializer(serializers.Serializer):
    """Serializer for job search parameters"""
    # Main search fields
    query = serializers.CharField(required=False, allow_blank=True, help_text="Job title, skills, or company name")
    location = serializers.CharField(required=False, allow_blank=True, help_text="City, state, or postal code")
    
    # Experience filters
    EXPERIENCE_LEVELS = [
        ('fresher', 'Fresher'),
        ('0-1', '0-1 years'),
        ('1-3', '1-3 years'),
        ('3-5', '3-5 years'),
        ('5-10', '5-10 years'),
        ('10+', '10+ years'),
    ]
    experience = serializers.MultipleChoiceField(
        choices=EXPERIENCE_LEVELS, 
        required=False,
        help_text="Experience level filters"
    )
    
    # Salary filters
    SALARY_RANGES = [
        ('0-3', '0-3 LPA'),
        ('3-6', '3-6 LPA'),
        ('6-10', '6-10 LPA'),
        ('10-15', '10-15 LPA'),
        ('15-25', '15-25 LPA'),
        ('25+', '25+ LPA'),
    ]
    salary = serializers.MultipleChoiceField(
        choices=SALARY_RANGES,
        required=False,
        help_text="Salary range in LPA (Lakhs Per Annum)"
    )
    
    # Job type filters
    JOB_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
        ('remote', 'Remote'),
    ]
    job_type = serializers.MultipleChoiceField(
        choices=JOB_TYPES,
        required=False,
        help_text="Type of employment"
    )
    
    # Additional filters
    skills = serializers.CharField(required=False, allow_blank=True, help_text="Comma-separated list of skills")
    company = serializers.CharField(required=False, allow_blank=True, help_text="Company name")
    
    # Date posted filter
    DATE_POSTED_CHOICES = [
        (1, 'Last 24 hours'),
        (3, 'Last 3 days'),
        (7, 'Last week'),
        (15, 'Last 15 days'),
        (30, 'Last month'),
    ]
    posted_within = serializers.ChoiceField(
        choices=DATE_POSTED_CHOICES,
        required=False,
        help_text="Jobs posted within the specified time frame"
    )
    
    # Location type filters
    location_type = serializers.MultipleChoiceField(
        choices=[
            ('onsite', 'On-Site'),
            ('remote', 'Remote'),
            ('hybrid', 'Hybrid'),
        ],
        required=False,
        help_text="Type of work location"
    )
    
    # Job features
    job_features = serializers.MultipleChoiceField(
        choices=[
            ('walk_in', 'Walk-in'),
            ('work_from_home', 'Work from home'),
            ('immediate_joining', 'Immediate Joining'),
            ('relocation', 'Relocation Assistance'),
        ],
        required=False,
        help_text="Additional job features"
    )
    
    # Industry filters
    industry = serializers.CharField(required=False, allow_blank=True, help_text="Industry or sector")
    
    # Company type
    company_type = serializers.MultipleChoiceField(
        choices=[
            ('startup', 'Startup'),
            ('mnc', 'MNC'),
            ('corporate', 'Corporate'),
            ('non_profit', 'Non-Profit'),
            ('government', 'Government'),
        ],
        required=False,
        help_text="Type of company"
    )
    
    # Pagination
    page = serializers.IntegerField(min_value=1, default=1)
    page_size = serializers.IntegerField(min_value=1, max_value=100, default=10)
    
    # Sorting options
    SORT_CHOICES = [
        ('relevance', 'Relevance'),
        ('date', 'Most Recent'),
        ('salary_high', 'Salary: High to Low'),
        ('salary_low', 'Salary: Low to High'),
        ('experience_high', 'Experience: High to Low'),
        ('experience_low', 'Experience: Low to High'),
    ]
    sort_by = serializers.ChoiceField(choices=SORT_CHOICES, default='relevance')
    
    def validate(self, data):
        """
        Validate and clean the search parameters
        """
        # Convert empty strings to None
        for field in ['query', 'location', 'skills', 'company', 'industry']:
            if field in data and data[field] == '':
                data[field] = None
                
        # Convert skills to a list
        if data.get('skills'):
            data['skills'] = [skill.strip().lower() for skill in data['skills'].split(',') if skill.strip()]
            
        return data
    
    def get_search_filters(self):
        """
        Convert serializer data to search filters
        """
        data = self.validated_data
        filters = {}
        
        # Basic text search
        if data.get('query'):
            filters['search_query'] = data['query']
            
        # Location filter
        if data.get('location'):
            filters['location__icontains'] = data['location']
            
        # Experience filter
        if data.get('experience'):
            filters['experience__in'] = data['experience']
            
        # Salary filter
        if data.get('salary'):
            salary_query = Q()
            for salary_range in data['salary']:
                if salary_range == '0-3':
                    salary_query |= Q(max_salary__lte=300000)
                elif salary_range == '3-6':
                    salary_query |= (Q(min_salary__gte=300000) & Q(max_salary__lte=600000))
                elif salary_range == '6-10':
                    salary_query |= (Q(min_salary__gte=600000) & Q(max_salary__lte=1000000))
                elif salary_range == '10-15':
                    salary_query |= (Q(min_salary__gte=1000000) & Q(max_salary__lte=1500000))
                elif salary_range == '15-25':
                    salary_query |= (Q(min_salary__gte=1500000) & Q(max_salary__lte=2500000))
                elif salary_range == '25+':
                    salary_query |= Q(min_salary__gte=2500000)
            filters['salary_query'] = salary_query
            
        # Job type filter
        if data.get('job_type'):
            job_type_query = Q()
            for job_type in data['job_type']:
                if job_type == 'remote':
                    job_type_query |= Q(work_from_home=True)
                else:
                    job_type_query |= Q(employment_type=job_type)
            filters['job_type_query'] = job_type_query
            
        # Date posted filter
        if data.get('posted_within'):
            from django.utils import timezone
            from datetime import timedelta
            days = int(data['posted_within'])
            filters['created_at__gte'] = timezone.now() - timedelta(days=days)
            
        # Location type filter
        if data.get('location_type'):
            location_query = Q()
            if 'remote' in data['location_type']:
                location_query |= Q(work_from_home=True)
            if 'onsite' in data['location_type']:
                location_query |= Q(work_from_home=False)
            if 'hybrid' in data['location_type']:
                location_query |= Q(work_from_home=None)  # Assuming None means hybrid
            filters['location_query'] = location_query
            
        # Job features filter
        if data.get('job_features'):
            features_query = Q()
            if 'walk_in' in data['job_features']:
                features_query |= Q(walk_in_interview=True)
            if 'work_from_home' in data['job_features']:
                features_query |= Q(work_from_home=True)
            if 'immediate_joining' in data['job_features']:
                features_query |= Q(immediate_joining=True)
            if 'relocation' in data['job_features']:
                features_query |= Q(relocation_assistance=True)
            filters['features_query'] = features_query
            
        # Industry filter
        if data.get('industry'):
            filters['industry__icontains'] = data['industry']
            
        # Company type filter
        if data.get('company_type'):
            filters['company__company_type__in'] = data['company_type']
            
        return filters
    
    def get_ordering(self):
        """
        Get the ordering parameters based on sort_by
        """
        sort_by = self.validated_data.get('sort_by', 'relevance')
        
        if sort_by == 'date':
            return ['-created_at']
        elif sort_by == 'salary_high':
            return ['-max_salary', '-min_salary']
        elif sort_by == 'salary_low':
            return ['min_salary', 'max_salary']
        elif sort_by == 'experience_high':
            return ['-experience_years']
        elif sort_by == 'experience_low':
            return ['experience_years']
        else:  # relevance
            return []  # Will be handled by search backend
    
    def validate(self, data):
        """
        Validate and clean the search parameters
        """
        # Convert empty strings to None
        for field in ['query', 'location', 'experience', 'salary', 'job_type', 'skills', 'company']:
            if field in data and data[field] == '':
                data[field] = None
                
        # Convert skills to a list
        if data.get('skills'):
            data['skills'] = [skill.strip() for skill in data['skills'].split(',') if skill.strip()]
            
        return data
    
    def get_search_filters(self):
        """
        Convert serializer data to search filters
        """
        data = self.validated_data
        filters = {}
        
        # Basic filters
        for field in ['location', 'experience', 'job_type', 'company']:
            if data.get(field):
                filters[field] = data[field]
                
        # Salary filter
        if data.get('salary'):
            # Handle different salary formats (e.g., "3-6 LPA", "6 LPA & above")
            if '-' in data['salary']:
                min_salary, max_salary = data['salary'].split('-')
                filters['min_salary__gte'] = int(min_salary.strip().split()[0]) * 100000  # Convert LPA to annual
                filters['max_salary__lte'] = int(max_salary.strip().split()[0]) * 100000
            elif '& above' in data['salary']:
                min_salary = int(data['salary'].split()[0]) * 100000
                filters['min_salary__gte'] = min_salary
        
        # Date posted filter
        if data.get('posted_within'):
            date_threshold = timezone.now() - timedelta(days=data['posted_within'])
            filters['created_at__gte'] = date_threshold
            
        # Boolean filters
        if data.get('walk_in') is not None:
            filters['walk_in'] = data['walk_in']
            
        if data.get('work_from_home') is not None:
            filters['work_from_home'] = data['work_from_home']
            
        return filters
    
    def get_ordering(self):
        """
        Get the ordering parameter for the queryset
        """
        sort_by = self.validated_data.get('sort_by', 'relevance')
        
        if sort_by == 'date':
            return ['-created_at']
        elif sort_by == 'salary_high':
            return ['-max_salary', '-min_salary']
        elif sort_by == 'salary_low':
            return ['min_salary', 'max_salary']
        # Default: relevance (handled by search backend)
        return []


class SavedSearchSerializer(serializers.ModelSerializer):
    """Serializer for saved searches"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    search_params = serializers.JSONField()
    
    class Meta:
        model = SavedSearch
        fields = [
            'id',
            'user',
            'name',
            'search_params',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_search_params(self, value):
        """Validate that search_params is a dictionary"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Search parameters must be a JSON object.")
        return value
