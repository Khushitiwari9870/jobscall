'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { FiPaperclip, FiSend, FiX, FiUserPlus } from 'react-icons/fi';

export default function ComposeEmail() {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const emailData = {
        to: formData.to.split(',').map(email => email.trim()),
        cc: formData.cc ? formData.cc.split(',').map(email => email.trim()) : [],
        bcc: formData.bcc ? formData.bcc.split(',').map(email => email.trim()) : [],
        subject: formData.subject,
        body: formData.body
      };

      // Use the API client which handles token refresh automatically
      await api.post('/api/v1/emails/send/', emailData);

      showToast({
        title: 'Success',
        description: 'Email sent successfully',
        variant: 'default',
      });

      // Redirect to sent folder
      router.push('/recruiter-dashboard/emails/sent');
    } catch (error) {
      console.error('Error sending email:', error);
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Compose Email</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <div className="relative">
            <Input
              id="to"
              name="to"
              type="email"
              required
              placeholder="recipient@example.com"
              value={formData.to}
              onChange={handleChange}
              className="pl-10"
            />
            <FiUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              name="cc"
              type="email"
              placeholder="cc@example.com"
              value={formData.cc}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bcc">BCC</Label>
            <Input
              id="bcc"
              name="bcc"
              type="email"
              placeholder="bcc@example.com"
              value={formData.bcc}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Email subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Message</Label>
          <Textarea
            id="body"
            name="body"
            rows={10}
            placeholder="Write your message here..."
            value={formData.body}
            onChange={handleChange}
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPaperclip className="mr-2 h-4 w-4" />
              Attach Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : (
              <>
                <FiSend className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
