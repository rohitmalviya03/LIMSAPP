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
      const response = await api.post('/lab/register', form, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
        label="Pincode*"
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

export default LabRegistrationForm;
