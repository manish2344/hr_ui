import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';
import Dashboard from './dashbord/Dashboar';
import Candidate from './dashbord/Candidate';
import Employee from './dashbord/Employee';
import Attendance from './dashbord/Attendance';
import LeaveCalendar from './dashbord/LeaveCalendar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    
    <Router>
      {/* <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} /> */}
      <div className="main-content">
        <Routes>
          
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Candidate/>} />
          <Route path="/employees" element={<Employee/>} />
          <Route path="/attendance" element={<Attendance/>} />
          <Route path="/leave" element={<LeaveCalendar/>} />
          

        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
