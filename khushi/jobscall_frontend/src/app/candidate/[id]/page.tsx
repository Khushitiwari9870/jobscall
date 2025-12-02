import { Button } from '@/components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, Download, Mail, MessageSquare, MoreHorizontal, Phone, Printer, Share2 } from 'lucide-react';

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  // Mock data - replace with actual data fetching
  const candidate = {
    id: params.id,
    name: 'Rajesh Kumar',
    currentJob: 'Senior Software Engineer',
    currentCompany: 'Tech Solutions Inc.',
    experience: '5 years 2 months',
    salary: '₹12,00,000',
    location: 'Bangalore, Karnataka',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    isPhoneVerified: true,
    isEmailVerified: true,
    skills: [
      { name: 'JavaScript', years: 5 },
      { name: 'React', years: 4 },
      { name: 'Node.js', years: 4 },
      { name: 'TypeScript', years: 3 },
      { name: 'MongoDB', years: 3 },
      { name: 'AWS', years: 2 },
    ],
    experienceDetails: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        duration: 'Jan 2021 - Present',
        functionalArea: 'Software Development',
        industry: 'Information Technology',
        description: 'Leading a team of 5 developers to build scalable web applications.'
      },
      // Add more experience entries
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Delhi',
        year: '2018'
      }
    ],
    desiredJob: {
      location: 'Bangalore, Hyderabad, Pune',
      functionalArea: 'Software Development',
      industry: 'Information Technology',
      jobType: 'Full-time',
      shiftType: 'Day Shift'
    },
    personalDetails: {
      teamHandled: '5-10 members',
      dateOfBirth: '15/05/1995',
      gender: 'Male',
      functionalArea: 'Software Development',
      industry: 'Information Technology'
    },
    similarCandidates: [
      {
        id: '2',
        name: 'Amit Sharma',
        title: 'Full Stack Developer',
        company: 'Digital Solutions',
        experience: '4 years',
        location: 'Bangalore'
      },
      // Add more similar candidates
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-600">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-gray-600">{candidate.currentJob} at {candidate.currentCompany}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>{candidate.experience} experience</span>
              <span>•</span>
              <span>{candidate.salary}</span>
              <span>•</span>
              <span>{candidate.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Comment
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>{candidate.phone}</span>
            {candidate.isPhoneVerified && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span>{candidate.email}</span>
            {candidate.isEmailVerified && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="resume">Attached Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {/* Experience Section */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.experienceDetails.map((exp, index) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exp.position}</h3>
                        <span className="text-sm text-gray-500">{exp.duration}</span>
                      </div>
                      <p className="text-gray-600">{exp.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{exp.functionalArea}</Badge>
                        <Badge variant="outline">{exp.industry}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Skills</CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      + Add Skills
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill.name} <span className="text-gray-500 ml-1">{skill.years}y</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* More Details Section */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">More Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Team Handled</h4>
                      <p>{candidate.personalDetails.teamHandled}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                      <p>{candidate.personalDetails.dateOfBirth}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                      <p>{candidate.personalDetails.gender}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Functional Area</h4>
                      <p>{candidate.personalDetails.functionalArea}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                      <p>{candidate.personalDetails.industry}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Desired Job Section */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Desired Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Job Location</h4>
                      <p>{candidate.desiredJob.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Functional Area</h4>
                      <p>{candidate.desiredJob.functionalArea}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                      <p>{candidate.desiredJob.industry}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Job Type</h4>
                      <p>{candidate.desiredJob.jobType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Shift Type</h4>
                      <p>{candidate.desiredJob.shiftType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Resume</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 min-h-[800px] bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-500">Resume preview will be shown here</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                      Previous
                    </Button>
                    <div className="text-sm text-gray-500">
                      Page 1 of 3
                    </div>
                    <Button variant="ghost" size="sm">
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Similar Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.similarCandidates.map((c, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{c.name}</h4>
                        <p className="text-sm text-gray-600">{c.title}</p>
                        <p className="text-xs text-gray-500">{c.company} • {c.experience} • {c.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                  View all
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full p-3 border rounded-md min-h-[100px] text-sm"
                placeholder="Add your notes about this candidate..."
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
