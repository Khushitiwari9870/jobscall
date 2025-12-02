from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404

from .models import Resume, WorkExperience, Education, Skill
from .serializers import ResumeSerializer, WorkExperienceSerializer, EducationSerializer, SkillSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).prefetch_related(
            'work_experiences', 'educations', 'skills'
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        resume = self.get_object()
        resume.is_default = True
        resume.save()
        return Response({'status': 'resume set as default'})
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        resume = self.get_object()
        resume.status = 'published'
        resume.save()
        return Response({'status': 'resume published'})
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        resume = self.get_object()
        resume.status = 'archived'
        resume.save()
        return Response({'status': 'resume archived'})

class WorkExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return WorkExperience.objects.filter(resume_id=resume_id, resume__user=self.request.user)
    
    def perform_create(self, serializer):
        resume = get_object_or_404(Resume, id=self.kwargs.get('resume_id'), user=self.request.user)
        serializer.save(resume=resume)

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return Education.objects.filter(resume_id=resume_id, resume__user=self.request.user)
    
    def perform_create(self, serializer):
        resume = get_object_or_404(Resume, id=self.kwargs.get('resume_id'), user=self.request.user)
        serializer.save(resume=resume)

class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return Skill.objects.filter(resume_id=resume_id, resume__user=self.request.user)
    
    def perform_create(self, serializer):
        resume = get_object_or_404(Resume, id=self.kwargs.get('resume_id'), user=self.request.user)
        serializer.save(resume=resume)

def ping(request):
    return Response({"status": "ok", "app": "resumes"})
