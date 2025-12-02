'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  FiSave, 
  FiMail, 
  FiUser, 
  FiServer, 
  FiLock,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

export interface EmailSettings {
  id: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpUseTls: boolean;
  defaultFromEmail: string;
  defaultFromName: string;
  replyToEmail?: string;
  replyToName?: string;
  dailySendLimit?: number;
  trackOpens: boolean;
  trackClicks: boolean;
  unsubscribeHeader: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailSettingsPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  const [settings, setSettings] = useState<EmailSettings>({
    id: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpUseTls: true,
    defaultFromEmail: '',
    defaultFromName: '',
    trackOpens: true,
    trackClicks: true,
    unsubscribeHeader: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/emails/settings/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch email settings');
      }
      
      const data = await response.json();
      // If no settings exist, the API might return an empty array
      if (Array.isArray(data) && data.length > 0) {
        setSettings(data[0]);
      } else if (!Array.isArray(data)) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load email settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const method = settings.id ? 'PUT' : 'POST';
      const url = settings.id 
        ? `/api/v1/emails/settings/${settings.id}/`
        : '/api/v1/emails/settings/';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      const data = await response.json();
      setSettings(prev => ({
        ...prev,
        ...data,
        // Don't update the password in the UI after save for security
        smtpPassword: prev.smtpPassword
      }));
      
      showToast({
        title: 'Success',
        description: 'Email settings saved successfully.',
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      showToast({
        title: 'Error',
        description: 'Failed to save email settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);
      
      const response = await fetch('/api/v1/emails/test-connection/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUsername: settings.smtpUsername,
          smtpPassword: settings.smtpPassword,
          smtpUseTls: settings.smtpUseTls
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: data.message || 'Successfully connected to the SMTP server.'
        });
      } else {
        throw new Error(data.message || 'Failed to connect to the SMTP server.');
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your email sending settings and preferences.
        </p>
      </div>
      
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">SMTP Server</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure your SMTP server settings for sending emails.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiServer className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="smtpHost"
                  name="smtpHost"
                  type="text"
                  placeholder="smtp.example.com"
                  className="pl-10"
                  value={settings.smtpHost}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                name="smtpPort"
                type="number"
                placeholder="587"
                value={settings.smtpPort}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="smtpUsername"
                  name="smtpUsername"
                  type="text"
                  placeholder="username"
                  className="pl-10"
                  value={settings.smtpUsername}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="smtpPassword"
                  name="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={settings.smtpPassword}
                  onChange={handleInputChange}
                  required={!settings.id}
                  autoComplete="new-password"
                />
              </div>
              {settings.id && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep the current password
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUseTls">Use TLS</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpUseTls"
                  checked={settings.smtpUseTls}
                  onCheckedChange={(checked) => handleSwitchChange('smtpUseTls', checked)}
                />
                <span className="text-sm text-gray-700">
                  {settings.smtpUseTls ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enable if your SMTP server requires TLS/SSL
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !settings.smtpHost || !settings.smtpPort || !settings.smtpUsername}
            >
              <FiRefreshCw className={`h-4 w-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {testResult && (
              <div className={`mt-3 p-3 rounded-md ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {testResult.success ? (
                      <FiCheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult.success ? 'Connection successful!' : 'Connection failed'}
                    </p>
                    <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {testResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Email Settings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure default email settings and tracking preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="defaultFromEmail">Default From Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="defaultFromEmail"
                  name="defaultFromEmail"
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  className="pl-10"
                  value={settings.defaultFromEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultFromName">Default From Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="defaultFromName"
                  name="defaultFromName"
                  type="text"
                  placeholder="Your Company Name"
                  className="pl-10"
                  value={settings.defaultFromName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Reply-To Email (Optional)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="replyToEmail"
                  name="replyToEmail"
                  type="email"
                  placeholder="support@yourdomain.com"
                  className="pl-10"
                  value={settings.replyToEmail || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="replyToName">Reply-To Name (Optional)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="replyToName"
                  name="replyToName"
                  type="text"
                  placeholder="Support Team"
                  className="pl-10"
                  value={settings.replyToName || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailySendLimit">Daily Send Limit (Optional)</Label>
              <Input
                id="dailySendLimit"
                name="dailySendLimit"
                type="number"
                min="0"
                placeholder="Leave empty for no limit"
                value={settings.dailySendLimit || ''}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of emails that can be sent per day (0 = no limit)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Tracking & Privacy</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure email tracking and privacy settings.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trackOpens">Track Email Opens</Label>
                <p className="text-sm text-gray-500">
                  Track when recipients open your emails using a tracking pixel
                </p>
              </div>
              <Switch
                id="trackOpens"
                checked={settings.trackOpens}
                onCheckedChange={(checked) => handleSwitchChange('trackOpens', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trackClicks">Track Link Clicks</Label>
                <p className="text-sm text-gray-500">
                  Track when recipients click on links in your emails
                </p>
              </div>
              <Switch
                id="trackClicks"
                checked={settings.trackClicks}
                onCheckedChange={(checked) => handleSwitchChange('trackClicks', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="unsubscribeHeader">Add Unsubscribe Header</Label>
                <p className="text-sm text-gray-500">
                  Add List-Unsubscribe header to comply with email regulations
                </p>
              </div>
              <Switch
                id="unsubscribeHeader"
                checked={settings.unsubscribeHeader}
                onCheckedChange={(checked) => handleSwitchChange('unsubscribeHeader', checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            <FiSave className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
