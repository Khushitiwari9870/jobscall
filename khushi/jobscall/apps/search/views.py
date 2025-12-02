import logging
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.conf import settings

from apps.jobs.models import Job
from .models import SearchLog, SavedSearch
from .serializers import (
    SearchLogSerializer,
    JobSearchSerializer,
    SavedSearchSerializer
)

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

def ping(_request):
    return JsonResponse({"status": "ok", "app": "search"})


class SearchLogViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing and managing search history"""
    serializer_class = SearchLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = SearchLog.objects.select_related("user").filter(user=self.request.user)
        
        # Filter by search type if provided
        search_type = self.request.query_params.get('search_type')
        if search_type:
            queryset = queryset.filter(search_type=search_type)
            
        return queryset.order_by("-created_at")


class JobSearchView(APIView):
    """
    API endpoint for job search functionality with advanced filtering and sorting.
    Supports searching by job title, skills, company, location, experience, salary range, etc.
    """
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request, *args, **kwargs):
        # Initialize serializer with query parameters
        serializer = JobSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get validated search parameters
        search_params = serializer.validated_data
        
        # Build the base queryset with related data
        queryset = Job.objects.filter(status='published').select_related(
            'company', 'posted_by'
        ).prefetch_related('skills', 'categories')
        
        # Apply text search if query is provided
        if search_params.get('query'):
            search_terms = search_params['query'].split()
            search_query = Q()
            
            for term in search_terms:
                term_query = (
                    Q(title__icontains=term) |
                    Q(description__icontains=term) |
                    Q(requirements__icontains=term) |
                    Q(skills_required__icontains=term) |
                    Q(company__name__icontains=term) |
                    Q(company__description__icontains=term) |
                    Q(location__icontains=term)
                )
                
                # Add skill matching if the term matches a skill name
                from apps.skills.models import Skill
                matching_skills = Skill.objects.filter(name__icontains=term)
                if matching_skills.exists():
                    term_query |= Q(skills__in=matching_skills)
                
                search_query &= term_query
                
            queryset = queryset.filter(search_query).distinct()
        
        # Apply filters from the serializer
        filters = serializer.get_search_filters()
        
        # Apply each filter to the queryset
        for key, value in filters.items():
            if key.endswith('_query'):
                # Handle Q objects
                queryset = queryset.filter(value)
            elif key == 'search_query':
                # Already handled in the text search
                continue
            else:
                # Handle regular filters
                queryset = queryset.filter(**{key: value})
        
        # Apply relevance scoring if no explicit ordering is provided
        if not search_params.get('sort_by') or search_params['sort_by'] == 'relevance':
            if search_params.get('query'):
                from django.db.models import Case, When, Value, IntegerField
                
                # Add relevance scoring based on search terms
                search_terms = search_params['query'].lower().split()
                when_conditions = []
                
                # Higher weight for title matches
                for term in search_terms:
                    when_conditions.append(When(title__icontains=term, then=Value(5)))
                
                # Medium weight for company name and skills
                for term in search_terms:
                    when_conditions.append(When(company__name__icontains=term, then=Value(3)))
                    when_conditions.append(When(skills_required__icontains=term, then=Value(3)))
                
                # Lower weight for description and requirements
                for term in search_terms:
                    when_conditions.append(When(description__icontains=term, then=Value(1)))
                    when_conditions.append(When(requirements__icontains=term, then=Value(1)))
                
                # Apply the relevance annotation
                queryset = queryset.annotate(
                    relevance=sum(when_conditions, Value(0))
                ).order_by('-relevance', '-created_at')
        
        # Apply explicit ordering if specified
        if search_params.get('sort_by') and search_params['sort_by'] != 'relevance':
            ordering = serializer.get_ordering()
            if ordering:
                queryset = queryset.order_by(*ordering)
        
        # Apply pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        
        # Log the search if user is authenticated
        if request.user.is_authenticated:
            self._log_search(request, search_params, queryset.count())
        
        # Serialize the results with appropriate context
        from apps.jobs.serializers import JobListSerializer
        from apps.companies.serializers import CompanySerializer
        
        context = {
            'request': request,
            'include_company_details': True,
        }
        
        # Prepare response data with additional metadata
        response_data = {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'results': JobListSerializer(page, many=True, context=context).data,
            'filters': {
                'experience_levels': dict(JobSearchSerializer.EXPERIENCE_LEVELS),
                'salary_ranges': dict(JobSearchSerializer.SALARY_RANGES),
                'job_types': dict(JobSearchSerializer.JOB_TYPES),
            },
            'applied_filters': search_params
        }
        
        return Response(response_data)
    
    def _get_client_ip(self, request):
        """Get the client IP address from the request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def _log_search(self, request, search_params, results_count):
        """
        Log the search query and parameters for analytics and personalization.
        
        Args:
            request: The HTTP request object
            search_params: Dictionary of search parameters
            results_count: Number of results found for this search
        """
        try:
            # Extract relevant search parameters
            query = search_params.get('query', '')
            location = search_params.get('location', '')
            experience = search_params.get('experience', [])
            salary = search_params.get('salary', [])
            job_type = search_params.get('job_type', [])
            
            # Create the search log entry
            log_entry = SearchLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                search_type='job',
                query=query,
                location=location,
                experience=','.join(experience) if experience else None,
                salary=','.join(salary) if salary else None,
                job_type=','.join(job_type) if job_type else None,
                company=search_params.get('company', ''),
                skills=','.join(search_params.get('skills', [])) if 'skills' in search_params else None,
                posted_within=search_params.get('posted_within'),
                work_from_home=search_params.get('work_from_home', False),
                walk_in=search_params.get('walk_in', False),
                results_count=results_count,
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                **{k: v for k, v in search_params.items() 
                   if k in ['query', 'location', 'experience', 'salary', 
                           'job_type', 'skills', 'company', 'posted_within',
                           'walk_in', 'work_from_home', 'referrer']}
            )
            return log_entry
        except Exception as e:
            logger.error(f"Error logging search: {str(e)}")
    
    def _get_client_ip(self, request):
        """Get the client's IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SavedSearchViewSet(mixins.CreateModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.ListModelMixin,
                       viewsets.GenericViewSet):
    """API endpoint for managing saved searches"""
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return SavedSearch.objects.filter(
            user=self.request.user,
            is_active=True
        ).order_by('-updated_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute a saved search and return results"""
        saved_search = self.get_object()
        
        # Create a request with the saved search parameters
        from rest_framework.test import APIRequestFactory
        from rest_framework.request import Request
        
        factory = APIRequestFactory()
        req = factory.get('/api/search/jobs/', saved_search.search_params)
        req.user = request.user
        req.query_params = req.GET = saved_search.search_params
        
        # Execute the search
        view = JobSearchView.as_view()
        response = view(Request(req))
        
        # Update the last used timestamp
        saved_search.save()
        
        return response
