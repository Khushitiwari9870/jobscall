from rest_framework import serializers
from .models import Resume, WorkExperience, Education, Skill
from django.utils.translation import gettext_lazy as _

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = [
            'id', 'job_title', 'company_name', 'location',
            'currently_working', 'start_date', 'end_date', 'description'
        ]
        read_only_fields = ['id']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'degree', 'field_of_study', 'institution',
            'currently_studying', 'start_date', 'end_date', 'description'
        ]
        read_only_fields = ['id']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        read_only_fields = ['id']

class ResumeSerializer(serializers.ModelSerializer):
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    educations = EducationSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'professional_title', 'summary', 'status',
            'is_default', 'created_at', 'updated_at',
            'work_experiences', 'educations', 'skills'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
    
    def create(self, validated_data):
        work_experiences_data = validated_data.pop('work_experiences', [])
        educations_data = validated_data.pop('educations', [])
        skills_data = validated_data.pop('skills', [])
        
        # Set the current user as the resume owner
        validated_data['user'] = self.context['request'].user
        
        # Create the resume
        resume = Resume.objects.create(**validated_data)
        
        # Create related objects
        for work_exp_data in work_experiences_data:
            WorkExperience.objects.create(resume=resume, **work_exp_data)
            
        for education_data in educations_data:
            Education.objects.create(resume=resume, **education_data)
            
        for skill_data in skills_data:
            Skill.objects.create(resume=resume, **skill_data)
            
        return resume
    
    def update(self, instance, validated_data):
        work_experiences_data = validated_data.pop('work_experiences', None)
        educations_data = validated_data.pop('educations', None)
        skills_data = validated_data.pop('skills', None)
        
        # Update resume fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create work experiences
        if work_experiences_data is not None:
            instance.work_experiences.all().delete()
            for work_exp_data in work_experiences_data:
                WorkExperience.objects.create(resume=instance, **work_exp_data)
        
        # Update or create educations
        if educations_data is not None:
            instance.educations.all().delete()
            for education_data in educations_data:
                Education.objects.create(resume=instance, **education_data)
        
        # Update or create skills
        if skills_data is not None:
            instance.skills.all().delete()
            for skill_data in skills_data:
                Skill.objects.create(resume=instance, **skill_data)
        
        return instance
