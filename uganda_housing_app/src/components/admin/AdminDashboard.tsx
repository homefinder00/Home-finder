import React, { useState } from 'react';
import UserManagement from './UserManagement';
import PropertyManagement from './PropertyManagement';
import IssueManagement from './IssueManagement';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'properties' | 'issues'>('users');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTab('users')}>Users</button>
        <button className={`px-4 py-2 rounded ${tab === 'properties' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTab('properties')}>Properties</button>
        <button className={`px-4 py-2 rounded ${tab === 'issues' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTab('issues')}>Reported Issues</button>
      </div>
      <div>
        {tab === 'users' && <UserManagement />}
        {tab === 'properties' && <PropertyManagement />}
        {tab === 'issues' && <IssueManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
