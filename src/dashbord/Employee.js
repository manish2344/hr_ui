
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import './employee.css'; // Import the CSS for the Employee section
import { FiTrash } from "react-icons/fi";
import Navbar from "./Navbar";
const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search bar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch employees from the API with authentication token
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }
        console.log(`Employee with id ${id} deleted`);
        // Refresh the employee list after deletion
        setEmployees(employees.filter((emp) => emp._id !== id));
      })
      .catch((error) => console.error("Error deleting employee:", error));
  };

  // Filter employees based on the search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`employee-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="employee-dashboard-content">
          <div className="employee-header">
            <h1>Employee List</h1>
            <input
              type="text"
              className="search-bar"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.department}</td>
                      <td>{employee.role}</td>
                      <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                      <td>
                        <FiTrash
                          className="delete-icon"
                          onClick={() => handleDelete(employee._id)}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No employees found.</td>
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

export default Employee;
