from django.core.management.base import BaseCommand
from django.urls import get_resolver
from django.urls.resolvers import URLPattern, URLResolver
import json

class Command(BaseCommand):
    help = 'List all API endpoints in the project'

    def handle(self, *args, **options):
        api_endpoints = {}
        resolver = get_resolver()
        
        def extract_urls(urls, prefix='', endpoints=None):
            if endpoints is None:
                endpoints = {}
            
            for url in urls.url_patterns:
                if isinstance(url, URLPattern):
                    if hasattr(url, 'pattern') and hasattr(url, 'name'):
                        path = f"{prefix}{str(url.pattern)}"
                        endpoints[path] = {
                            'name': url.name or 'unnamed',
                            'callback': str(url.callback),
                        }
                elif isinstance(url, URLResolver):
                    extract_urls(url, prefix=f"{prefix}{str(url.pattern)}", endpoints=endpoints)
            
            return endpoints
        
        # Extract all URLs
        all_endpoints = extract_urls(resolver)
        
        # Filter only API endpoints
        api_endpoints = {
            path: info for path, info in all_endpoints.items()
            if path.startswith(('api/', '/api/')) or 'api/' in info['callback'].lower()
        }
        
        # Sort endpoints by path
        sorted_endpoints = dict(sorted(api_endpoints.items()))
        
        # Format the output
        output = []
        for path, info in sorted_endpoints.items():
            name = info['name']
            output.append(f"{path} [name='{name}']")
        
        # Print the results
        self.stdout.write("\n".join(output))
        
        # Optionally save to a file
        with open('api_endpoints.txt', 'w') as f:
            f.write("\n".join(output))
        
        self.stdout.write(self.style.SUCCESS(f'Found {len(output)} API endpoints. Saved to api_endpoints.txt'))
