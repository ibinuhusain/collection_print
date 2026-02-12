import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Payment({ currentUser }) {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await api.getAssignment(id);
      setAssignment(response.assignment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.collectPayment({
        assignment_id: id,
        amount: parseFloat(amount),
        notes: notes,
        agent_id: currentUser.id
      });

      if (response.status === 'success') {
        setSuccess('Payment collected successfully!');
        
        // Update the assignment status
        setAssignment(prev => ({
          ...prev,
          status: 'completed',
          pending_amount: prev.pending_amount - parseFloat(amount)
        }));
        
        // Reset form
        setAmount('');
        setNotes('');
      } else {
        setError(response.message || 'Payment collection failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during payment collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <h2>Collect Payment</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/printer">Printer</Link>
        </div>
      </div>

      <h3 className="page-title">Collect Payment for Assignment #{id}</h3>

      {error && (
        <div className="status error">{error}</div>
      )}

      {success && (
        <div className="status success">{success}</div>
      )}

      {assignment && (
        <div className="assignment-card">
          <p><strong>Customer:</strong> {assignment.customer_name}</p>
          <p><strong>Amount Due:</strong> Rs. {assignment.amount_due?.toLocaleString() || '0.00'}</p>
          <p><strong>Pending Amount:</strong> Rs. {assignment.pending_amount?.toLocaleString() || '0.00'}</p>
          <p><strong>Status:</strong> <span style={{textTransform: 'capitalize'}}>{assignment.status || 'pending'}</span></p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount Collected:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount collected"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes about the payment"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing Payment...' : 'Confirm Payment'}
        </button>
        <Link to={`/assignment/${id}`}>
          <button type="button" className="btn-secondary">Cancel</button>
        </Link>
      </form>
    </div>
  );
}

export default Payment;