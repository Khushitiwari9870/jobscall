from django.db import models
from apps.profile.models import UserProfile as CandidateProfile
from apps.jobs.models import Job

class CandidateEmbedding(models.Model):
    candidate = models.OneToOneField(CandidateProfile, on_delete=models.CASCADE, related_name='embedding')
    vector = models.JSONField(help_text='Store embedding vector as list of floats')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"CandidateEmbedding({self.candidate.user.username})"


class JobEmbedding(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='embedding')
    vector = models.JSONField(help_text='Store embedding vector as list of floats')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"JobEmbedding({self.job.title})"


class MatchScore(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='match_scores')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='match_scores')
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("candidate", "job")

    def __str__(self):
        return f"MatchScore({self.candidate.user.username}, {self.job.title})={self.score}"
