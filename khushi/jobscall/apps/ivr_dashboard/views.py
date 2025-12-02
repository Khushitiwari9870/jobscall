from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
from django.http import JsonResponse, HttpResponse
import json
import yaml

from .models import (
    IvrDashboardPanel, IvrDashboardFilter, IvrDashboardLayout,
    IvrDashboardUserSettings, IvrDashboardSharedView
)
from .serializers import (
    IvrDashboardPanelSerializer, IvrDashboardFilterSerializer,
    IvrDashboardLayoutSerializer, IvrDashboardUserSettingsSerializer,
    IvrDashboardSharedViewSerializer, IvrDashboardDataRequestSerializer,
    IvrDashboardExportSerializer, IvrDashboardImportSerializer
)
from apps.ivr.models import IvrCall, IvrMenu, IvrCallLog
from apps.ivr_shared.models import SharedIvrResource, SharedIvrTemplate


class IvrDashboardPanelViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR dashboard panels"""
    serializer_class = IvrDashboardPanelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return IvrDashboardPanel.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available panel types"""
        return Response([
            {'value': value, 'label': label}
            for value, label in IvrDashboardPanel.PANEL_TYPES
        ])
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a panel"""
        panel = self.get_object()
        panel.pk = None
        panel.title = f"{panel.title} (Copy)"
        panel.save()
        return Response(
            self.get_serializer(panel).data,
            status=status.HTTP_201_CREATED
        )


class IvrDashboardFilterViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR dashboard filters"""
    serializer_class = IvrDashboardFilterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return IvrDashboardFilter.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available filter types"""
        return Response([
            {'value': value, 'label': label}
            for value, label in IvrDashboardFilter.FILTER_TYPES
        ])
    
    @action(detail=False, methods=['get'])
    def values(self, request):
        """Get available filter values for a specific filter type"""
        filter_type = request.query_params.get('filter_type')
        
        if filter_type == 'call_status':
            values = [choice[0] for choice in IvrCall.STATUS_CHOICES]
        elif filter_type == 'call_direction':
            values = ['inbound', 'outbound']
        elif filter_type == 'ivr_menu':
            values = list(IvrMenu.objects.values_list('name', flat=True))
        else:
            values = []
        
        return Response({
            'filter_type': filter_type,
            'values': values
        })


class IvrDashboardLayoutViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IVR dashboard layouts"""
    serializer_class = IvrDashboardLayoutSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return IvrDashboardLayout.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available layout types"""
        return Response([
            {'value': value, 'label': label}
            for value, label in IvrDashboardLayout.LAYOUT_TYPES
        ])
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set a layout as the default for the user"""
        layout = self.get_object()
        IvrDashboardLayout.objects.filter(
            user=request.user,
            is_default=True
        ).exclude(pk=layout.pk).update(is_default=False)
        layout.is_default = True
        layout.save()
        return Response({'status': 'default layout set'})


class IvrDashboardUserSettingsViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """ViewSet for managing user-specific IVR dashboard settings"""
    serializer_class = IvrDashboardUserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return IvrDashboardUserSettings.objects.filter(user=self.request.user)
    
    def get_object(self):
        # Get or create settings for the current user
        obj, created = IvrDashboardUserSettings.objects.get_or_create(
            user=self.request.user
        )
        return obj
    
    def list(self, request, *args, **kwargs):
        # For list endpoint, just return the user's settings
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class IvrDashboardSharedViewViewSet(viewsets.ModelViewSet):
    """ViewSet for managing shared IVR dashboard views"""
    serializer_class = IvrDashboardSharedViewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can see views they created or that were shared with them
        return IvrDashboardSharedView.objects.filter(
            Q(created_by=self.request.user) |
            Q(shared_with=self.request.user) |
            Q(is_public=True)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Share a view with other users"""
        view = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        # Add users to shared_with
        users = User.objects.filter(id__in=user_ids)
        view.shared_with.add(*users)
        
        return Response({
            'status': f'View shared with {users.count()} users',
            'shared_with': [user.email for user in users]
        })
    
    @action(detail=True, methods=['post'])
    def clone(self, request, pk=None):
        """Clone a shared view"""
        view = self.get_object()
        view.pk = None
        view.created_by = request.user
        view.is_public = False
        view.save()
        return Response(
            self.get_serializer(view).data,
            status=status.HTTP_201_CREATED
        )


class IvrDashboardDataView(views.APIView):
    """View for retrieving IVR dashboard data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = IvrDashboardDataRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        filters = data.get('filters', {})
        
        # Build base querysets
        calls = IvrCall.objects.all()
        menus = IvrMenu.objects.all()
        
        # Apply date filters
        if data.get('start_date'):
            calls = calls.filter(created_at__gte=data['start_date'])
        if data.get('end_date'):
            calls = calls.filter(created_at__lte=data['end_date'])
        
        # Apply additional filters
        if 'call_status' in filters:
            calls = calls.filter(status__in=filters['call_status'].split(','))
        if 'call_direction' in filters:
            calls = calls.filter(direction__in=filters['call_direction'].split(','))
        
        # Get counts and metrics
        call_count = calls.count()
        menu_count = menus.count()
        
        # Get call status distribution
        status_distribution = calls.values('status').annotate(
            count=models.Count('id')
        ).order_by('-count')
        
        # Get call volume by time period
        # This is a simplified example - in a real app, you'd use a proper time series
        call_volume = calls.extra({
            'date': "date(created_at)"
        }).values('date').annotate(
            count=models.Count('id')
        ).order_by('date')
        
        # Get top callers
        top_callers = calls.values('from_number').annotate(
            count=models.Count('id'),
            total_duration=models.Sum('duration')
        ).order_by('-count')[:10]
        
        # Get recent calls
        recent_calls = calls.select_related('user').order_by('-created_at')[:10]
        
        return Response({
            'metrics': {
                'total_calls': call_count,
                'total_menus': menu_count,
                'avg_call_duration': calls.aggregate(avg=models.Avg('duration'))['avg'] or 0,
                'unique_callers': calls.values('from_number').distinct().count(),
            },
            'status_distribution': list(status_distribution),
            'call_volume': list(call_volume),
            'top_callers': list(top_callers),
            'recent_calls': [
                {
                    'id': call.id,
                    'from_number': call.from_number,
                    'to_number': call.to_number,
                    'status': call.status,
                    'duration': call.duration,
                    'created_at': call.created_at,
                    'user': call.user.get_full_name() if call.user else None
                }
                for call in recent_calls
            ]
        })


class IvrDashboardExportView(views.APIView):
    """View for exporting dashboard configuration"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = IvrDashboardExportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = {'version': '1.0', 'exported_at': timezone.now().isoformat()}
        
        if serializer.validated_data['include_panels']:
            data['panels'] = IvrDashboardPanelSerializer(
                IvrDashboardPanel.objects.filter(user=request.user),
                many=True
            ).data
        
        if serializer.validated_data['include_filters']:
            data['filters'] = IvrDashboardFilterSerializer(
                IvrDashboardFilter.objects.filter(user=request.user),
                many=True
            ).data
        
        if serializer.validated_data['include_layouts']:
            data['layouts'] = IvrDashboardLayoutSerializer(
                IvrDashboardLayout.objects.filter(user=request.user),
                many=True
            ).data
        
        if serializer.validated_data['include_settings']:
            settings_obj, _ = IvrDashboardUserSettings.objects.get_or_create(
                user=request.user
            )
            data['settings'] = IvrDashboardUserSettingsSerializer(settings_obj).data
        
        # Format the response based on the requested format
        if serializer.validated_data['format'] == 'yaml':
            response_content = yaml.dump(data, default_flow_style=False)
            content_type = 'application/x-yaml'
            file_ext = 'yaml'
        else:  # Default to JSON
            response_content = json.dumps(data, indent=2)
            content_type = 'application/json'
            file_ext = 'json'
        
        # Create a downloadable response
        response = HttpResponse(response_content, content_type=content_type)
        response['Content-Disposition'] = (
            f'attachment; filename="ivr_dashboard_export_{timezone.now().date()}.{file_ext}"'
        )
        return response


class IvrDashboardImportView(views.APIView):
    """View for importing dashboard configuration"""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]
    
    def post(self, request, format=None):
        serializer = IvrDashboardImportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        file = serializer.validated_data['file']
        conflict_resolution = serializer.validated_data['conflict_resolution']
        
        try:
            # Parse the file content
            if file.name.endswith('.yaml') or file.name.endswith('.yml'):
                file_content = yaml.safe_load(file)
            else:  # Default to JSON
                file_content = json.load(file)
            
            results = {'imported': 0, 'skipped': 0, 'errors': []}
            
            # Import panels
            if 'panels' in file_content:
                for panel_data in file_content['panels']:
                    try:
                        panel_data.pop('id', None)
                        panel_data['user'] = request.user.id
                        
                        if conflict_resolution == 'overwrite' and 'title' in panel_data:
                            # Update existing or create new
                            IvrDashboardPanel.objects.update_or_create(
                                user=request.user,
                                title=panel_data['title'],
                                defaults=panel_data
                            )
                            results['imported'] += 1
                        else:
                            # Always create new
                            IvrDashboardPanel.objects.create(**panel_data)
                            results['imported'] += 1
                    except Exception as e:
                        results['skipped'] += 1
                        results['errors'].append(f"Panel {panel_data.get('title', '')}: {str(e)}")
            
            # Similar logic for filters, layouts, and settings...
            # (Implementation omitted for brevity)
            
            return Response({
                'status': 'import completed',
                **results
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error processing import file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
