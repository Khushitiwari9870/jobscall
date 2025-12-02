from django.db.models import Q, Count, F, ExpressionWrapper, fields
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _

from .models import JobPosting, JobApplication, ApplicationNote
from .serializers import (
    JobPostingListSerializer, JobPostingDetailSerializer, JobPostingCreateSerializer,
    JobApplicationSerializer, JobApplicationCreateSerializer,
    JobApplicationStatusUpdateSerializer, JobApplicationNoteCreateSerializer
)
from apps.companies.models import Company
from apps.users.permissions import IsCompanyAdminOrReadOnly, IsCompanyAdmin, IsApplicantOrCompanyAdmin


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination class for API responses."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class JobPostingViewSet(viewsets.ModelViewSet):
    ""
    ViewSet for managing job postings.
    """
    queryset = JobPosting.objects.select_related('company', 'posted_by')
    permission_classes = [IsCompanyAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'company': ['exact'],
        'job_type': ['exact'],
        'experience_level': ['exact'],
        'is_remote': ['exact'],
        'status': ['exact', 'in'],
        'is_featured': ['exact'],
        'created_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
    }
    
    def get_serializer_class(self):
        if self.action == 'list':
            return JobPostingListSerializer
        elif self.action == 'create':
            return JobPostingCreateSerializer
        return JobPostingDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter based on query parameters
        search = self.request.query_params.get('search', '').strip()
        location = self.request.query_params.get('location', '').strip()
        min_salary = self.request.query_params.get('min_salary')
        max_salary = self.request.query_params.get('max_salary')
        
        # Apply search filters
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(requirements__icontains=search) |
                Q(company__name__icontains=search)
            )
        
        # Filter by location
        if location:
            queryset = queryset.filter(
                Q(location__icontains=location) |
                Q(is_remote=True)
            )
        
        # Filter by salary range
        if min_salary:
            queryset = queryset.filter(
                Q(min_salary__gte=min_salary) |
                Q(max_salary__gte=min_salary)
            )
        
        if max_salary:
            queryset = queryset.filter(
                Q(max_salary__lte=max_salary) |
                Q(min_salary__lte=max_salary)
            )
        
        # For non-admin users, only show published and active job postings
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                status='published',
                expires_at__gt=timezone.now()
            )
        # For company admins, show all their company's job postings
        elif hasattr(self.request.user, 'company_admin'):
            queryset = queryset.filter(company=self.request.user.company_admin.company)
        
        # Order by featured and creation date by default
        queryset = queryset.order_by('-is_featured', '-created_at')
        
        return queryset
    
    def perform_create(self, serializer):
        ""Set the posted_by user to the current user and set the company if not provided."""
        if not serializer.validated_data.get('company'):
            if hasattr(self.request.user, 'company_admin'):
                serializer.save(
                    posted_by=self.request.user,
                    company=self.request.user.company_admin.company
                )
            else:
                serializer.save(posted_by=self.request.user)
        else:
            serializer.save(posted_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        """Apply to a job posting."""
        job_posting = self.get_object()
        
        # Check if the job posting is active
        if not job_posting.is_active:
            return Response(
                {'detail': _('This job posting is no longer accepting applications.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the user has already applied
        if JobApplication.objects.filter(
            job_posting=job_posting,
            applicant=request.user
        ).exists():
            return Response(
                {'detail': _('You have already applied to this job.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the application
        serializer = JobApplicationCreateSerializer(
            data=request.data,
            context={
                'request': request,
                'job_posting': job_posting
            }
        )
        
        if serializer.is_valid():
            application = serializer.save()
            return Response(
                JobApplicationSerializer(application).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsCompanyAdmin])
    def applications(self, request, pk=None):
        """List all applications for this job posting."""
        job_posting = self.get_object()
        applications = job_posting.applications.select_related('applicant')
        
        # Filter by status if provided
        status_filter = request.query_params.get('status')
        if status_filter:
            applications = applications.filter(status=status_filter)
        
        # Apply pagination
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = JobApplicationSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsCompanyAdmin])
    def publish(self, request, pk=None):
        """Publish a draft job posting."""
        job_posting = self.get_object()
        
        if job_posting.status != 'draft':
            return Response(
                {'detail': _('Only draft job postings can be published.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job_posting.status = 'published'
        job_posting.published_at = timezone.now()
        
        # Set expiry date if not set (30 days from now)
        if not job_posting.expires_at:
            job_posting.expires_at = timezone.now() + timezone.timedelta(days=30)
        
        job_posting.save()
        
        # TODO: Add notification logic here
        
        return Response(
            JobPostingDetailSerializer(job_posting).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsCompanyAdmin])
    def close(self, request, pk=None):
        """Close a published job posting."""
        job_posting = self.get_object()
        
        if job_posting.status != 'published':
            return Response(
                {'detail': _('Only published job postings can be closed.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job_posting.status = 'closed'
        job_posting.closed_at = timezone.now()
        job_posting.save()
        
        # TODO: Add notification logic here
        
        return Response(
            JobPostingDetailSerializer(job_posting).data,
            status=status.HTTP_200_OK
        )


class JobApplicationViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet for managing job applications.
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """
        Return applications based on user role:
        - Company admins can see all applications for their company's job postings
        - Regular users can only see their own applications
        - Staff users can see all applications
        """
        queryset = JobApplication.objects.select_related(
            'job_posting', 'job_posting__company', 'applicant'
        )
        
        # Regular users can only see their own applications
        if not self.request.user.is_staff and not hasattr(self.request.user, 'company_admin'):
            return queryset.filter(applicant=self.request.user)
        
        # Company admins can see applications for their company's job postings
        if hasattr(self.request.user, 'company_admin'):
            company = self.request.user.company_admin.company
            return queryset.filter(job_posting__company=company)
        
        # Staff users can see all applications
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'update_status':
            return JobApplicationStatusUpdateSerializer
        elif self.action == 'add_note':
            return JobApplicationNoteCreateSerializer
        return JobApplicationSerializer
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update the status of a job application."""
        application = self.get_object()
        serializer = self.get_serializer(application, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Check permissions
            if not self._can_update_application(application, request.user):
                return Response(
                    {'detail': _('You do not have permission to update this application.')},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Update the application
            updated_application = serializer.save()
            
            # Send notifications if needed
            self._handle_status_change_notifications(updated_application)
            
            return Response(
                JobApplicationSerializer(updated_application).data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """Add a note to a job application."""
        application = self.get_object()
        
        # Check permissions
        if not self._can_update_application(application, request.user):
            return Response(
                {'detail': _('You do not have permission to add notes to this application.')},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            note = ApplicationNote.objects.create(
                application=application,
                note=serializer.validated_data['note'],
                created_by=request.user
            )
            
            # Refresh the application to include the new note
            application.refresh_from_db()
            
            return Response(
                JobApplicationSerializer(application).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _can_update_application(self, application, user):
        """Check if the user can update the application."""
        # Staff users can update any application
        if user.is_staff:
            return True
        
        # Company admins can update applications for their company's job postings
        if hasattr(user, 'company_admin') and user.company_admin.company == application.job_posting.company:
            return True
        
        # Applicants can update their own applications (e.g., withdraw)
        if application.applicant == user:
            return True
        
        return False
    
    def _handle_status_change_notifications(self, application):
        """Handle notifications when an application status changes."""
        # TODO: Implement notification logic here
        # This could include:
        # - Email notifications to the applicant
        # - In-app notifications
        # - Integration with external systems
        pass


class MyApplicationsViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet for users to view their own job applications.
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return only the current user's applications."""
        return JobApplication.objects.filter(
            applicant=self.request.user
        ).select_related('job_posting', 'job_posting__company').order_by('-applied_at')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobApplicationSerializer
        return JobApplicationSerializer  # Use list serializer for list view
    
    @action(detail=False, methods=['get'])
    def status_counts(self, request):
        """Get counts of applications by status for the current user."""
        counts = JobApplication.objects.filter(
            applicant=request.user
        ).values('status').annotate(
            count=Count('id')
        )
        
        return Response({
            item['status']: item['count']
            for item in counts
        })
