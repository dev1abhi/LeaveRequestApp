import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-brand">Leave Management System</h2>
      <div className="navbar-links">
        <Link to="/employee-dashboard">Dashboard</Link>
        <Link to="/leave-request">Create Leave Request</Link>

        <div className="nav-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      </div>

     

    </nav>
  );
};

export default Navbar;
