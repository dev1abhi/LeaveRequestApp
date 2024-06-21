const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

// Get user details by ID
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('role', sql.NVarChar, role)
      .query('INSERT INTO Users (name, email, password, role) VALUES (@name, @email, @password, @role)');
    
    if (result.rowsAffected[0] > 0) {
      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(400).json({ message: 'User creation failed' });
    }
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('role', sql.NVarChar, role)
      .query('UPDATE Users SET name = @name, email = @email, password = @password, role = @role WHERE id = @id');
    
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const pool = await sql.connect(sqlConfig);
//     const result = await pool.request()
//       .input('id', sql.Int, id)
//       .query('DELETE FROM Users WHERE id = @id');
    
//     if (result.rowsAffected[0] > 0) {
//       res.status(200).json({ message: 'User deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('SQL error', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Check if user is admin
exports.checkAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT role FROM Users WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isAdmin = result.recordset[0].role === 'Admin';
    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};


// Get unique employee IDs and names
exports.getUniqueEmployeeDetails = async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .query(`
      SELECT TOP 7000 PersNo, NameOfApplicant
      FROM (
        SELECT DISTINCT PersNo, NameOfApplicant
        FROM LeaveAppMst
      ) AS DistinctEmployees
    `);


    // const result2 = await pool.request()
    //   .query(`
    //     SELECT COUNT(DISTINCT PersNo) AS UniqueEmployeeCount
    //     FROM LeaveAppMst
    //   `);

    //   // Extract the count from the result
    // const uniqueEmployeeCount = result2.recordset[0].UniqueEmployeeCount;

    // // Log the count of unique employees
    // console.log(`Number of unique employees: ${uniqueEmployeeCount}`);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};