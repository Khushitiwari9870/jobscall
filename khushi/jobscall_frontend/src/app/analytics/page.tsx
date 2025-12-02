'use client';

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import Header from '@/components/analytics/Header';
import FilterBar from '../../components/analytics/FilterBar';
import KpiTiles from '../../components/analytics/KpiTiles';
import LineChart from '../../components/analytics/LineChart';
import UsageTable from '../../components/analytics/UsageTable';
import Footer from '../../components/analytics/Footer';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [selectedDays, setSelectedDays] = useState('last30');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedKpi, setSelectedKpi] = useState('logins');

  // Dummy data for the dashboard
  const kpiData = {
    logins: { value: '42', label: 'Average Daily Logins' },
    searches: { value: '128', label: 'Searches' },
    profileViews: { value: '256', label: 'Profile Views' },
    jobsPosted: { value: '18', label: 'Jobs Posted' },
    emailSent: { value: '64', label: 'Email Sent' },
    smsSent: { value: '32', label: 'SMS Sent' },
    excelDownload: { value: '24', label: 'Excel Download' },
    copilotCreated: { value: '8', label: 'Co-pilot Created' },
  };

  // Dummy data for the line chart
  const generateChartData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      data.push({
        date: format(subDays(new Date(), i), 'MMM dd'),
        value: Math.floor(Math.random() * 100) + 20, // Random values between 20-120
      });
    }
    return data;
  };

  // Dummy data for the table
  const tableData = [
    {
      id: 1,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      logins: 42,
      status: 'Active',
      searches: 128,
      jobs: 5,
      profileViews: 256,
      excelViews: 12,
      emailSent: 64,
      smsSent: 32,
      ivrCalls: 8,
      copilotUtilized: 4,
      copilotLimit: 10,
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Account Usage Report</h1>
        
        <FilterBar 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          selectedUser={selectedUser}
          onUserChange={setSelectedUser}
        />
        
        <KpiTiles 
          kpiData={kpiData} 
          selectedKpi={selectedKpi} 
          onKpiSelect={setSelectedKpi} 
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">Logins</h2>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              Export
            </button>
          </div>
          <div className="h-64">
            <LineChart data={generateChartData()} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-medium text-gray-600">
                Report Duration: {format(dateRange.startDate, 'MMM dd, yyyy')} to {format(dateRange.endDate, 'MMM dd, yyyy')}
              </h2>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Export
              </button>
            </div>
            <UsageTable data={tableData} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;
