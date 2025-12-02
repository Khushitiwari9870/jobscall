from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django.db.models import Count, Q, F
from django.utils import timezone

from .models import (
    RecruiterProfile,
    RecruiterMembership,
    JobPosting,
    CandidateSearch,
    RecruiterActivity
)
from .serializers import (
    RecruiterProfileSerializer,
    RecruiterMembershipSerializer,
    JobPostingSerializer,
    CandidateSearchSerializer,
    RecruiterActivitySerializer,
    RecruiterDashboardSerializer,
    CandidateAdvancedSearchSerializer
)
from users.models import UserProfile
from django.db.models import Q


class RecruiterProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for managing recruiter profiles"""
    serializer_class = RecruiterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Recruiters can only see their own profile
        if self.request.user.is_staff:
            return RecruiterProfile.objects.all()
        return RecruiterProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        # For non-staff users, always return their own profile
        if not self.request.user.is_staff:
            return self.request.user.recruiter_profile
        return super().get_object()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's recruiter profile"""
        profile = get_object_or_404(RecruiterProfile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class RecruiterMembershipViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing recruiter memberships"""
    serializer_class = RecruiterMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Recruiters can only see their own membership
        if self.request.user.is_staff:
            return RecruiterMembership.objects.all()
        return RecruiterMembership.objects.filter(recruiter__user=self.request.user)


class JobPostingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing job postings"""
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = JobPosting.objects.select_related(
            'job', 'recruiter__user', 'recruiter__company'
        )
        
        # Filter by status if provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        # For non-staff users, only show their own postings
        if not self.request.user.is_staff:
            queryset = queryset.filter(recruiter__user=self.request.user)
            
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the recruiter to the current user's recruiter profile
        recruiter = self.request.user.recruiter_profile
        serializer.save(recruiter=recruiter)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a job posting"""
        job_posting = self.get_object()
        job_posting.status = 'published'
        job_posting.published_at = timezone.now()
        job_posting.save()
        
        # Log the activity
        RecruiterActivity.objects.create(
            recruiter=job_posting.recruiter,
            activity_type='job_post',
            details={'job_id': job_posting.job_id, 'status': 'published'}
        )
        
        return Response({'status': 'Job published successfully'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a job posting"""
        job_posting = self.get_object()
        job_posting.status = 'closed'
        job_posting.closed_at = timezone.now()
        job_posting.save()
        
        # Log the activity
        RecruiterActivity.objects.create(
            recruiter=job_posting.recruiter,
            activity_type='job_edit',
            details={'job_id': job_posting.job_id, 'status': 'closed'}
        )
        
        return Response({'status': 'Job closed successfully'})


class CandidateSearchViewSet(viewsets.ModelViewSet):
    """ViewSet for managing candidate searches"""
    serializer_class = CandidateSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Recruiters can only see their own saved searches
        return CandidateSearch.objects.filter(recruiter__user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the recruiter to the current user's recruiter profile
        recruiter = self.request.user.recruiter_profile
        serializer.save(recruiter=recruiter)
        
        # Log the activity
        RecruiterActivity.objects.create(
            recruiter=recruiter,
            activity_type='search',
            details={'search_id': serializer.instance.id}
        )


class RecruiterActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing recruiter activities"""
    serializer_class = RecruiterActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Recruiters can only see their own activities
        queryset = RecruiterActivity.objects.filter(
            recruiter__user=self.request.user
        ).select_related('recruiter__user', 'recruiter__company')
        
        # Filter by activity type if provided
        activity_type = self.request.query_params.get('activity_type')
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
            
        return queryset.order_by('-created_at')


class CandidateAdvancedSearchView(viewsets.GenericViewSet):
    """View for advanced candidate search functionality"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CandidateAdvancedSearchSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        search_params = serializer.validated_data
        queryset = UserProfile.objects.filter(user__is_active=True).select_related('user')
        
        # Apply filters based on search parameters
        if search_params.get('keyword'):
            keyword = search_params['keyword']
            queryset = queryset.filter(
                Q(user__first_name__icontains=keyword) |
                Q(user__last_name__icontains=keyword) |
                Q(headline__icontains=keyword) |
                Q(summary__icontains=keyword) |
                Q(skills__name__icontains=keyword)
            ).distinct()
        
        if search_params.get('location'):
            locations = [loc.lower() for loc in search_params['location']]
            queryset = queryset.filter(
                Q(current_city__name__in=locations) |
                Q(current_country__name__in=locations)
            )
        
        if search_params.get('skills'):
            queryset = queryset.filter(
                skills__name__in=search_params['skills']
            ).distinct()
        
        if search_params.get('experience'):
            # Implement experience filtering logic
            pass
        
        if search_params.get('salary'):
            # Implement salary filtering logic
            pass
        
        # Add more filters based on other parameters
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            # Serialize the results
            results = [{
                'id': profile.id,
                'name': f"{profile.user.first_name} {profile.user.last_name}",
                'headline': profile.headline,
                'location': profile.current_city.name if profile.current_city else '',
                'experience': profile.total_experience_years,
                'skills': list(profile.skills.values_list('name', flat=True)[:5]),
                'last_active': profile.updated_at.strftime('%b %Y')
            } for profile in page]
            
            return self.get_paginated_response(results)
        
        return Response({"error": "No results found"}, status=status.HTTP_404_NOT_FOUND)
    
    @property
    def paginator(self):
        if not hasattr(self, '_paginator'):
            from rest_framework.pagination import PageNumberPagination
            self._paginator = PageNumberPagination()
            self._paginator.page_size = 10
        return self._paginator
    
    def paginate_queryset(self, queryset):
        return self.paginator.paginate_queryset(
            queryset, self.request, view=self)
    
    def get_paginated_response(self, data):
        return self.paginator.get_paginated_response(data)


class RecruiterDashboardViewSet(viewsets.ViewSet):
    """ViewSet for recruiter dashboard data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        # Get the recruiter's profile
        recruiter = get_object_or_404(RecruiterProfile, user=request.user)
        
        # Get active jobs count
        active_jobs = JobPosting.objects.filter(
            recruiter=recruiter,
            status='published'
        ).count()
        
        # Get total applications count (simplified example)
        total_applications = 0  # This would come from your applications app
        
        # Calculate profile completeness (simplified example)
        profile_fields = [
            recruiter.job_title,
            recruiter.phone,
            recruiter.company
        ]
        completed_fields = sum(1 for field in profile_fields if field)
        profile_completeness = int((completed_fields / len(profile_fields)) * 100)
        
        # Get membership status
        membership = get_object_or_404(RecruiterMembership, recruiter=recruiter)
        
        # Get recent activities
        recent_activities = RecruiterActivity.objects.filter(
            recruiter=recruiter
        ).order_by('-created_at')[:5]
        
        # Get recent applications (simplified example)
        recent_applications = []  # This would come from your applications app
        
        # Prepare dashboard data
        dashboard_data = {
            'active_jobs': active_jobs,
            'total_applications': total_applications,
            'profile_completeness': profile_completeness,
            'membership_status': {
                'tier': membership.get_tier_display(),
                'job_postings_remaining': membership.job_postings_remaining,
                'candidate_views_remaining': membership.candidate_views_remaining,
                'expires_at': membership.expires_at
            },
            'recent_activities': recent_activities,
            'recent_applications': recent_applications
        }
        
        serializer = RecruiterDashboardSerializer(dashboard_data)
        return Response(serializer.data)
