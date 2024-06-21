import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const LeaveRequestDetails = () => {
  const { id } = useParams();
  const [leaveRequest, setLeaveRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveRequest = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/leave-requests/${id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setLeaveRequest(response.data);
    };

    fetchLeaveRequest();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/leave-requests/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      alert(`Leave request ${status}`);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Update leave request status error:', error);
    }
  };

  if (!leaveRequest) return <div>Loading...</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="leave-request-details">
        <h2>Leave Request Details</h2>
        <p>Employee ID: {leaveRequest.PersNo}</p>
        <p>Name: {leaveRequest.NameOfApplicant}</p>
        <p>Designation: {leaveRequest.Desg}</p>
        <p>Department: {leaveRequest.DeptName}</p>
        <p>Unit: {leaveRequest.UnitName}</p>
        <p>Purpose of Leave: {leaveRequest.PurposeOfLeave}</p>
        <p>Date of Application: {new Date(leaveRequest.ApplDate).toLocaleDateString()}</p>
        <p>Status: {leaveRequest.Status}</p>
        <button onClick={() => handleStatusChange('A')}>Accept</button>
        <button onClick={() => handleStatusChange('R')}>Reject</button>
      </div>
    </div>
  );
};

export default LeaveRequestDetails;
