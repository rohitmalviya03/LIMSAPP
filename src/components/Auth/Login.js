import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/login.css';

const styles = {
  container: {
    maxWidth: 380,
    margin: '80px auto',
    padding: 32,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#1976d2',
    letterSpacing: 1,
  },
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 32,
  },
  radioLabel: {
    fontWeight: 500,
    fontSize: 16,
    cursor: 'pointer',
  },
  inputGroup: {
    marginBottom: 18,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 6,
    fontWeight: 500,
    color: '#222',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #bbb',
    borderRadius: 5,
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px 0',
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    fontSize: 17,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 10,
    transition: 'background 0.2s',
  },
  buttonHover: {
    background: '#125ea2',
  },
  message: {
    marginTop: 18,
    textAlign: 'center',
    color: '#d32f2f',
    fontWeight: 500,
    background: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: 6,
    padding: 12,
  }
};

const Login = ({ setUser }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    userType: 'lab', // default selection
  });
  const [message, setMessage] = useState('');
  const [btnHover, setBtnHover] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const HARDCODED_HOSPCODE = "96101"; // Change as needed for your environment

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/login', { 
        username: form.username, 
        password: form.password, 
        hospcode: HARDCODED_HOSPCODE ,
        
        userType:form.userType
      }, { withCredentials: true });
      
      setUser(res.data); // Save user info, including role
      localStorage.setItem("user", JSON.stringify(res.data));
      // Set labcode/hospcode in sessionStorage for use throughout the app
      sessionStorage.setItem("labcode", HARDCODED_HOSPCODE);
      console.log("User logged in:", res.data);
      // Role-based redirect
       if (res.data.role === 'lab') {
        navigate('/labadmin/dashboard');
      } 
      else if (res.data.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // If location.state?.from exists, go there, else dashboard
        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setMessage('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="userType"
            value="lab"
            checked={form.userType === 'lab'}
            onChange={handleChange}
            style={{ marginRight: 6 }}
          /> Lab
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="userType"
            value="user"
            checked={form.userType === 'user'}
            onChange={handleChange}
            style={{ marginRight: 6 }}
          /> User
        </label>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
      </div>
      <button
        type="submit"
        style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        Login
      </button>
      {message && <div style={styles.message}>{message}</div>}
    </form>
  );
};

export default Login;