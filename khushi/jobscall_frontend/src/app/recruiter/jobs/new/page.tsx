'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { companyService } from '@/lib/api/services/companyService';

type FormData = {
  title: string;
  employment_type: string;
  location: string;
  is_remote: boolean;
  min_salary: string;
  max_salary: string;
  description: string;
  requirements: string;
  skills_required: string[];
  experience: string;
  category: string;
  application_deadline: string;
  company: string;
};

const employmentTypeOptions = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' }
];

const experienceOptions = [
  { value: 'fresher', label: 'Fresher' },
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' }
];

const categoryOptions = [
  { value: 'it_software', label: 'IT & Software' },
  { value: 'banking', label: 'Banking' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'customer_service', label: 'Customer Service' }
];

export default function NewJobPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      employment_type: 'full_time',
      is_remote: false,
      skills_required: [],
      experience: '1-3',
      company: ''
    }
  });

  const skills = watch('skills_required') || [];

  useEffect(() => {
    let active = true;

    const fetchCompanies = async () => {
      try {
        const response = await companyService.getCompanies();
        if (!active) {
          return;
        }
        const responseResults = Array.isArray((response as { results?: unknown[] })?.results)
          ? (response as { results: { id: number; name: string }[] }).results
          : Array.isArray(response)
            ? response as { id: number; name: string }[]
            : [];
        const companyResults = responseResults.map((company: { id: number; name: string }) => ({
          id: company.id,
          name: company.name
        }));
        setCompanies(companyResults);
        if (companyResults.length === 1) {
          setValue('company', companyResults[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
        setCompanyError('Failed to load companies');
      }
    };

    fetchCompanies();

    return () => {
      active = false;
    };
  }, [setValue]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue('skills_required', [...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills_required', skills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      showToast({
        title: "Success",
        description: "Job posted successfully!",
      });

      // Redirect to the job detail page or jobs list
      router.push('/recruiter/jobs');
    } catch (error: unknown) {
      console.error('Error posting job:', error);

      // Extract error message from API response
      let errorMessage = "Failed to post job. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: Record<string, unknown> } };
        if (axiosError.response?.data) {
          const apiErrors = axiosError.response.data;
          const errorMessages = Object.entries(apiErrors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          errorMessage = errorMessages.join('\n');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      showToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/recruiter/jobs"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back to Jobs
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about the job position.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Job title is required' })}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Employment Type and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type *</Label>
                  <Controller
                    name="employment_type"
                    control={control}
                    rules={{ required: 'Employment type is required' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.employment_type && (
                    <p className="text-sm text-red-600">{errors.employment_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...register('location', { required: 'Location is required' })}
                    placeholder="e.g. New York, NY or Remote"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Remote Work */}
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_remote"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_remote"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_remote">This is a remote position</Label>
              </div>
            </CardContent>
          </Card>

          {/* Salary and Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Salary & Experience</CardTitle>
              <CardDescription>
                Set salary expectations and experience requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min_salary">Minimum Salary (₹)</Label>
                  <Input
                    id="min_salary"
                    type="number"
                    {...register('min_salary')}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_salary">Maximum Salary (₹)</Label>
                  <Input
                    id="max_salary"
                    type="number"
                    {...register('max_salary')}
                    placeholder="100000"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <Controller
                  name="experience"
                  control={control}
                  rules={{ required: 'Experience level is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.experience && (
                  <p className="text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
              <CardDescription>
                Select the company this job belongs to.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Controller
                  name="company"
                  control={control}
                  rules={{ required: 'Company selection is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
                {companyError && (
                  <p className="text-sm text-red-600">{companyError}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide detailed information about the job requirements and description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Job description is required' })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  {...register('requirements')}
                  placeholder="List the specific requirements, qualifications, or skills needed..."
                  rows={4}
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Application Deadline */}
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  {...register('application_deadline')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/recruiter/jobs">
              <Button type="button" variant="outline">
                <FiX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
