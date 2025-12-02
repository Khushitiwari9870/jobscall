from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Job, JobApplication
from .serializers import (
    JobListSerializer, JobDetailSerializer, 
    JobApplicationSerializer, JobSearchSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

def ping(_request):
    return JsonResponse({"status": "ok", "app": "jobs"})

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["created_at", "min_salary", "max_salary"]
    ordering = ["-created_at"]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Handle schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Job.objects.none()
            
        # For the 'my_jobs' action, return all jobs for the user.
        # For the public list, filter by 'published' status.
        if self.action == 'my_jobs':
            if not self.request.user.is_authenticated:
                return Job.objects.none()
            queryset = Job.objects.filter(posted_by=self.request.user)
        else:
            queryset = Job.objects.filter(status='published')

        queryset = queryset.select_related("company")
        
        # Apply additional filters
        experience = self.request.query_params.get('experience')
        if experience:
            queryset = queryset.filter(experience=experience)
            
        employment_type = self.request.query_params.get('employment_type')
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
            
        min_salary = self.request.query_params.get('min_salary')
        if min_salary:
            queryset = queryset.filter(
                Q(min_salary__gte=min_salary) | Q(max_salary__gte=min_salary)
            )
            
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        # Filter out expired jobs
        queryset = queryset.filter(
            Q(application_deadline__isnull=True) | 
            Q(application_deadline__gte=timezone.now().date())
        )
        

        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        elif self.action in ['apply', 'applications']:
            return JobApplicationSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {"detail": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create application
        application = serializer.save(job=job, applicant=request.user, status='applied')
        
        # In a real app, you would send email notifications here
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_jobs(self, request):
        """Return a list of jobs posted by the current user."""
        self.pagination_class = StandardResultsSetPagination
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        job = self.get_object()
        if request.user != job.posted_by and not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to view these applications."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        applications = job.applications.select_related('applicant').all()
        page = self.paginate_queryset(applications)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class JobSearchViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = JobSearchSerializer
    
    def list(self, request):
        serializer = self.serializer_class(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        queryset = Job.objects.filter(is_active=True).select_related('company')
        
        # Apply search filters
        search_query = Q()
        
        # Text search
        search_terms = serializer.validated_data.get('search', '').split()
        for term in search_terms:
            search_query &= (
                Q(title__icontains=term) |
                Q(description__icontains=term) |
                Q(requirements__icontains=term) |
                Q(skills_required__icontains=term) |
                Q(company__name__icontains=term)
            )
        
        if search_terms:
            queryset = queryset.filter(search_query)
        
        # Location filter
        location = serializer.validated_data.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Experience filter
        experience = serializer.validated_data.get('experience')
        if experience:
            queryset = queryset.filter(experience=experience)
        
        # Employment type filter
        employment_type = serializer.validated_data.get('employment_type')
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
        
        # Salary filter
        min_salary = serializer.validated_data.get('min_salary')
        if min_salary is not None:
            queryset = queryset.filter(
                Q(min_salary__gte=min_salary) | Q(max_salary__gte=min_salary)
            )
        
        # Filter out expired jobs
        queryset = queryset.filter(
            Q(application_deadline__isnull=True) | 
            Q(application_deadline__gte=timezone.now().date())
        )
        
        # Sorting
        sort_by = serializer.validated_data.get('sort_by', 'relevance')
        if sort_by == 'date':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'salary_high':
            queryset = queryset.order_by('-max_salary', '-min_salary')
        elif sort_by == 'salary_low':
            queryset = queryset.order_by('min_salary', 'max_salary')
        # Default is relevance (sort by most recent)
        else:
            queryset = queryset.order_by('-created_at')
        
        # Pagination
        page_size = min(
            serializer.validated_data.get('page_size', 10),
            50  # Max page size
        )
        paginator = StandardResultsSetPagination()
        paginator.page_size = page_size
        
        page = paginator.paginate_queryset(queryset, request)
        serializer = JobListSerializer(page, many=True, context={'request': request})
        
        return paginator.get_paginated_response(serializer.data)


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own applications
        return JobApplication.objects.filter(applicant=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user, status='applied')
