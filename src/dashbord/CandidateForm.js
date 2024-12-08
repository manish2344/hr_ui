import React, { useState } from "react";
import styles from './CandidateForm.module.css'; 

const CandidateForm = ({ onAddCandidate, onClose }) => {
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    yearsOfExperience: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewCandidate((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCandidate.name);
    formData.append("email", newCandidate.email);
    formData.append("phone", newCandidate.phone);
    formData.append("department", newCandidate.department);
    formData.append("role", newCandidate.role);
    formData.append("yearsOfExperience", newCandidate.yearsOfExperience);
    formData.append("resume", newCandidate.resume);

    const token = localStorage.getItem("token");

    fetch("https://hr-board-iota.vercel.app/api/candidates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        onAddCandidate(data);
        onClose();
        setNewCandidate({
          name: "",
          email: "",
          phone: "",
          department: "",
          role: "",
          yearsOfExperience: "",
          resume: null,
        });
      })
      .catch((error) => console.error("Error adding candidate:", error));
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2>Add Candidate</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={newCandidate.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={newCandidate.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={newCandidate.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="department"
            value={newCandidate.department}
            onChange={handleInputChange}
            placeholder="Department"
            required
          />
          <select
            name="role"
            value={newCandidate.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            <option value="QA">QA</option>
          </select>
          <input
            type="text"
            name="yearsOfExperience"
            value={newCandidate.yearsOfExperience}
            onChange={handleInputChange}
            placeholder="Years of Experience"
            required
          />
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Add Candidate</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
