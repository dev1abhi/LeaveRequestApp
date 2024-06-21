const sql = require('mssql');
const sqlConfig = require('../config/sqlConfig');

async function getSubscriptionById(subscriptionId) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, subscriptionId)
      .query('SELECT * FROM Subscriptions WHERE id = @id');
    return result.recordset[0];
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
}


async function deleteSubscription(id) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Subscriptions WHERE id = @id');
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
}

module.exports = {
  getSubscriptionById,
  deleteSubscription
};
