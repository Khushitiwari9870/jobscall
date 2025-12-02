from django.contrib import admin
from .models import CandidateEmbedding, JobEmbedding, MatchScore


@admin.register(CandidateEmbedding)
class CandidateEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate", "updated_at")
    search_fields = ("candidate__user__username",)


@admin.register(JobEmbedding)
class JobEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("id", "job", "updated_at")
    search_fields = ("job__title", "job__company__name")


@admin.register(MatchScore)
class MatchScoreAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate", "job", "score", "created_at")
    search_fields = ("candidate__user__username", "job__title")
