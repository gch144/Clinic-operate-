// Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext';

const Logout = () => {
  const { updateUserRole } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('UserRole');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');

    // Update user role in the context
    updateUserRole(null);

    // Notify user about successful logout
    toast.success('You have been logged out successfully.');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: 'black', // Change text color if needed
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
