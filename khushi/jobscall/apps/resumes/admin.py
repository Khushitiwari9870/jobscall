from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from .models import Resume, WorkExperience, Education, Skill

class WorkExperienceInline(admin.TabularInline):
    model = WorkExperience
    extra = 1
    fields = ('job_title', 'company_name', 'location', 'start_date', 'end_date', 'currently_working')

class EducationInline(admin.TabularInline):
    model = Education
    extra = 1
    fields = ('degree', 'field_of_study', 'institution', 'start_date', 'end_date', 'currently_studying')

class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    fields = ('name', 'level')

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_email', 'status', 'is_default', 'created_at', 'updated_at')
    list_filter = ('status', 'is_default', 'created_at')
    search_fields = ('title', 'professional_title', 'summary', 'user__email')
    inlines = [WorkExperienceInline, EducationInline, SkillInline]
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'professional_title', 'summary', 'status', 'is_default')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User Email')
    user_email.admin_order_field = 'user__email'

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'resume_title', 'start_date', 'end_date', 'currently_working')
    list_filter = ('currently_working', 'start_date')
    search_fields = ('job_title', 'company_name', 'resume__title')
    
    def resume_title(self, obj):
        return obj.resume.title
    resume_title.short_description = _('Resume')
    resume_title.admin_order_field = 'resume__title'

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'field_of_study', 'institution', 'resume_title', 'start_date', 'end_date')
    list_filter = ('degree', 'currently_studying')
    search_fields = ('field_of_study', 'institution', 'resume__title')
    
    def resume_title(self, obj):
        return obj.resume.title
    resume_title.short_description = _('Resume')
    resume_title.admin_order_field = 'resume__title'

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'level_display', 'resume_title')
    list_filter = ('level',)
    search_fields = ('name', 'resume__title')
    
    def level_display(self, obj):
        return obj.get_level_display()
    level_display.short_description = _('Level')
    
    def resume_title(self, obj):
        return obj.resume.title
    resume_title.short_description = _('Resume')
    resume_title.admin_order_field = 'resume__title'
