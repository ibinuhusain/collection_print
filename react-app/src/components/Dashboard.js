import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard({ currentUser, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.getAssignments();
      setAssignments(response.assignments || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignments');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="navbar">
        <h2>Dashboard</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/printer">Printer</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h3 className="page-title">Welcome, {currentUser?.name || currentUser?.username}!</h3>
      
      {error && (
        <div className="status error">{error}</div>
      )}

      {loading ? (
        <div className="loading">Loading assignments...</div>
      ) : (
        <>
          <div className="stats">
            <p>Total Assignments: {assignments.length}</p>
            <p>Completed: {assignments.filter(a => a.status === 'completed').length}</p>
            <p>Pending: {assignments.filter(a => a.status !== 'completed').length}</p>
          </div>

          <div className="actions">
            <Link to="/assignments">
              <button>View All Assignments</button>
            </Link>
            <Link to="/printer">
              <button className="btn-secondary">Printer Test</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;