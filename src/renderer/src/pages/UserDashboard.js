import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        console.log('userId in dashboard:', userId);

        const response = await axios.get(`http://localhost:5000/api/leave-requests/employee/${userId}`, {
          headers: {
            Authorization: `${token}`
          }
        });

        setLeaveRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch leave requests error:', error);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Employee Dashboard</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {leaveRequests.map((request) => (
              <li key={request.LeaveAppMstID}>
                <p>Application Date: {new Date(request.ApplDate).toLocaleDateString()}</p>
                <p>Purpose of Leave: {request.PurposeOfLeave}</p>
                <p>Status: {request.Status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
