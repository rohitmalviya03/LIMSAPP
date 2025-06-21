import React, { useEffect, useState } from 'react';
import api from "../../api/api";
const styles = {
  container: {
    maxWidth: 800,
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

const roles = ['admin', 'labadmin', 'user'];
  // Get logged-in user object from localStorage (assume it's stored as JSON string)
  const userStr = localStorage.getItem("user") || '{"id":"rohitmalviya03"}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }

const AdminUserMaster = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', role: 'user', password: '' });
  const [message, setMessage] = useState('');
  const [activity, setActivity] = useState([]);
  const [backendError, setBackendError] = useState(false);

  // Fetch all users
  useEffect(() => {
    api.get('/auth/users-master/' + obj.username)
      .then(res => {
        setUsers(res.data);
        setBackendError(false);
      })
      .catch(() => setBackendError(true));
  }, []);

  // Fetch activity for a user
//   const fetchActivity = userId => {
//     fetch(`/api/auth/activity?userId=${userId}`)
//       .then(res => res.json())
//       .then(setActivity);
//   };

  // Handle form input changes
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Open form for add or edit
  const openForm = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user, password: '' } : { username: '', email: '', role: 'user', password: '' });
    setShowForm(true);
    setMessage('');
  };

  // Submit add or edit user
  const handleAddUser = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const url = editingUser ? '/auth/user-master/update' : '/auth/add';
      const payload = editingUser
        ? { ...form, id: editingUser.id, labcode: obj.username }
        : { ...form, password: form.password, labcode: obj.username };
      const res = await api.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status === 200) {
        setMessage(editingUser ? 'User updated successfully.' : 'User added successfully.');
        api.get('/auth/users-master/' + obj.username)
          .then(res => {
            setUsers(res.data);
            setBackendError(false);
          })
          .catch(() => setBackendError(true));
        setShowForm(false);
      } else {
        const err = await res.text();
        setMessage('Error: ' + err);
      }
      setBackendError(false);
    } catch (err) {
      setBackendError(true);
      setMessage('Error: ' + err.message);
    }
  };

  // Update user details
  const handleUpdateUser = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        id: editingUser.id,
        username: form.username,
        email: form.email,
        role: form.role,
        labcode: obj.username, // Use logged-in user's labcode
        password: form.password // can be blank if not changing
      };
      const res = await api.post('/auth/user-master/update', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status === 200) {
        setMessage('User updated successfully.');
        api.get('/auth/users-master/' + obj.username)
          .then(res => {
            setUsers(res.data);
            setBackendError(false);
          })
          .catch(() => setBackendError(true));
        setShowForm(false);
      } else {
        const err = await res.text();
        setMessage('Error: ' + err);
      }
      setBackendError(false);
    } catch (err) {
      setBackendError(true);
      setMessage('Error: ' + err.message);
    }
  };

  // Delete user
  const handleDelete = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/auth/user-master/delete?userId=${userId}`);
      if (res.status === 200) {
        setMessage('User deleted successfully.');
        setUsers(users.filter(u => u.id !== userId));
        setBackendError(false);
      } else {
        const err = await res.text();
        setMessage('Error: ' + err);
      }
    } catch (err) {
      setBackendError(true);
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Master (Admin Panel)</h2>
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
                {/* <button style={{ ...styles.button, background: '#388e3c' }} onClick={() => fetchActivity(u.id)}>Track Activity</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <form style={styles.form} onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
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
            <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
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
      {activity.length > 0 && (
        <div style={styles.message}>
          <strong>User Activity:</strong>
          <ul>
            {activity.map((a, idx) => <li key={idx}>{a}</li>)}
          </ul>
        </div>
      )}
      {message && <div style={styles.message}>{message}</div>}
      {/* Backend Error Banner */}
      <br></br>
      {backendError && (
        <div style={{
          background: '#ffebee',
          color: '#b71c1c',
          border: ' #e53935',
          borderRadius: 8,
          padding: '12px 18px',
          marginBottom: 18,
          fontWeight: 700,
          fontSize: 16,
          textAlign: 'center',
          boxShadow: '0 1px 6px #0001'
        }}>
          
         Somwthing went wrong while fetching data from the server. Please try again later.
        </div>
      )}
    </div>
  );
};

export default AdminUserMaster;