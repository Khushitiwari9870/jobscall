from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ping, CandidateEmbeddingViewSet, JobEmbeddingViewSet, MatchScoreViewSet

router = DefaultRouter()
router.register(r"candidate-embeddings", CandidateEmbeddingViewSet, basename="candidate-embedding")
router.register(r"job-embeddings", JobEmbeddingViewSet, basename="job-embedding")
router.register(r"match-scores", MatchScoreViewSet, basename="match-score")

urlpatterns = [
    path("ping/", ping, name="matching-ping"),
    path("", include(router.urls)),
]
