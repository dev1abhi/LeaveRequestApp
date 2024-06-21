const { setDynamicInterval } = require('../notificationScheduler');

const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

exports.getTiming = async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query('SELECT * FROM AdminSettings');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createTiming = async (req, res) => {
  const { timerInterval } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('timerInterval', sql.Int, timerInterval)
      .query('INSERT INTO AdminSettings (timerInterval) VALUES (@timerInterval)');
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTiming = async (req, res) => {
  let { id } = req.params;
  id=parseInt(id);
  const { timerInterval } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('timerInterval', sql.Int, timerInterval)
      .query('UPDATE AdminSettings SET timerInterval = @timerInterval WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Timing not found' });
    }

     // Reset the interval with the new setting
     await setDynamicInterval();
    res.status(200).json({ message: 'Timing updated successfully' });


  } catch (error) {
    console.error('SQL error', error);
    res.status(500).json({ message: error.message });
  }
};
