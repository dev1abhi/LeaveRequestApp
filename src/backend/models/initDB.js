// models/initDB.js
const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

async function initializeDatabase() {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log('SQL Server connection successful');


    // Create Subscriptions table if it doesn't exist
    const createSubscriptionsTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Subscriptions' AND xtype='U')
      CREATE TABLE Subscriptions (
        id INT PRIMARY KEY IDENTITY(1,1),
        endpoint NVARCHAR(MAX) NOT NULL,
        p256dh NVARCHAR(MAX) NOT NULL,
        auth NVARCHAR(MAX) NOT NULL
      );
    `;
    await pool.request().query(createSubscriptionsTableQuery);
    console.log('Subscriptions table is ready.');

    // Create Users table if it doesn't exist
    const createUsersTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Employee'))
      );
    `;
    await pool.request().query(createUsersTableQuery);
   console.log('Users table is ready.');


    // Create LeaveRequests table
    // await pool.request().query(`
    //   IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LeaveRequests' and xtype='U')
    //   CREATE TABLE LeaveRequests (
    //     id INT PRIMARY KEY IDENTITY(1,1),
    //     employeeId INT NOT NULL,
    //     startDate DATE NOT NULL,
    //     endDate DATE NOT NULL,
    //     status NVARCHAR(50) DEFAULT 'Pending',
    //     requestDate DATETIME DEFAULT GETDATE(),
    //     FOREIGN KEY (employeeId) REFERENCES Users(id)
    //   )
    // `);
    // console.log('leave req table is ready.');


// Create AdminSettings table if it doesn't exist
  const createAdminSettingsTableQuery = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AdminSettings' AND xtype='U')
  CREATE TABLE AdminSettings (
    id INT PRIMARY KEY IDENTITY(1,1),
    timerInterval INT NOT NULL
  );
`;
await pool.request().query(createAdminSettingsTableQuery);
console.log('AdminSettings table is ready.');

 // Insert a row into AdminSettings with a timerInterval of 15 minutes if the table is empty
//  const insertDefaultAdminSettingsQuery = `
//  IF NOT EXISTS (SELECT * FROM AdminSettings)
//  INSERT INTO AdminSettings (timerInterval) VALUES (15);
// `;
// await pool.request().query(insertDefaultAdminSettingsQuery);
// console.log('Default row with timerInterval of 15 mins inserted into AdminSettings.');



 // Create AdminNotifications table if it doesn't exist
 const createAdminNotificationsTableQuery = `
 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AdminNotifications' AND xtype='U')
 CREATE TABLE AdminNotifications (
   id INT PRIMARY KEY IDENTITY(1,1),
   title NVARCHAR(MAX) NOT NULL,
   message NVARCHAR(MAX) NOT NULL,
   userId INT NOT NULL,
   leaveRequestId NUMERIC(10,0) NOT NULL,
   status NVARCHAR(50) DEFAULT 'unseen',
   createdAt DATETIME DEFAULT GETDATE(),
   FOREIGN KEY (userId) REFERENCES Users(id),
   FOREIGN KEY (leaveRequestId) REFERENCES LeaveAppMst(LeaveAppMstID)
 );
`;
await pool.request().query(createAdminNotificationsTableQuery);
console.log('AdminNotifications table is ready.');


 } 
 
 catch (err) {
   console.error('Error creating tables', err);
 }

}

 
module.exports = {
  initializeDatabase,
};
