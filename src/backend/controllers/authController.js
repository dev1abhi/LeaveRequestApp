const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const existingUser = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');
      
    if (existingUser.recordset && existingUser.recordset.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role)
      .query('INSERT INTO Users (name, email, password, role) VALUES (@name, @email, @password, @role)');
    
    // Check if any rows were affected by the insert operation
    if (result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] === 1) {
      // Get the ID of the inserted user
      const insertedUser = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT id FROM Users WHERE email = @email');
      
      const userId = insertedUser.recordset[0].id;

      const token = jwt.sign({ id: userId, role }, '9a0b9d1b9292b4e81234567890abcdef01234567890abcdef01234567890abcdef', { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: userId, name, email, role } });
    } else {
      throw new Error('User registration failed');
    }
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

      if (!result.recordset || result.recordset.length === 0) { // check
        return res.status(400).json({ message: 'Invalid credentials' });
      }

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, '9a0b9d1b9292b4e81234567890abcdef01234567890abcdef01234567890abcdef', { expiresIn: '1h' });
    // console.log('User logged in:', user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};
