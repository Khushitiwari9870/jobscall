from rest_framework import viewsets, status, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from django.db.models import Q
from django.utils import timezone
from django.http import HttpResponse
import json

from .models import SharedIvrResource, SharedIvrTemplate, SharedIvrUsageLog
from .serializers import (
    SharedIvrResourceSerializer, SharedIvrTemplateSerializer,
    SharedIvrUsageLogSerializer, SharedIvrTemplateExportSerializer,
    SharedIvrImportSerializer
)

class SharedIvrResourceViewSet(viewsets.ModelViewSet):
    """ViewSet for managing shared IVR resources"""
    serializer_class = SharedIvrResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]
    
    def get_queryset(self):
        queryset = SharedIvrResource.objects.all()
        
        # Filter by resource type if provided
        resource_type = self.request.query_params.get('resource_type')
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        
        # Filter by language if provided
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(language=language)
        
        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(content__icontains=search)
            )
        
        return queryset.order_by('name')
    
    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        self._log_usage('resource', instance.id, 'created')
    
    def perform_update(self, serializer):
        instance = serializer.save()
        self._log_usage('resource', instance.id, 'updated')
    
    def perform_destroy(self, instance):
        resource_id = instance.id
        instance.delete()
        self._log_usage('resource', resource_id, 'deleted')
    
    def _log_usage(self, resource_type, resource_id, action, **kwargs):
        """Helper method to log resource usage"""
        SharedIvrUsageLog.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            user=self.request.user,
            ip_address=self._get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata=kwargs
        )
    
    def _get_client_ip(self):
        """Get the client's IP address from the request"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


class SharedIvrTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing shared IVR templates"""
    serializer_class = SharedIvrTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = SharedIvrTemplate.objects.all()
        
        # Filter by template type if provided
        template_type = self.request.query_params.get('template_type')
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        
        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by public/private status
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(is_public=True) | Q(created_by=self.request.user)
            )
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(content__icontains=search)
            )
        
        return queryset.order_by('name')
    
    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        self._log_usage('template', instance.id, 'created')
    
    def perform_update(self, serializer):
        instance = serializer.save()
        self._log_usage('template', instance.id, 'updated')
    
    def perform_destroy(self, instance):
        template_id = instance.id
        instance.delete()
        self._log_usage('template', template_id, 'deleted')
    
    @action(detail=True, methods=['post'])
    def export(self, request, pk=None):
        """Export template with its resources"""
        template = self.get_object()
        serializer = SharedIvrTemplateExportSerializer(data=request.data)
        
        if serializer.is_valid():
            include_resources = serializer.validated_data.get('include_resources', True)
            export_format = serializer.validated_data.get('format', 'json')
            
            # Prepare export data
            data = SharedIvrTemplateSerializer(template).data
            
            if include_resources:
                resources = template.resources.all()
                data['resources'] = SharedIvrResourceSerializer(resources, many=True).data
            
            # Log the export
            self._log_usage('template', template.id, 'exported', format=export_format)
            
            # Return the appropriate response based on format
            if export_format == 'json':
                return Response(data)
            else:
                # For XML, we'd need to convert the data to XML format
                # This is a simplified example
                xml_content = self._dict_to_xml({'template': data})
                response = HttpResponse(xml_content, content_type='application/xml')
                response['Content-Disposition'] = f'attachment; filename="template_{template.id}.xml"'
                return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def import_template(self, request):
        """Import template from file"""
        serializer = SharedIvrImportSerializer(data=request.data)
        
        if serializer.is_valid():
            # Process the import based on the file type and import settings
            # This is a simplified example
            try:
                file = serializer.validated_data['file']
                import_type = serializer.validated_data.get('import_type', 'auto')
                conflict_resolution = serializer.validated_data.get('conflict_resolution', 'skip')
                
                # Process the file based on its type
                if file.name.endswith('.json'):
                    import_data = json.load(file)
                else:
                    # Handle other formats (e.g., XML)
                    return Response(
                        {'error': 'Unsupported file format'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Import the template and resources
                # This is a simplified example - in a real app, you'd have more robust import logic
                if 'id' in import_data:
                    del import_data['id']
                
                import_data['created_by'] = request.user.id
                
                # Handle resources if included
                resources_data = import_data.pop('resources', [])
                
                # Create the template
                template_serializer = self.get_serializer(data=import_data)
                if template_serializer.is_valid():
                    template = template_serializer.save()
                    
                    # Import and associate resources
                    resource_ids = []
                    for resource_data in resources_data:
                        if 'id' in resource_data:
                            del resource_data['id']
                        resource_data['created_by'] = request.user
                        resource_serializer = SharedIvrResourceSerializer(data=resource_data)
                        if resource_serializer.is_valid():
                            resource = resource_serializer.save()
                            resource_ids.append(resource.id)
                    
                    if resource_ids:
                        template.resources.set(resource_ids)
                    
                    self._log_usage('template', template.id, 'imported')
                    return Response(
                        self.get_serializer(template).data,
                        status=status.HTTP_201_CREATED
                    )
                else:
                    return Response(
                        template_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _dict_to_xml(self, data, root=True):
        """Helper method to convert dict to XML (simplified example)"""
        if root:
            xml = ['<?xml version="1.0" encoding="UTF-8"?>']
            xml.append('<root>')
        else:
            xml = []
        
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, (dict, list)):
                    xml.append(f'<{key}>')
                    xml.append(self._dict_to_xml(value, False))
                    xml.append(f'</{key}>')
                else:
                    xml.append(f'<{key}>{value}</{key}>')
        elif isinstance(data, list):
            for item in data:
                xml.append('<item>')
                xml.append(self._dict_to_xml(item, False))
                xml.append('</item>')
        else:
            xml.append(str(data))
        
        if root:
            xml.append('</root>')
        
        return '\n'.join(xml)
    
    def _log_usage(self, resource_type, resource_id, action, **kwargs):
        """Helper method to log template usage"""
        SharedIvrUsageLog.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            user=self.request.user,
            ip_address=self._get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata=kwargs
        )
    
    def _get_client_ip(self):
        """Get the client's IP address from the request"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


class SharedIvrUsageLogViewSet(mixins.ListModelMixin,
                             mixins.RetrieveModelMixin,
                             viewsets.GenericViewSet):
    """ViewSet for viewing IVR usage logs"""
    serializer_class = SharedIvrUsageLogSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can view logs
    
    def get_queryset(self):
        queryset = SharedIvrUsageLog.objects.all()
        
        # Filter by resource type if provided
        resource_type = self.request.query_params.get('resource_type')
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        
        # Filter by action if provided
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)
        
        # Filter by user if provided
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Date range filtering
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            # Add one day to include the entire end date
            end_date = timezone.datetime.strptime(end_date, '%Y-%m-%d')
            end_date = end_date.replace(hour=23, minute=59, second=59)
            queryset = queryset.filter(timestamp__lte=end_date)
        
        return queryset.order_by('-timestamp')
