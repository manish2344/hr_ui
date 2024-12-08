
import './LeaveCalendar.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const LeaveManagementPage = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [leaveRequests, setLeaveRequests] = useState([]);

    // Get the token from localStorage or any other storage method
    const token = localStorage.getItem('token');

    // Fetch leave requests for admin view
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await axios.get('https://hr-board-iota.vercel.app/api/leaves/requests', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Add token to request headers
                    }
                });
                setLeaveRequests(response.data.data);
                console.log(response.data)
                setError('');
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Something went wrong');
            }
        };

        fetchLeaveRequests();
    }, [token]); // Depend on token to refresh if token changes

    // Handle leave application for employee
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://hr-board-iota.vercel.app/api/leaves/apply', {
                employeeId,
                leaveType,
                startDate,
                endDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to request headers
                }
            });

            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
            setMessage('');
        }
    };

    // Handle leave status update for admin
    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await axios.put(`https://hr-board-iota.vercel.app/api/leaves/update/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to request headers
                }
            });
            // Update the leave request status locally
            setLeaveRequests(leaveRequests.map(request =>
                request._id === id ? { ...request, status: response.data.data.status } : request
            ));
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
        }
    };

    return (
        <div className="leave-management-container">
            {/* Employee Section */}
            <Navbar />
            <Sidebar />
            <div className="employee-section">
                <h1>Employee Leave Application</h1>
                <form onSubmit={handleSubmit} className="leave-form">
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value)}
                            required
                        >
                            <option value="">Select Leave Type</option>
                            <option value="sick">Sick</option>
                            <option value="vacation">Vacation</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Apply for Leave</button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Admin Section */}
            <div className="admin-section">
                <h1>Admin Leave Requests</h1>
                {error && <p className="error-message">{error}</p>}

                <table className="leave-requests-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.length > 0 ? (
                            leaveRequests.map(request => (
                                <tr key={request._id}>
                                    <td>{request.employeeId?.name}</td>
                                    <td>{request.leaveType}</td>
                                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button
                                            onClick={() => handleUpdateStatus(request._id, 'approved')}
                                            disabled={request.status !== 'pending'}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(request._id, 'denied')}
                                            disabled={request.status !== 'pending'}
                                        >
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveManagementPage;
