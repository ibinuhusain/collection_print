import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Assignments from './components/Assignments';
import AssignmentDetail from './components/AssignmentDetail';
import Payment from './components/Payment';
import PrinterTest from './components/PrinterTest';
import './styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Retrieve user info from storage
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? 
                <Dashboard 
                  currentUser={currentUser} 
                  onLogout={handleLogout} 
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/assignments" 
            element={
              isLoggedIn ? 
                <Assignments 
                  currentUser={currentUser} 
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/assignment/:id" 
            element={
              isLoggedIn ? 
                <AssignmentDetail 
                  currentUser={currentUser} 
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/payment/:id" 
            element={
              isLoggedIn ? 
                <Payment 
                  currentUser={currentUser} 
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/printer" 
            element={
              isLoggedIn ? 
                <PrinterTest 
                  currentUser={currentUser} 
                /> : 
                <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;