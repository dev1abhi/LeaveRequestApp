
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { v4 as uuidv4 } from 'uuid';


const AdminDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [uniqueEmployees, setUniqueEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const navigate = useNavigate();

  const fetchLeaveRequests = async (token, employeeId = '') => {
    try {
      let url = 'http://localhost:5000/api/leave-requests';
      if (employeeId) {
        url = `http://localhost:5000/api/leave-requests/employee/${employeeId}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`
        }
      });

      // Filter out leave requests where status is neither 'A' (Approved) nor 'R' (Rejected)
      let pendingRequests = response.data.filter(
        (leaveRequest) => leaveRequest.Status !== 'A' && leaveRequest.Status !== 'R'
      );

      setLeaveRequests(pendingRequests);

      //setLeaveRequests(response.data);


    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log out and log in again.');
      localStorage.removeItem('token');
      navigate('/');
    } else {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch unique employees //taking too much time
        const employeesResponse = await axios.get('http://localhost:5000/api/user/getEmployees', {
          headers: {
            Authorization: `${token}`
          }
        });

        setUniqueEmployees(employeesResponse.data);

        // Fetch all leave requests initially (not filtered by employee)
        fetchLeaveRequests(token);
      } catch (error) {
        handleErrors(error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchLeaveRequests(token, selectedEmployee);
  }, [selectedEmployee]); // Re-fetch leave requests whenever the selected employee changes

 
  const handleLeaveRequestClick = (leaveRequest) => {
    // Navigate to a detailed view of the leave request
    navigate(`/leave-request/${leaveRequest.LeaveAppMstID}`);
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container'>
        <h2>Admin Dashboard - Pending Leave Requests</h2>

        {/* Dropdown for selecting unique employees */}
     <div className="dropdown-container">
      <label htmlFor="employeeDropdown">Filter by Employee: </label>
      <select
        id="employeeDropdown"
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="">All Employees</option>
        {uniqueEmployees.map((employee) => (
          <option key={uuidv4()} value={employee.PersNo}>
            {employee.NameOfApplicant}
          </option>
        ))}
      </select>
    </div>

        <ul>
          {leaveRequests.map((leaveRequest) => (
            <li
              key={leaveRequest.LeaveAppMstID}
              onClick={() => handleLeaveRequestClick(leaveRequest)}
              style={{
                cursor: 'pointer',
                backgroundColor: leaveRequest.Status === 'P' ? '#f9f9f9' : '#e0e0e0'
              }}
            >
              <p><strong>Employee Name:</strong> {leaveRequest.NameOfApplicant}</p>
              {/* <p><strong>Purpose of Leave:</strong> {leaveRequest.PurposeOfLeave}</p>
              <p><strong>Leave Address:</strong> {leaveRequest.LeaveAddress}</p>
              <p><strong>Leave Phone No:</strong> {leaveRequest.LeavePhoneNo}</p> */}
              <p><strong>Status:</strong> {leaveRequest.Status}</p>
              <p><strong>Requested on:</strong> {new Date(leaveRequest.ApplDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;