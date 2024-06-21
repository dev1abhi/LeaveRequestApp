

import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';

const AdminSettings = () => {
  const [timerInterval, setTimerInterval] = useState('');
  const [timing, setTiming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the existing timing from the backend
  useEffect(() => {
    const fetchTiming = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin-settings', {
          headers: {
            Authorization: `${token}`
          }
        });
        if (response.data.length > 0) {
          setTiming(response.data[0]);
          setTimerInterval(response.data[0].timerInterval);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTiming();
  }, []);

  // Handle form submission for updating the timing
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (timing) {
        // Update existing timing
        const response = await axios.put(`http://localhost:5000/api/admin-settings/${timing.id}`, 
          { timerInterval }, 
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
        setTiming(response.data);
      }

      // Reset form
      setTimerInterval('');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (

    <div>
            <AdminNavbar />

    <div className='container'>
      <h1>Admin Settings</h1>
      {timing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Set Notification Alert Interval: In mins</label>
            <input
              type="number"
              value={timerInterval}
              onChange={(e) => setTimerInterval(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>No timing found to update.</p>
      )}
    </div>
    </div>
  );
};

export default AdminSettings;
