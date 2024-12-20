import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? '' : styles.collapsed}`}>
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        &#9776;
      </button>

      <div className={styles.sidebarLinks}>
        <Link to="/">Candidates</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/leave">Leaves</Link>
        <Link to="/attendance">Attendance</Link>
      </div>
    </div>
  );
};

export default Sidebar;
