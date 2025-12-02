Using the URLconf defined in jobscall.urls, Django tried these URL patterns, in this order:



admin/
[name='home']
jobs/ [name='jobs_list']
jobs/<int:pk>/ [name='job_detail']
jobs/<int:pk>/apply/ [name='apply_to_job']
companies/ [name='companies_list']
blog/ [name='blog_list']
blog/<slug:slug>/ [name='blog_detail']
services/resume-checker/ [name='resume_checker']
services/profile-booster/ [name='profile_booster']
login/ [name='login']
register/ [name='register']
logout/ [name='logout']
recruiter/dashboard/ [name='recruiter_dashboard']
recruiter/post-job/ [name='post_job']
me/applications/ [name='my_applications']
alerts/ [name='alerts']
learning/ [name='learning']
payments/ [name='payments']
payments/history/ [name='payments_history']
search/ [name='search']
notifications/ [name='notifications']
recommendations/ [name='recommendations']
analytics/ [name='analytics']
adminpanel/ [name='adminpanel']
cms/<slug:slug>/ [name='cms_page']
profile/ [name='profile']
profile/edit/ [name='profile_edit']
robots.txt [name='robots_txt']
sitemap.xml [name='sitemap_xml']
api/v1/auth/jwt/token/ [name='token_obtain_pair']
api/v1/auth/jwt/refresh/ [name='token_refresh']
api/v1/auth/jwt/verify/ [name='token_verify']
api/v1/auth/
api/v1/users/
api/v1/companies/
api/v1/jobs/
api/v1/applications/
api/v1/search/
api/v1/match/
api/v1/notifications/
api/v1/alerts/
api/v1/payments/
api/v1/learning/
api/v1/analytics/
api/v1/cms/
api/v1/adminpanel/
api/v1/candidate-search/
api/v1/emails/
api/v1/immediate-available/
api/v1/blog/
api/v1/folders/
api/docs/ [name='schema-swagger-ui']
api/redoc/ [name='schema-redoc']
^static/(?P<path>.*)$