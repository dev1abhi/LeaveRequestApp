import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
     // Remove token from SQLite via server endpoint
     axios.post('http://localhost:5000/api/remove-token')
     .then(response => {
       console.log(response.data); // Optional: Log success message
       navigate('/admin-dashboard'); // Redirect to login page
     })
     .catch(error => {
       console.error('Token removal failed:', error);
       // Handle error as needed (optional)
     });
  };

  return (
    <nav className="admin-navbar">
      <div className="nav-left">
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin-settings">Settings</Link>
        <Link to="/register">Register a User</Link>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
