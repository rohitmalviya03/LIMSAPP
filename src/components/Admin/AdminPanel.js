import React from 'react';

export default function AdminPanel({ user }) {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Admin Panel</h2>
      <p>Welcome, {user?.username}!</p>
      {/* Your add user, add tests, add labs UI here */}
    </div>
  );
}