from django import forms
from apps.jobs.models import Job
from apps.profile.models import UserProfile
from apps.cms.models import EmployerLead, ResumeCheckRequest


class JobApplicationForm(forms.Form):
    resume_url = forms.URLField(label="Resume URL", required=False)
    cover_letter = forms.CharField(
        label="Cover letter", widget=forms.Textarea(attrs={"rows": 6}), required=False
    )


class JobPostForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = [
            "company",
            "title",
            "description",
            "location",
            "min_salary",
            "max_salary",
            "employment_type",
        ]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 8}),
        }


class ProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = [
            "headline", 
            "current_company", 
            "designation", 
            "experience_years",
            "skills"
        ]
        widgets = {
            "headline": forms.TextInput(attrs={"class": "form-control"}),
            "current_company": forms.TextInput(attrs={"class": "form-control"}),
            "designation": forms.TextInput(attrs={"class": "form-control"}),
            "experience_years": forms.NumberInput(attrs={
                "class": "form-control",
                "min": 0,
                "max": 50
            }),
            "skills": forms.Textarea(attrs={
                "rows": 4,
                "class": "form-control",
                "placeholder": "Enter skills separated by commas"
            }),
        }


class EmployerLeadForm(forms.ModelForm):
    class Meta:
        model = EmployerLead
        fields = ["name", "email", "phone", "message", "source"]
        widgets = {
            "message": forms.Textarea(attrs={"rows": 4}),
        }


class ResumeCheckUploadForm(forms.ModelForm):
    class Meta:
        model = ResumeCheckRequest
        fields = ["file"]
