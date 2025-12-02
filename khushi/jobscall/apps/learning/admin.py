from django.contrib import admin
from .models import Provider, Course, Enrollment, Certificate


@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "website", "created_at")
    search_fields = ("name", "website")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "provider", "duration_hours", "price", "currency", "created_at")
    search_fields = ("title", "provider__name")
    list_filter = ("currency",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "course", "enrolled_at", "completed_at")
    search_fields = ("user__username", "course__title")


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("id", "certificate_id", "enrollment", "issued_at")
    search_fields = ("certificate_id",)
