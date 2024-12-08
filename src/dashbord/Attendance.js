import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import './attendance.css';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("present");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://hr-board-iota.vercel.app/api/attendance", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        return response.json();
      })
      .then((data) => setAttendance(data.data))
      .catch((error) => console.error("Error fetching attendance:", error));
  }, []);

  const handleStatusChange = (id, status) => {
    const token = localStorage.getItem("token");

    fetch(`https://hr-board-iota.vercel.app/api/attendance/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update attendance status");
        }
        return response.json();
      })
      .then((data) => {
        setAttendance((prevAttendance) =>
          prevAttendance.map((entry) =>
            entry._id === id ? { ...entry, status } : entry
          )
        );
      })
      .catch((error) => console.error("Error updating attendance:", error));
  };

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`attendance-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="attendance-dashboard-content">
          <h1>Attendance List</h1>
          <div className="attendance-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Task</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((entry) => (
                    <tr key={entry._id}>
                      <td>{entry.employeeId?.name}</td>
                      <td>{entry.designation}</td>
                      <td>{entry.department}</td>
                      <td>{entry.task}</td>
                      <td>
                        <select
                          value={entry.status}
                          onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="work from home">Work from Home</option>
                          <option value="medical leave">Medical Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No attendance data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
