import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Assignments({ currentUser }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="container">
      <div className="navbar">
        <h2>Assignments</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/printer">Printer</Link>
        </div>
      </div>

      <h3 className="page-title">Collection Assignments</h3>

      {error && (
        <div className="status error">{error}</div>
      )}

      {loading ? (
        <div className="loading">Loading assignments...</div>
      ) : (
        <div>
          {assignments.length === 0 ? (
            <p>No assignments available.</p>
          ) : (
            <div>
              {assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <h3>Assignment #{assignment.id}</h3>
                  <p><strong>Customer:</strong> {assignment.customer_name}</p>
                  <p><strong>Amount Due:</strong> Rs. {assignment.amount_due?.toLocaleString() || '0.00'}</p>
                  <p><strong>Pending Amount:</strong> Rs. {assignment.pending_amount?.toLocaleString() || '0.00'}</p>
                  <p><strong>Status:</strong> <span style={{textTransform: 'capitalize'}}>{assignment.status || 'pending'}</span></p>
                  
                  <div>
                    <Link to={`/assignment/${assignment.id}`}>
                      <button>View Details</button>
                    </Link>
                    {assignment.status !== 'completed' && (
                      <Link to={`/payment/${assignment.id}`}>
                        <button className="btn-secondary">Collect Payment</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Assignments;