import multiprocessing

# Server socket
bind = 'unix:/run/jobscall/gunicorn.sock'

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
max_requests = 2000
max_requests_jitter = 50
timeout = 30
keepalive = 2

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Debugging
reload = False

# Server mechanics
user = 'www-data'
group = 'www-data'
pidfile = '/run/jobscall/gunicorn.pid'

# Logging
accesslog = '/var/log/jobscall/access.log'
errorlog = '/var/log/jobscall/error.log'
loglevel = 'info'

# Process naming
proc_name = 'jobscall_gunicorn'
