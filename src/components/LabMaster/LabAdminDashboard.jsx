// LabAdminDashboard.jsx
import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    maxWidth: 700,
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: 32,
  },
  title: { textAlign: 'center', marginBottom: 24, color: '#1976d2' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 16 },
  th: { background: '#e3f2fd', padding: 8, border: '1px solid #90caf9' },
  td: { padding: 8, border: '1px solid #90caf9', textAlign: 'center' },
  button: {
    margin: '0 4px',
    padding: '6px 12px',
    border: 'none',
    borderRadius: 4,
    background: '#1976d2',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  form: {
    background: '#f9f9f9',
    padding: 16,
    borderRadius: 6,
    marginTop: 24,
    marginBottom: 24,
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formGroup: { marginBottom: 12, display: 'flex', flexDirection: 'column' },
  label: { marginBottom: 4, fontWeight: 500 },
  input: {
    padding: '8px 10px',
    border: '1px solid #bbb',
    borderRadius: 4,
    fontSize: 15,
  },
  message: {
    marginTop: 18,
    textAlign: 'center',
    color: '#1976d2',
    fontWeight: 500,
    background: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: 6,
    padding: 16,
    wordBreak: 'break-all'
  }
};

const LabAdminDashboard = ({ labcode }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', role: '', password: '' });
  const [message, setMessage] = useState('');

  // Fetch users for this lab
  useEffect(() => {
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  // Handle form input changes
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Open form for add or edit
  const openForm = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user, password: '' } : { username: '', email: '', role: '', password: '' });
    setShowForm(true);
    setMessage('');
  };

  // Submit add or edit user
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const url = editingUser ? '/api/auth/update' : '/api/auth/add';
    const method = editingUser ? 'PUT' : 'POST';
    const payload = editingUser
      ? { ...form, id: editingUser.id }
      : { ...form, labcode, password: form.password };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMessage(editingUser ? 'User updated successfully.' : 'User added successfully.');
      // Refresh user list
      fetch('/api/auth/users')
        .then(res => res.json())
        .then(setUsers);
      setShowForm(false);
    } else {
      const err = await res.text();
      setMessage('Error: ' + err);
    }
  };

  // Delete user
  const handleDelete = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`/api/auth/delete?userId=${userId}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('User deleted successfully.');
      setUsers(users.filter(u => u.id !== userId));
    } else {
      const err = await res.text();
      setMessage('Error: ' + err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lab Admin Dashboard</h2>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <button style={styles.button} onClick={() => openForm()}>Add User</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => openForm(u)}>Edit</button>
                <button style={{ ...styles.button, background: '#d32f2f' }} onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input style={styles.input} name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email" value={form.email} onChange={handleChange} required type="email" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input style={styles.input} name="role" value={form.role} onChange={handleChange} required />
          </div>
          {!editingUser && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password" value={form.password} onChange={handleChange} required type="password" />
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button style={styles.button} type="submit">{editingUser ? 'Update' : 'Add'} User</button>
            <button style={{ ...styles.button, background: '#888', marginLeft: 8 }} type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
};

export default LabAdminDashboard;