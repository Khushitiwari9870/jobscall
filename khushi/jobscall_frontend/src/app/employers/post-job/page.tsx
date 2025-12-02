'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FiPlus, FiX, FiDollarSign, FiMapPin, FiBriefcase, FiClock, FiSave } from 'react-icons/fi';

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship',
  'Freelance'
];

const experienceLevels = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead',
  'Manager',
  'Executive'
];

const jobCategories = [
  'Technology',
  'Marketing',
  'Sales',
  'Design',
  'Customer Service',
  'Human Resources',
  'Finance',
  'Healthcare',
  'Education',
  'Other'
];

export default function PostJobPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobType: '',
    experienceLevel: '',
    category: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'yearly',
    description: '',
    isRemote: false,
    applicationEmail: '',
    applicationUrl: '',
    deadline: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
    }
  };

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      const newBenefits = benefits.filter((_, i) => i !== index);
      setBenefits(newBenefits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty requirements and benefits
      const filteredRequirements = requirements.filter(req => req.trim() !== '');
      const filteredBenefits = benefits.filter(benefit => benefit.trim() !== '');

      const response = await fetch('/api/v1/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requirements: filteredRequirements,
          benefits: filteredBenefits,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to post job');
      }

      const data = await response.json();
      
      showToast({
        title: 'Success!',
        description: 'Your job has been posted successfully.',
      });

      // Redirect to job details page or dashboard
      router.push(`/employers/jobs/${data.id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-gray-600">Fill in the details below to post your job listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Job Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiBriefcase className="mr-2" /> Job Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Your company name"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select 
                value={formData.jobType}
                onValueChange={(value) => handleSelectChange('jobType', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select 
                value={formData.experienceLevel}
                onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase().replace(' ', '-')}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Job Category *</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location & Salary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiMapPin className="mr-2" /> Location & Salary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">Location *</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => handleCheckboxChange('isRemote', checked as boolean)}
                  />
                  <Label htmlFor="isRemote" className="text-sm font-normal">Fully Remote</Label>
                </div>
              </div>
              <Input
                id="location"
                name="location"
                placeholder="e.g. New York, NY or Remote"
                value={formData.location}
                onChange={handleInputChange}
                disabled={formData.isRemote}
                required={!formData.isRemote}
              />
              {formData.isRemote && (
                <p className="text-sm text-gray-500 mt-1">Location will be shown as &ldquo;Remote&rdquo;</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Salary Range (optional)</Label>
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    placeholder="Min"
                    className="pl-8"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">to</div>
                <div className="flex-1 relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    placeholder="Max"
                    className="pl-8"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                  />
                </div>
                <Select 
                  value={formData.salaryType}
                  onValueChange={(value) => handleSelectChange('salaryType', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Per" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">/year</SelectItem>
                    <SelectItem value="monthly">/month</SelectItem>
                    <SelectItem value="hourly">/hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Job Description *</h2>
          <div className="space-y-4">
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the job responsibilities, requirements, and expectations..."
              className="min-h-[200px]"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Requirements</h2>
          <div className="space-y-4">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Requirement ${index + 1}`}
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeRequirement(index)}
                  disabled={requirements.length <= 1}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addRequirement}
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Benefits</h2>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Benefit ${index + 1}`}
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                  disabled={benefits.length <= 1}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addBenefit}
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiClock className="mr-2" /> Application Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="applicationEmail">Application Email</Label>
              <Input
                id="applicationEmail"
                name="applicationEmail"
                type="email"
                placeholder="careers@company.com"
                value={formData.applicationEmail}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">OR</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">Application URL</Label>
              <Input
                id="applicationUrl"
                name="applicationUrl"
                type="url"
                placeholder="https://company.com/careers/apply"
                value={formData.applicationUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline (optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FiSave className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <FiSave className="mr-2 h-4 w-4" />
                Post Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
