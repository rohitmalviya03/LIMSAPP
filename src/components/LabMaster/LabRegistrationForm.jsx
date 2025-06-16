import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../../api/api';

function generateLabCode(pincode) {
  if (!pincode) return '';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${pincode}${random}`;
}

const LabRegistrationForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    logo: '',
    mode: '',
    status: '',
    pincode: '',
    labCode: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'pincode' && /^\d+$/.test(value) && value.length >= 4) {
      updatedForm.labCode = generateLabCode(value);
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Use JSON payload
      const response = await api.post('/lab/register', form, {
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }

      });

      if (response.status === 200 || response.status === 201) {
        setMessage('Lab registered successfully!');
        setForm({
          name: '',
          description: '',
          location: '',
          logo: '',
          mode: '',
          status: '',
          pincode: '',
          labCode: '',
        });
      } else {
        setMessage('Failed to register lab. Server error.');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error registering lab. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 5,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Lab Registration
      </Typography>

      <TextField
        label="pincode*"
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        required
        inputProps={{ pattern: '[0-9]*' }}
      />

      <TextField
        label="Lab Code"
        name="labCode"
        value={form.labCode}
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="Name*"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        minRows={3}
      />

      <TextField
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
      />

      <TextField
        label="Logo URL"
        name="logo"
        value={form.logo}
        onChange={handleChange}
      />

      <TextField
        label="Mode"
        name="mode"
        value={form.mode}
        onChange={handleChange}
        placeholder="online/offline"
      />

      <TextField
        label="Status"
        name="status"
        value={form.status}
        onChange={handleChange}
        placeholder="active/inactive/pending"
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register Lab
      </Button>

      {message && (
        <Typography textAlign="center" color="primary" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// LabAdminDashboard component
const LabAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [lab, setLab] = useState({});
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch('/lab/me').then(res => res.json()).then(setLab);
    fetch('/lab/users').then(res => res.json()).then(setUsers);
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId) => {
    await fetch(`/lab/users/${userId}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleUserFormSubmit = async (user) => {
    if (editingUser) {
      // Edit user
      await fetch(`/lab/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    } else {
      // Add user
      await fetch('/lab/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    }
    // Refresh users
    const updated = await fetch('/lab/users').then(res => res.json());
    setUsers(updated);
    setShowUserForm(false);
  };

  const handleEditLab = async (labDetails) => {
    await fetch('/lab/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(labDetails),
    });
    setLab(labDetails);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Lab Admin Dashboard</h2>
      <section style={{ marginBottom: 32 }}>
        <h3>Lab Details</h3>
        <div>Name: {lab.name}</div>
        <div>Lab Code: {lab.labCode}</div>
        <div>Pincode: {lab.pincode}</div>
        <button onClick={() => handleEditLab({ ...lab, name: prompt('Edit Lab Name', lab.name) })}>
          Edit Lab Details
        </button>
      </section>
      <section>
        <h3>Users</h3>
        <button onClick={handleAddUser}>Add User</button>
        <table border="1" cellPadding="8" style={{ marginTop: 12, width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleEditUser(u)}>Edit</button>
                  <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showUserForm && (
          <UserForm
            user={editingUser}
            onSubmit={handleUserFormSubmit}
            onCancel={() => setShowUserForm(false)}
          />
        )}
      </section>
    </div>
  );
};

// Simple UserForm component
const UserForm = ({ user = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    username: user.username || '',
    role: user.role || '',
    password: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16, background: '#f9f9f9', padding: 16, borderRadius: 6 }}>
      <div>
        <label>Name: </label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Username: </label>
        <input name="username" value={form.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Role: </label>
        <input name="role" value={form.role} onChange={handleChange} required />
      </div>
      {!user.id && (
        <div>
          <label>Password: </label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
      )}
      <button type="submit">{user.id ? 'Update' : 'Add'} User</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
};

export default LabRegistrationForm;
