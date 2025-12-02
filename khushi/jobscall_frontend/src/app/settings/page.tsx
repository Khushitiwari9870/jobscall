'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/api/services/authService';
import { FiUser, FiLock, FiBell } from 'react-icons/fi';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-gray-600">Please log in to view your settings.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'password':
        return <PasswordSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-md text-gray-500">Manage your account settings and preferences.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                <FiUser className="mr-3" /> Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'password' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                <FiLock className="mr-3" /> Password
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                <FiBell className="mr-3" /> Notifications
              </button>
            </nav>
          </aside>

          <main className="md:w-3/4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const updatedProfile = await authService.updateProfile({ first_name: firstName, last_name: lastName, email });
      updateUser({ ...updatedProfile, id: updatedProfile.id.toString() });
      setMessage('Profile updated successfully!');
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
        </div>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

const PasswordSettings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== newPassword2) {
      setMessage('New passwords do not match.');
      return;
    }
    try {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword, new_password_confirm: newPassword });
      setMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setNewPassword2('');
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setMessage('Failed to update password.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" id="currentPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" id="confirmPassword" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Update Password</button>
        </div>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
       <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Job Recommendations</p>
            <p className="text-sm text-gray-500">Receive emails about jobs that match your profile.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Application Updates</p>
            <p className="text-sm text-gray-500">Get notified about the status of your job applications.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Promotional Emails</p>
            <p className="text-sm text-gray-500">Receive occasional updates about new features and offers.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

// Add this to your globals.css for the toggle switch styling
/*
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2563eb;
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
*/
