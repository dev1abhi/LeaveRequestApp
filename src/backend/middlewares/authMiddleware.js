const jwt = require('jsonwebtoken');
const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

const authMiddleware = async (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization');

  // Check if token is not present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user from payload to the request object
    req.user = decoded;

    // Check if user exists in the database
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT * FROM Users WHERE id = @id');

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'User does not exist, authorization denied' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
