"""
URL configuration for jobscall project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples: 
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework import permissions
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)


schema_view = get_schema_view(
   openapi.Info(
      title="Jobscall API",
      default_version='v1',
      description="API documentation for Jobscall Backend",
      terms_of_service="https://www.jobscall.com/terms/",
      contact=openapi.Contact(email="contact@jobscall.com"),
      license=openapi.License(name="Your License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Authentication
    path('api/auth/', include('apps.authx.urls')),
    
    # Web app (server-rendered pages)
    path('', include('apps.web.urls')),
    
    # API v1 routes
    path('api/v1/', include([
        # Authentication endpoints
        path('auth/', include([
            # JWT Authentication
            path('jwt/create/', TokenObtainPairView.as_view(), name='jwt-create'),
            path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
            path('jwt/verify/', TokenVerifyView.as_view(), name='jwt-verify'),
            path('jwt/logout/', TokenBlacklistView.as_view(), name='jwt-logout'),
            
            # Djoser Authentication (users/me, password/reset, etc.)
            path('', include('djoser.urls')),
            path('', include('djoser.urls.jwt')),  # For JWT token authentication
        ])),
    ])),
    path('api/v1/auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/auth/', include('apps.authx.urls')),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/companies/', include('apps.companies.urls')),
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/search/', include('apps.search.urls')),
    path('api/v1/match/', include('apps.matching.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/alerts/', include('apps.alerts.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/learning/', include('apps.learning.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/cms/', include('apps.cms.urls')),
    path('api/v1/adminpanel/', include('apps.adminpanel.urls')),
    path('api/v1/candidate-search/', include('apps.candidate_search.urls')),
    path('api/v1/emails/', include('apps.emails.urls')),
    path('api/v1/immediate-available/', include('apps.immediate_available.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/v1/folders/', include('apps.folders.urls')),
     path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
