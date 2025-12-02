'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Inbox, Send, FileText } from 'lucide-react';

const EmailSMSPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    template: '',
  });
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/emails/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to.split(',').map(email => email.trim()),
          subject: formData.subject,
          message: formData.message,
          template_id: formData.template || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showToast({
        title: 'Success',
        description: 'Your message has been sent successfully!',
      });
      
      // Reset form
      setFormData({
        to: '',
        subject: '',
        message: '',
        template: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Email & SMS Center</h1>
      
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="compose">
            <Send className="mr-2 h-4 w-4" /> Compose
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Mail className="mr-2 h-4 w-4" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="history">
            <Inbox className="mr-2 h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To (comma separated for multiple)</Label>
                  <Input
                    id="to"
                    name="to"
                    type="email"
                    required
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="recipient@example.com, another@example.com"
                    multiple
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template (optional)</Label>
                  <Input
                    id="template"
                    name="template"
                    type="text"
                    value={formData.template}
                    onChange={handleInputChange}
                    placeholder="Template ID (if any)"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Placeholder components for other tabs
const TemplatesTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Email Templates</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Templates will be listed here</p>
    </CardContent>
  </Card>
);

const CampaignsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Email Campaigns</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Campaigns will be listed here</p>
    </CardContent>
  </Card>
);

const HistoryTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Message History</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Message history will be listed here</p>
    </CardContent>
  </Card>
);

export default EmailSMSPage;
