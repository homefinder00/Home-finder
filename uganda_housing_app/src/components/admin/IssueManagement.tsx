import React from 'react';

// Dummy data for demonstration
const issues = [
  { id: 1, description: 'Leaking roof in apartment', status: 'Open' },
  { id: 2, description: 'Broken window in house', status: 'Resolved' },
];

const IssueManagement: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Reported Issues</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              <td className="py-2 px-4 border">{issue.id}</td>
              <td className="py-2 px-4 border">{issue.description}</td>
              <td className="py-2 px-4 border">{issue.status}</td>
              <td className="py-2 px-4 border">
                <button className="bg-green-500 text-white px-2 py-1 rounded">Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueManagement;
