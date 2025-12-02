from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ivr'

router = DefaultRouter()
router.register(r'menus', views.IvrMenuViewSet, basename='ivr-menu')
router.register(r'calls', views.IvrCallViewSet, basename='ivr-call')
router.register(r'call-logs', views.IvrCallLogViewSet, basename='ivr-call-log')

# Nested router for menu options
menu_router = DefaultRouter()
menu_router.register(
    r'options',
    views.IvrMenuOptionViewSet,
    basename='ivr-menu-option',
    parents_query_lookups=['menu']
)

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    path('menus/<int:menu_pk>/', include(menu_router.urls)),
    
    # Call handling
    path('calls/<uuid:pk>/handle-response/', 
         views.IvrCallViewSet.as_view({'post': 'handle_response'}), 
         name='ivr-call-handle-response'),
    
    # Webhooks
    path('webhooks/twilio/', 
         views.IvrTwilioWebhookView.as_view(), 
         name='ivr-twilio-webhook'),
    
    # Handle IVR input (for Twilio Gather)
    path('handle-input/<int:menu_id>/', 
         views.IvrTwilioWebhookView.as_view(), 
         name='ivr-handle-input'),
]
