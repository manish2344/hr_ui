import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCandidates: 0,
    pendingLeaves: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch stats and recent activities
    const fetchDashboardData = async () => {
      try {
        const employeesResponse = await axios.get('/api/employees', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const candidatesResponse = await axios.get('/api/candidates', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const leavesResponse = await axios.get('/api/leaves', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setStats({
          totalEmployees: employeesResponse.data.length,
          totalCandidates: candidatesResponse.data.length,
          pendingLeaves: leavesResponse.data.filter((leave) => leave.status === 'pending').length,
        });

        // Fetch recent activities
        setRecentActivities(leavesResponse.data.slice(0, 5)); // Show latest 5 leave requests
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content">
        <h1>HR Dashboard</h1>

        {/* Stats Section */}
        <div className="stats">
          <div className="stat-card">
            <h2>{stats.totalEmployees}</h2>
            <p>Total Employees</p>
          </div>
          <div className="stat-card">
            <h2>{stats.totalCandidates}</h2>
            <p>Total Candidates</p>
          </div>
          <div className="stat-card">
            <h2>{stats.pendingLeaves}</h2>
            <p>Pending Leaves</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            {recentActivities.map((activity, index) => (
              <li key={index}>
                {activity.employeeId} requested leave from {activity.startDate} to {activity.endDate} ({activity.status})
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
