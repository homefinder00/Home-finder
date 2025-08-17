import React from 'react';

// Dummy data for demonstration
const properties = [
  { id: 1, name: 'Kampala Apartment', owner: 'Jane Smith', status: 'Available' },
  { id: 2, name: 'Entebbe House', owner: 'John Doe', status: 'Rented' },
];

const PropertyManagement: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Property Management</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Owner</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(property => (
            <tr key={property.id}>
              <td className="py-2 px-4 border">{property.id}</td>
              <td className="py-2 px-4 border">{property.name}</td>
              <td className="py-2 px-4 border">{property.owner}</td>
              <td className="py-2 px-4 border">{property.status}</td>
              <td className="py-2 px-4 border">
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyManagement;
