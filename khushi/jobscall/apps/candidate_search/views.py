from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F, Value, Case, When, IntegerField
from django.db.models.functions import Concat, Coalesce
from django.utils import timezone
from django.conf import settings
from django.core.paginator import Paginator

from .models import CandidateSearchQuery, SavedSearch, SearchFilterOption
from .serializers import (
    CandidateSearchQuerySerializer,
    SavedSearchSerializer,
    SearchFilterOptionSerializer,
    AdvancedSearchSerializer,
    CandidateProfileSerializer
)
from apps.profile.models import UserProfile


class SearchFilterOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SearchFilterOption.objects.filter(is_active=True)
    serializer_class = SearchFilterOptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def _get_base_queryset(self):
        """Get the base queryset for candidate search"""
        return UserProfile.objects.filter(
            user__is_active=True,
            user__user_type='candidate'
        )


class CandidateSearchViewSet(viewsets.ViewSet):
    """ViewSet for candidate search functionality"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'search':
            return AdvancedSearchSerializer
        return CandidateSearchQuerySerializer
    
    def _apply_filters(self, queryset, search_params):
        """Apply filters to the queryset based on search parameters"""
        # Start with candidate profiles only
        queryset = queryset.filter(user__user_type='candidate')
        
        # Keyword search (search in name, title, skills, etc.)
        keyword = search_params.get('keyword')
        if keyword:
            queryset = queryset.filter(
                Q(user__first_name__icontains=keyword) |
                Q(user__last_name__icontains=keyword) |
                Q(current_job_title__icontains=keyword) |
                Q(skills__name__icontains=keyword)
            ).distinct()
        
        # Location filter
        locations = search_params.get('location', [])
        if locations:
            location_q = Q()
            for loc in locations:
                location_q |= Q(location__icontains=loc)
            queryset = queryset.filter(location_q)
        
        # Experience filter
        experience_ranges = search_params.get('experience', [])
        if experience_ranges:
            exp_q = Q()
            for exp_range in experience_ranges:
                min_exp = exp_range.get('min', 0)
                max_exp = exp_range.get('max', 100)
                exp_q |= Q(years_of_experience__gte=min_exp, years_of_experience__lte=max_exp)
            queryset = queryset.filter(exp_q)
        
        # Skills filter
        skills = search_params.get('skills', [])
        if skills:
            # Handle skills as comma-separated values in the skills field
            skill_queries = Q()
            for skill in skills:
                skill_queries |= Q(skills__icontains=skill)
            queryset = queryset.filter(skill_queries).distinct()
        
        # Job type filter
        job_types = search_params.get('job_type', [])
        if job_types:
            queryset = queryset.filter(preferred_job_type__in=job_types)
        
        # Company filter
        companies = search_params.get('company', [])
        if companies:
            queryset = queryset.filter(current_company__in=companies)
        
        # Industry filter
        industries = search_params.get('industry', [])
        if industries:
            queryset = queryset.filter(industry__in=industries)
        
        # Department filter
        departments = search_params.get('department', [])
        if departments:
            queryset = queryset.filter(department__in=departments)
        
        # Role filter
        roles = search_params.get('role', [])
        if roles:
            queryset = queryset.filter(current_job_title__in=roles)
        
        # Education filter
        education = search_params.get('education', [])
        if education:
            queryset = queryset.filter(education__degree__in=education)
        
        # Gender filter
        gender = search_params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)
        
        # Notice period filter
        notice_periods = search_params.get('notice_period', [])
        if notice_periods:
            queryset = queryset.filter(notice_period__in=notice_periods)
        
        # Work mode filter
        work_modes = search_params.get('work_mode', [])
        if work_modes:
            queryset = queryset.filter(preferred_work_mode__in=work_modes)
        
        return queryset
    
    def _apply_sorting(self, queryset, sort_by):
        """Apply sorting to the queryset"""
        if sort_by == 'relevance':
            # Default sorting by relevance (e.g., last active, profile completeness)
            queryset = queryset.order_by(
                '-last_updated',
                '-profile_completeness'
            )
        elif sort_by == 'experience_high':
            queryset = queryset.order_by('-years_of_experience')
        elif sort_by == 'experience_low':
            queryset = queryset.order_by('years_of_experience')
        elif sort_by == 'salary_high':
            queryset = queryset.order_by('-current_salary')
        elif sort_by == 'salary_low':
            queryset = queryset.order_by('current_salary')
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Perform an advanced candidate search with filtering, sorting, and pagination.
        """
        serializer = AdvancedSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        search_params = serializer.validated_data
        queryset = UserProfile.objects.filter(
            user__is_active=True,
            user__user_type='candidate'
        ).select_related('user').prefetch_related('skills')
        
        # Apply filters and get results
        queryset = self._apply_filters(queryset, search_params)
        queryset = self._apply_sorting(queryset, search_params.get('sort_by'))
        
        # Paginate results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CandidateProfileSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = CandidateProfileSerializer(queryset, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """
        Get search suggestions based on the query parameter.
        """
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])
        
        # Get suggestions for skills from candidate profiles
        skills = set()
        profiles = UserProfile.objects.filter(
            Q(skills__icontains=query) | Q(headline__icontains=query)
        )
        for profile in profiles:
            if profile.skills:
                profile_skills = [s.strip() for s in profile.skills.split(',')]
                skills.update([s for s in profile_skills if query.lower() in s.lower()])
        skills = list(skills)[:5]  # Return top 5 matching skills
        
        job_titles = UserProfile.objects.filter(
            headline__icontains=query
        ).exclude(headline__isnull=True).exclude(headline__exact='')\
            .values_list('headline', flat=True).distinct()[:5]
        
        locations = UserProfile.objects.filter(
            location__icontains=query
        ).exclude(location__isnull=True).exclude(location__exact='')\
            .values_list('location', flat=True).distinct()[:5]
        
        return Response({
            'skills': list(skills),
            'job_titles': list(job_titles),
            'locations': list(locations)
        })
    
    @action(detail=False, methods=['get'])
    def available_filters(self, request):
        """
        Get available filter options for the search.
        """
        from django.db.models import Count, Min, Max
        
        # Get base queryset
        queryset = self._get_base_queryset()
        
        # Get skills count
        skills_count = {}
        for profile in queryset.only('skills'):
            if profile.skills and isinstance(profile.skills, list):
                for skill in profile.skills:
                    if skill and isinstance(skill, str):
                        skills_count[skill] = skills_count.get(skill, 0) + 1
        
        # Convert to list of dicts and sort by count descending
        skills = sorted(
            [{'name': skill, 'count': count} for skill, count in skills_count.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:20]
        
        # Get other filter options
        locations = list(queryset.exclude(city__isnull=True)
                              .exclude(city__exact='')
                              .values_list('city', flat=True)
                              .distinct())
        
        # Get experience range
        exp_range = queryset.aggregate(
            min_exp=Min('experience_years'),
            max_exp=Max('experience_years')
        )
        
        # Get experience range
        exp_stats = candidates.aggregate(
            min_exp=Min('years_of_experience') or 0,
            max_exp=Max('years_of_experience') or 30
        )
        
        # Get salary range
        salary_stats = candidates.aggregate(
            min_salary=Min('current_salary') or 0,
            max_salary=Max('current_salary') or 100
        )
        
        # Get unique job types
        job_types = candidates.exclude(preferred_job_type__isnull=True)\
            .exclude(preferred_job_type__exact='')\
            .values('preferred_job_type')\
            .annotate(count=Count('preferred_job_type'))
        
        # Get unique locations
        locations = candidates.exclude(location__isnull=True)\
            .exclude(location__exact='')\
            .values('location')\
            .annotate(count=Count('location'))\
            .order_by('-count')[:20]
        
        return Response({
            'skills': list(skills),
            'experience_range': {
                'min': exp_stats['min_exp'],
                'max': exp_stats['max_exp']
            },
            'salary_range': {
                'min': salary_stats['min_salary'],
                'max': salary_stats['max_salary']
            },
            'job_types': list(job_types),
            'locations': list(locations)
        })


class SavedSearchViewSet(viewsets.ModelViewSet):
    """ViewSet for managing saved searches"""
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedSearch.objects.filter(recruiter=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """Run a saved search"""
        saved_search = self.get_object()
        saved_search.last_run = timezone.now()
        saved_search.save()
        
        # Forward to the search endpoint with the saved parameters
        request.data.clear()
        request.data.update(saved_search.search_parameters)
        return CandidateSearchViewSet.as_view({'post': 'search'})(request._request)
