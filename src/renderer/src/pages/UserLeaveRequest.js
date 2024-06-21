

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserLeaveRequest = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purposeOfLeave, setPurposeOfLeave] = useState('');
  const [leaveAddress, setLeaveAddress] = useState('');
  const [leavePhoneNo, setLeavePhoneNo] = useState('');
  const [prmLvStnReq, setPrmLvStnReq] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    employeeId: '',
    name: '',
    designation: '',
    deptCode: '',
    deptName: '',
    unitCode: '',
    unitName: '',
  });

  useEffect(() => {
    // Retrieve employee details from localStorage or another source
    const storedEmployeeId = localStorage.getItem('userId');
    // const storedEmployeeName = localStorage.getItem('userName');
    // const storedEmployeeDesignation = localStorage.getItem('userDesignation');
    // const storedDeptCode = localStorage.getItem('userDeptCode');
    // const storedDeptName = localStorage.getItem('userDeptName');
    // const storedUnitCode = localStorage.getItem('userUnitCode');
    // const storedUnitName = localStorage.getItem('userUnitName');

    setEmployeeDetails({
      employeeId: storedEmployeeId,
      // name: storedEmployeeName,
      // designation: storedEmployeeDesignation,
      // deptCode: storedDeptCode,
      // deptName: storedDeptName,
      // unitCode: storedUnitCode,
      // unitName: storedUnitName,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const applicationDate = new Date().toISOString();

    try {
      const leaveRequest = {
        startDate: startDate,
        endDate: endDate,
        employeeId: employeeDetails.employeeId,
        purposeOfLeave: purposeOfLeave,
        leaveAddress: leaveAddress,
        leavePhoneNo: leavePhoneNo,
        prmLvStnReq: prmLvStnReq ? true : false,
      };

      await axios.post(
        'http://localhost:5000/api/leave-requests',
        leaveRequest,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setStartDate('');
      setEndDate('');
      setPurposeOfLeave('');
      setLeaveAddress('');
      setLeavePhoneNo('');
      setPrmLvStnReq(false);
      alert('Leave request submitted successfully.');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit leave request.');
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <h2>Submit Leave Request</h2>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Purpose of Leave:</label>
              <input
                type="text"
                value={purposeOfLeave}
                onChange={(e) => setPurposeOfLeave(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Leave Address:</label>
              <input
                type="text"
                value={leaveAddress}
                onChange={(e) => setLeaveAddress(e.target.value)}
              />
            </div>
            <div>
              <label>Leave Phone No:</label>
              <input
                type="text"
                value={leavePhoneNo}
                onChange={(e) => setLeavePhoneNo(e.target.value)}
              />
            </div>
            <div>
              <label>Permanent Leave Station Required:</label>
              <input
                type="checkbox"
                checked={prmLvStnReq}
                onChange={(e) => setPrmLvStnReq(e.target.checked)}
              />
            </div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserLeaveRequest;
