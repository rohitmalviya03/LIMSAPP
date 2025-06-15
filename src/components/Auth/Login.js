import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const HARDCODED_HOSPCODE = "96101"; // Change as needed for your environment

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8181/api/auth/login', { username, password, hospcode: HARDCODED_HOSPCODE }, { withCredentials: true });
      setUser(res.data); // Save user info, including role
      localStorage.setItem("user", JSON.stringify(res.data));
      // Set labcode/hospcode in sessionStorage for use throughout the app
      sessionStorage.setItem("labcode", HARDCODED_HOSPCODE);
      console.log("User logged in:", res.data);
      // Role-based redirect
      if (res.data.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // If location.state?.from exists, go there, else dashboard
        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">   
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;