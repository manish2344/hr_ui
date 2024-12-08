import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => { 
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <h1 className={styles.navbarBrand}>HRMS Dashboard</h1>
        <button className={styles.hamburger} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </button>
      </div>
      <div className={`${styles.navbarRight} ${isMenuOpen ? styles.show : ''}`}>
        <button className={styles.notificationBtn}>🔔</button>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
