import React, { useState } from 'react';

// Dummy data for demonstration
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Tenant' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Landlord' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Tenant');

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name,
      email,
      role,
    };
    setUsers([...users, newUser]);
    setName('');
    setEmail('');
    setRole('Tenant');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">User Management</h2>
      <form onSubmit={handleAddUser} className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border px-2 py-1"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <select
          className="border px-2 py-1"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Tenant">Tenant</option>
          <option value="Landlord">Landlord</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add User
        </button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
