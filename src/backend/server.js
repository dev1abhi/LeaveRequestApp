const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();



// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const leaveRequestRoutes = require('./routes/leaveRequest');
const userRoutes = require('./routes/user');
const adminSettingsRoutes = require('./routes/adminSettings');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Import initDB
const { initializeDatabase } = require('./models/initDB');


// Initialize the Express application
const app = express();

//sqlite3 database
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public'))); //serving static files from the public folder


// Call initializeDatabase and create the Tables if they dont exist
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Error initializing database:', err);
});


// Create users table if not exists (initializing sqllite database)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    userId TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });
});


// Endpoint to save token and user ID
// Endpoint to save or update token and userId in SQLite
app.post('/api/save-user', (req, res) => {
  const { token, userId } = req.body;

  // Check if there's already a row in the table
  db.get('SELECT * FROM users WHERE id = ?', [1], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Row already exists, update token and userId
      db.run('UPDATE users SET token = ?, userId = ? WHERE id = ?', [token, userId, 1], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.send('Token and userId updated in database');
      });
    } else {
      // No row found, insert new token and userId
      db.run('INSERT INTO users (token, userId) VALUES (?, ?)', [token, userId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.send('Token and userId saved to database');
      });
    }
  });
});


app.get('/api/get-user', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [1], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Token and userId not found' });
    }
    res.json({ token: row.token, userId: row.userId });
  });
});


// Endpoint to remove token from SQLite
app.post('/api/remove-token', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [1], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Token removed from database');
  });
});



// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin-settings',adminSettingsRoutes);
app.use('/api/notifications', subscriptionRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the notification scheduler
require('./notificationScheduler');

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

