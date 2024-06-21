import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserLeaveRequest from './pages/UserLeaveRequest';
import UserDashboard from './pages/UserDashboard';
import LeaveRequestDetails from './pages/LeaveRequestDetails';
import AdminSettings from './pages/AdminSettings';
import Register from './pages/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');


  useEffect(() => {
    // Fetch token from SQLite
    axios.get('http://localhost:5000/api/get-user')
      .then(response => {
        const { token } = response.data;
        // Verify token with another POST request
        axios.post('http://localhost:5000/api/auth/verify-token', { token })
          .then(response => {
            // Token verification successful
            const { user } = response.data;
            setUserRole(user.role);
            setAuthenticated(true);
          })
          .catch(error => {
            console.error('Token verification failed:', error);
            setAuthenticated(false);
          })
          .finally(() => setLoading(false));
      })
      .catch(error => {
        console.error('Token fetch failed:', error);
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading indicator
  }


 


  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={authenticated ? (
          userRole === 'Admin' ? <AdminDashboard/> : <UserDashboard/>
        ) : (
         <Login />
        )} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/leave-request" element={<UserLeaveRequest />} />
        <Route path="/leave-request/:id" element={<LeaveRequestDetails />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
