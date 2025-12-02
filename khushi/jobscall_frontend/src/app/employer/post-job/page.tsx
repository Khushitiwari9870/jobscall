'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { jobService } from '@/lib/api/services/jobService';
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
  { value: '', label: 'Select a category (optional)' },
  { value: 'it_software', label: 'IT & Software' },
  { value: 'banking', label: 'Banking' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'customer_service', label: 'Customer Service' }
];

export default function PostJobPage() {
  const router = useRouter();
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
  const selectedCompanyId = watch('company');

  useEffect(() => {
    let active = true;

    const fetchCompanies = async () => {
      try {
        const response = await companyService.getCompanies();
        if (!active) {
          return;
        }
        const responseResults = Array.isArray((response as { results?: unknown[] })?.results)
          ? (response as { results: unknown[] }).results
          : Array.isArray(response)
            ? response
            : [];
        const companyResults = responseResults.map((company: unknown) => {
          const comp = company as { id: number; name: string };
          return {
            id: comp.id,
            name: comp.name
          };
        });
        setCompanies(companyResults);
        if (companyResults.length === 1) {
          setValue('company', companyResults[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
        if (active) {
          setCompanyError('Unable to load companies. Please refresh.');
        }
      }
    };

    fetchCompanies();

    return () => {
      active = false;
    };
  }, [setValue]);

  useEffect(() => {
    if (companyError && selectedCompanyId) {
      setCompanyError(null);
    }
  }, [companyError, selectedCompanyId]);

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setValue('skills_required', [...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills_required', skills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const companyId = data.company ? parseInt(data.company, 10) : undefined;
      const selectedCompany = companies.find((item) => item.id === companyId);
      const trimmedCategory = data.category?.trim();

      const jobData = {
        ...data,
        company: companyId,
        company_name: selectedCompany?.name,
        min_salary: data.min_salary ? parseInt(data.min_salary, 10) : undefined,
        max_salary: data.max_salary ? parseInt(data.max_salary, 10) : undefined,
        skills_required: data.skills_required,
        category: trimmedCategory ? trimmedCategory : undefined,
        posted_on: new Date().toISOString(),
        application_deadline: data.application_deadline || undefined,
        is_active: true,
      };
      if (!companyId || !selectedCompany) {
        setCompanyError('Please select a company.');
        return;
      }
      await jobService.postJob(jobData as typeof jobData & { company: number });
      alert('Job posted successfully!');
      router.push('/employer/my-jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/employer/my-jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" /> Back to Jobs
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in the details below to post a new job listing.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Job Information Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Job Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <select
                  id="company"
                  {...register('company', { required: 'Company is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id.toString()}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
                {companyError && (
                  <p className="mt-1 text-sm text-red-600">{companyError}</p>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title', { required: 'Job title is required' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.title ? 'border-red-300' : 'border'}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">
                  Job Type *
                </label>
                <select
                  id="employment_type"
                  {...register('employment_type', { required: 'Job type is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  {employmentTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
                  
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  {...register('location', { required: 'Location is required' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-300' : 'border'}`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="is_remote"
                  type="checkbox"
                  {...register('is_remote')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3 text-sm">
                  <label htmlFor="is_remote" className="font-medium text-gray-700">
                    This is a remote position
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Information Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Salary Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700">
                  Minimum Salary
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="min_salary"
                    {...register('min_salary')}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700">
                  Maximum Salary
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="max_salary"
                    {...register('max_salary')}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Job Description</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Job description is required' }}
                  render={({ field }) => (
                    <div className="bg-white rounded border border-gray-300">
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <div className="bg-white rounded border border-gray-300">
                       <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Skills & Requirements Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Skills & Requirements</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="skills_required" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Type a skill and press Enter"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove skill</span>
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  id="experience"
                  {...register('experience', { required: 'Experience level is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Job Category
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Application Details Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Application Details</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700">
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="application_deadline"
                  {...register('application_deadline')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/employer/my-jobs"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
              {!isSubmitting && <FiSave className="ml-2 -mr-1 h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
