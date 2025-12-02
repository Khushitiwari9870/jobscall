import os
import sys
import django
from django.conf import settings
from django.urls import get_resolver
from django.urls.resolvers import URLPattern, URLResolver

def setup_django():
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobscall.settings')
    django.setup()

def extract_urls(urls, prefix='', endpoints=None):
    if endpoints is None:
        endpoints = []
    
    for url in urls.url_patterns:
        if isinstance(url, URLPattern):
            if hasattr(url, 'pattern') and hasattr(url, 'name'):
                path = f"{prefix}{str(url.pattern)}"
                # Clean up the path
                path = path.replace('^', '').replace('$', '')
                if 'api/' in path.lower() or any(x in path for x in ['v1', 'v2', 'api/']):
                    endpoints.append({
                        'path': path,
                        'name': url.name or 'unnamed',
                        'callback': f"{url.callback.__module__}.{url.callback.__name__}"
                    })
        elif isinstance(url, URLResolver):
            extract_urls(url, prefix=f"{prefix}{str(url.pattern)}", endpoints=endpoints)
    
    return endpoints

def main():
    # Set up Django
    setup_django()
    
    # Get all URLs
    resolver = get_resolver()
    endpoints = extract_urls(resolver)
    
    # Sort endpoints by path
    endpoints.sort(key=lambda x: x['path'])
    
    # Print the results
    print(f"\n{'='*80}")
    print(f"Found {len(endpoints)} API endpoints")
    print(f"{'='*80}\n")
    
    for endpoint in endpoints:
        print(f"{endpoint['path']} [name='{endpoint['name']}']")
    
    # Save to file
    with open('api_endpoints.txt', 'w', encoding='utf-8') as f:
        for endpoint in endpoints:
            f.write(f"{endpoint['path']} [name='{endpoint['name']}']\n")
    
    print(f"\nEndpoints saved to api_endpoints.txt")

if __name__ == "__main__":
    main()
