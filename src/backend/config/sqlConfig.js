// config/sqlConfig.js
//change to personal sql server details 

const { encrypt } = require("web-push");

// config/sqlConfig.js
module.exports = {
  user:  'itoms',
  password: 'nalco@123',
  database: 'itomsdb' ,
  server: '10.60.235.111',
  driver:'msnodesqlv8',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 720000
  },
  requestTimeout: 720000,
  options: {
    trustedConnection: true,
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    idleTimeoutMillis: 720000,
  },

};


