from django.urls import path
from . import views

app_name = "web"

urlpatterns = [
    path("", views.home, name="home"),
    path("jobs/", views.jobs_list, name="jobs_list"),
    path("jobs/<int:pk>/", views.job_detail, name="job_detail"),
    path("jobs/<int:pk>/apply/", views.apply_to_job, name="apply_to_job"),
    path("companies/", views.companies_list, name="companies_list"),
    # Blog
    path("blog/", views.blog_list, name="blog_list"),
    path("blog/<slug:slug>/", views.blog_detail, name="blog_detail"),
    # Employer Services
    path("services/resume-checker/", views.resume_checker, name="resume_checker"),
    path("services/profile-booster/", views.profile_booster, name="profile_booster"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    # Recruiter/Staff
    path("recruiter/dashboard/", views.recruiter_dashboard, name="recruiter_dashboard"),
    path("recruiter/post-job/", views.post_job, name="post_job"),
    # Candidate
    path("me/applications/", views.my_applications, name="my_applications"),
    # Other pages
    path("alerts/", views.alerts_page, name="alerts"),
    path("learning/", views.learning_catalog, name="learning"),
    path("payments/", views.payments_purchase, name="payments"),
    path("payments/history/", views.payments_history, name="payments_history"),
    path("search/", views.search_page, name="search"),
    path("notifications/", views.notifications_page, name="notifications"),
    path("recommendations/", views.recommendations_page, name="recommendations"),
    path("analytics/", views.analytics_dashboard, name="analytics"),
    path("adminpanel/", views.adminpanel_dashboard, name="adminpanel"),
    path("cms/<slug:slug>/", views.cms_page, name="cms_page"),
    path("profile/", views.profile_view, name="profile"),
    path("profile/edit/", views.profile_edit, name="profile_edit"),
    # Robots and sitemap
    path("robots.txt", views.robots_txt, name="robots_txt"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap_xml"),
]

