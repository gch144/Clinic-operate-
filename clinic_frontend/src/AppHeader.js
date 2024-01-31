// AppHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import Logout from './components/auth/Logout';

const AppHeader = () => {
  const { userRole } = useUser();
  const displayName = localStorage.getItem('name');

  return (
    //<div className="header">
    <header>
        <h1>My Clinic App</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {userRole === 'Patient' && (
            <li>
              <Link to="/patient">Patient</Link>
            </li>
          )}
          {userRole === 'Doctor' && (
            <li>
              <Link to="/doctor">Doctor</Link>
            </li>
          )}
          {userRole === 'Admin' && (
            <li>
              <Link to="/admin-dashboard">Admin Panel</Link>
            </li>
          )}
          {userRole && (
            <li>
              <Link to="/change-password">Change Password</Link>
              </li>
              )}
            <li style={{ display: 'flex', alignItems: 'center' }}>
            {userRole && (
                <span style={{ marginRight: '10px' }}>Welcome <b>{displayName}</b></span>
            )}
            <Logout />
            </li>

          {!userRole && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
