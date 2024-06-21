const sql = require('mssql');
const sqlConfig = require('./config/sqlConfig');
const webpush = require('web-push');
const dotenv = require('dotenv');
const axios=require('axios');

// Load environment variables
dotenv.config();

let intervalId;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`, 
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const checkUnseenNotifications = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
  
        // Fetch leave requests whose status is not 'A' (Approved) or 'R' (Rejected)
       const result = await pool.request()
      .input('status1', sql.Char(1), 'A')
      .input('status2', sql.Char(1), 'R')
      .query(`
        SELECT * FROM LeaveAppMst
        WHERE Status NOT IN (@status1, @status2)
      `);

    const unseenNotifications = result.recordset;
    const unseenCount = unseenNotifications.length;

    if (unseenCount > 0) {
      console.log(unseenCount)
      const subscriptionsResult = await pool.request().query('SELECT * FROM Subscriptions');
      const subscriptions = subscriptionsResult.recordset;
      console.log('Subscriptions:', subscriptions); 

      const notificationPayload = JSON.stringify({
        title: 'Unseen Notifications',
        message: `You have ${unseenCount} unseen leave request(s)`,
      });

      

      const sendNotifications = subscriptions.map(subscription => {
        // Prepare subscription object as required by web-push
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh,
          },
        };

        return webpush.sendNotification(pushSubscription, notificationPayload);
      });

      await Promise.all(sendNotifications);
    }
  } catch (error) {
    console.error('Error fetching unseen notifications:', error);
  }
};




//node notifier way
// const sql = require('mssql');
// const sqlConfig = require('./config/sqlConfig');
// const notifier = require('node-notifier');
// const path = require('path');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// // Ensure your VAPID details and other settings are loaded from .env or similar config

// let intervalId;

// const checkUnseenNotifications = async () => {
//   try {
//     // Connect to the SQL Server
//     const pool = await sql.connect(sqlConfig);

//     // Fetch leave requests whose status is not 'A' (Approved) or 'R' (Rejected)
//     const result = await pool.request()
//       .input('status1', sql.Char(1), 'A')
//       .input('status2', sql.Char(1), 'R')
//       .query(`
//         SELECT * FROM LeaveAppMst
//         WHERE Status NOT IN (@status1, @status2)
//       `);

//     const pendingRequests = result.recordset;
//     const pendingCount = pendingRequests.length;

//     if (pendingCount > 0) {
//       notifier.notify(
//         {
//           title: 'Pending Leave Requests',
//           message: `You have ${pendingCount} pending leave request(s)`,
//           icon: path.join(__dirname, '../assets/icon.png'), // Path to an icon image
//           sound: true, // Notification sound
//           wait: true, // Wait for user action
//           closeLabel: 'Dismiss',
//         },
//         function (err, response, metadata) {
//           if (err) console.error(err);
//           if (response === 'activate') {
//             import('open').then(open => {
//               open.default('http://localhost:3000/admin-dashboard');
//             }).catch(err => {
//               console.error('Error opening the admin dashboard:', err);
//             });
//           }
//         }
//       );
//     }
//   } catch (error) {
//     console.error('Error fetching pending leave requests:', error);
//   }
// };


const setDynamicInterval = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    const settingResult = await pool.request().query('SELECT TOP 1 * FROM AdminSettings');
    const setting = settingResult.recordset[0];
    const timerInterval = setting ? setting.timerInterval : 10; // Default to 15 minutes if not set

    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(checkUnseenNotifications, timerInterval * 60 * 1000);
     //console.log(intervalId);
    checkUnseenNotifications();
  } catch (error) {
    console.error('Error fetching timer interval setting:', error);
  }
};

setDynamicInterval();

module.exports = {
  setDynamicInterval,
};
