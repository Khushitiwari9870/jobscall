from django.utils.deprecation import MiddlewareMixin
import re

class CsrfExemptMiddleware(MiddlewareMixin):
    """Middleware to exempt API endpoints from CSRF protection."""

    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Exempt API endpoints from CSRF protection
        if re.match(r'^/api/', request.path):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None
