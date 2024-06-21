// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

// POST route to save a subscription
router.post('/subscribe', async (req, res) => {
  const { endpoint, keys } = req.body;
  const { p256dh, auth } = keys;

  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input('endpoint', sql.NVarChar(sql.MAX), endpoint)
      .input('p256dh', sql.NVarChar(sql.MAX), p256dh)
      .input('auth', sql.NVarChar(sql.MAX), auth)
      .query(`
        IF NOT EXISTS (SELECT * FROM Subscriptions WHERE endpoint = @endpoint)
        BEGIN
          INSERT INTO Subscriptions (endpoint, p256dh, auth) VALUES (@endpoint, @p256dh, @auth)
        END
      `);
    res.status(201).json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Error saving subscription' });
  }
});

module.exports = router;
