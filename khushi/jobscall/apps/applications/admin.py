from django.contrib import admin
from django.utils.html import format_html
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate_name", "job_title", "status", "applied_at")
    search_fields = (
        "candidate__user__first_name",
        "candidate__user__last_name",
        "candidate__user__email",
        "job__title",
    )
    list_filter = ("status", "applied_at")
    list_select_related = ('candidate__user', 'job')
    
    def candidate_name(self, obj):
        user = obj.candidate.user
        return f"{user.get_full_name() or user.email}"
    candidate_name.short_description = "Candidate"
    candidate_name.admin_order_field = 'candidate__user__first_name'
    
    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = "Job"
    job_title.admin_order_field = 'job__title'
