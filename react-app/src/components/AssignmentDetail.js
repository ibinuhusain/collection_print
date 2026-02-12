import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function AssignmentDetail({ currentUser }) {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await api.getAssignment(id);
      setAssignment(response.assignment);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="navbar">
          <h2>Assignment Detail</h2>
          <div>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/assignments">Assignments</Link>
            <Link to="/printer">Printer</Link>
          </div>
        </div>
        <div className="loading">Loading assignment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="navbar">
          <h2>Assignment Detail</h2>
          <div>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/assignments">Assignments</Link>
            <Link to="/printer">Printer</Link>
          </div>
        </div>
        <div className="status error">{error}</div>
        <Link to="/assignments"><button>Back to Assignments</button></Link>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container">
        <div className="navbar">
          <h2>Assignment Detail</h2>
          <div>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/assignments">Assignments</Link>
            <Link to="/printer">Printer</Link>
          </div>
        </div>
        <div className="status error">Assignment not found</div>
        <Link to="/assignments"><button>Back to Assignments</button></Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="navbar">
        <h2>Assignment Detail</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/printer">Printer</Link>
        </div>
      </div>

      <h3 className="page-title">Assignment #{assignment.id}</h3>

      <div className="assignment-card">
        <p><strong>Customer:</strong> {assignment.customer_name}</p>
        <p><strong>Amount Due:</strong> Rs. {assignment.amount_due?.toLocaleString() || '0.00'}</p>
        <p><strong>Pending Amount:</strong> Rs. {assignment.pending_amount?.toLocaleString() || '0.00'}</p>
        <p><strong>Status:</strong> <span style={{textTransform: 'capitalize'}}>{assignment.status || 'pending'}</span></p>
        <p><strong>Address:</strong> {assignment.address}</p>
        <p><strong>Phone:</strong> {assignment.phone}</p>
        <p><strong>Notes:</strong> {assignment.notes}</p>
      </div>

      <div className="actions">
        <Link to="/assignments">
          <button>Back to Assignments</button>
        </Link>
        {assignment.status !== 'completed' && (
          <Link to={`/payment/${assignment.id}`}>
            <button className="btn-secondary">Collect Payment</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default AssignmentDetail;