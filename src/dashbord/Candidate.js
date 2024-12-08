

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CandidateForm from "./CandidateForm"; // Import the CandidateForm component
import "./Candidate.css"; // Import the updated candidate.css for styling
import { FaTrash, FaDownload, FaUserCheck } from "react-icons/fa"; // Add icon for move to employee

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle the modal visibility
  };

  const addCandidate = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
  };

  const deleteCandidate = (candidateId) => {
    const token = localStorage.getItem("token");

    fetch(`https://hr-board-iota.vercel.app/api/candidates/${candidateId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete candidate");
        }
        setCandidates((prev) => prev.filter((candidate) => candidate._id !== candidateId));
      })
      .catch((error) => console.error("Error deleting candidate:", error));
  };

  const handleResumeDownload = (candidateId, candidateName) => {
    const token = localStorage.getItem("token");

    fetch(`https://hr-board-iota.vercel.app/api/candidates/${candidateId}/resume`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download resume");
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${candidateName}_Resume.pdf`;
        link.click();
      })
      .catch((error) => console.error("Error downloading resume:", error));
  };

  const moveToEmployee = (candidateId) => {
    const token = localStorage.getItem("token");

    fetch(`https://hr-board-iota.vercel.app/api/candidates/${candidateId}/move-to-employee`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to move candidate to employee");
        }
        return response.json();
      })
      .then((data) => {
        setCandidates((prev) => prev.filter((candidate) => candidate._id !== candidateId));
        console.log("Candidate moved to employee:", data);
      })
      .catch((error) => console.error("Error moving candidate to employee:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://hr-board-iota.vercel.app/api/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }
        return response.json();
      })
      .then((data) => setCandidates(data))
      .catch((error) => console.error("Error fetching candidates:", error));
  }, []);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <Navbar/>
      <Sidebar/>
      
      <div className={`candidate-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="candidate-dashboard-content">
          <h1>Candidate List</h1>

          <div className="search-add-container">
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search Candidates"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-candidate-btn" onClick={toggleModal}>
              Add New Candidate
            </button>
          </div>

          <div className="candidate-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Position</th>
                  <th>Experience</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate._id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone}</td>
                      <td>{candidate.status}</td>
                      <td>{candidate.role}</td>
                      <td>{candidate.yearsOfExperience}</td>
                      <td>
                        <button
                          className="resume-btn"
                          onClick={() => handleResumeDownload(candidate._id, candidate.name)}
                        >
                          <FaDownload />
                        </button>
                      </td>
                      <td>
                        <button
                          className="move-to-employee-btn"
                          onClick={() => moveToEmployee(candidate._id)}
                        >
                          Move to Employee
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteCandidate(candidate._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No candidates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <CandidateForm onAddCandidate={addCandidate} onClose={toggleModal} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Candidate;

