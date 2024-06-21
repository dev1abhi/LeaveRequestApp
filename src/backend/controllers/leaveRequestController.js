// controllers/LeaveRequestController.js
const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

exports.createLeaveRequest = async (req, res) => {

    //this data getting from frontend
  let { startDate, endDate, employeeId, purposeOfLeave, leaveAddress, leavePhoneNo, prmLvStnReq } = req.body;

  console.log('EmployeeId data type:', typeof employeeId);
  employeeId = parseInt(employeeId);

  // Ensure prmLvStnReq is boolean (true or false)
  if (typeof prmLvStnReq !== 'boolean') {
    return res.status(400).json({ message: 'PrmLvStnReq must be a boolean value' });
  }

  try {
    const pool = await sql.connect(sqlConfig);

    const leaveRequestResult = await pool.request()
      .input('ApplDate', sql.DateTime, new Date()) // Application date is current date
      .input('TypeOfAppl', sql.Char(1), 'L') // Assuming 'L' is for Leave
      .input('PersNo', sql.Char(8), employeeId.toString().padStart(8, '0')) // Employee ID as PersNo
      .input('NameOfApplicant', sql.VarChar(100), 'Dummy Name') // Retrieve from Users table if needed
      .input('Desg', sql.VarChar(50), 'Dummy Designation') // Retrieve from Users table if needed
      .input('DeptCode', sql.Char(8), 'DPT01') // Retrieve from Users table if needed
      .input('DeptName', sql.VarChar(50), 'Dummy Department') // Retrieve from Users table if needed
      .input('UnitCode', sql.Char(8), 'UNT01') // Retrieve from Users table if needed
      .input('UnitName', sql.VarChar(50), 'Dummy Unit') // Retrieve from Users table if needed
      .input('PurposeOfLeave', sql.NVarChar(500), purposeOfLeave)
      .input('LeaveAddress', sql.NVarChar(250), leaveAddress)
      .input('LeavePhoneNo', sql.Char(13), leavePhoneNo)
      .input('Status', sql.Char(1), 'P') // Assuming 'P' for Pending
      .input('StatusDT', sql.DateTime, new Date()) //date when the status was updated
      .input('PrmLvStnReq', sql.Bit, prmLvStnReq) // Adding PrmLvStnReq
      .query(`
        INSERT INTO LeaveAppMst (ApplDate, TypeOfAppl, PersNo, NameOfApplicant, Desg, DeptCode, DeptName, UnitCode, UnitName, PurposeOfLeave, LeaveAddress, LeavePhoneNo, Status, StatusDT, PrmLvStnReq)
        OUTPUT INSERTED.LeaveAppMstID
        VALUES (@ApplDate, @TypeOfAppl, @PersNo, @NameOfApplicant, @Desg, @DeptCode, @DeptName, @UnitCode, @UnitName, @PurposeOfLeave, @LeaveAddress, @LeavePhoneNo, @Status, @StatusDT, @PrmLvStnReq)
      `);

    const leaveRequestId = leaveRequestResult.recordset[0].LeaveAppMstID;



    res.status(201).json({ id: leaveRequestId, employeeId, startDate, endDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getLeaveRequestById = async (req, res) => {
    try {
      const pool = await sql.connect({
        ...sqlConfig,
        options: {
          requestTimeout: 300000, // Specify timeout in milliseconds (e.g., 30 seconds)
        }
      });
  
      let id = parseInt(req.params.id);
  
      const result = await pool.request()
        .input('id', sql.Numeric(10, 0), id)
        .query(`
        SELECT *
        FROM LeaveAppMst
        WHERE LeaveAppMstID = @id;
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      res.status(200).json(result.recordset[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  exports.getAllLeaveRequests = async (req, res) => {
    try {
      const pool = await sql.connect({
        ...sqlConfig,
        // options: {
        //   requestTimeout: 13000000, // Specify timeout in milliseconds (e.g., 30 seconds)
        // }
      });
  

      const result = await pool.request()
      .query(`
      SELECT TOP 1000 *
      FROM LeaveAppMst
      `);

  
      res.status(200).json(result.recordset);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getLeaveRequestsByEmployee = async (req, res) => {
    let { employeeId } = req.params;
    try {
      const pool = await sql.connect(sqlConfig);
  
      console.log('EmployeeId data type:', typeof employeeId);
      employeeId = parseInt(employeeId);
  
      const result = await pool.request()
        .input('employeeId', sql.Char(8), employeeId.toString().padStart(8, '0')) // Convert to char(8) format
        .query(`
        SELECT *
        FROM LeaveAppMst
        WHERE PersNo = @employeeId
        `);
  
      res.status(200).json(result.recordset);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  exports.updateLeaveRequestStatus = async (req, res) => {
    let { id } = req.params;
    const { status } = req.body;
  
    id = parseInt(id);
  
    try {
      const pool = await sql.connect(sqlConfig);
  
      const result = await pool.request()
        .input('id', sql.Numeric(10, 0), id)
        .input('status', sql.Char(1), status) // Assuming status is a single character field
        .input('statusDate', sql.DateTime, new Date())
        .query(`
          UPDATE LeaveAppMst 
          SET Status = @status, StatusDT = @statusDate 
          WHERE LeaveAppMstID = @id
        `);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      res.status(200).json({ id, status });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  