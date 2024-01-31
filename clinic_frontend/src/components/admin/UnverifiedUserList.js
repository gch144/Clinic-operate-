import React, { useEffect, useState } from 'react';
import { adminApi, setAuthToken } from '../../api'; // Update the path
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const UnverifiedUserList = () => {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        // Set JWT token in headers before making any admin API requests
        setAuthToken();

        const response = await adminApi.getUnverifiedUsers();
        console.log('API Response:', response.data);

        // Ensure that response.data has the expected structure
        if (response.data && Array.isArray(response.data.patientUsers)) {
          setUnverifiedUsers(response.data.patientUsers);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching unverified users:', error);
      }
    };

    fetchUnverifiedUsers();
  }, []);

  const handleVerifyUser = async (userId) => {
    try {
      // Set JWT token in headers before making any admin API requests
      setAuthToken();

      // Use the verifyUser API function to verify a user
      const response = await adminApi.verifyUser(userId);
      console.log('User verification successful:', response.data);
      toast.success('User verification successful');

      // Update the local state to reflect the change in verification status
      setUnverifiedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.patientId === userId ? { ...user, isVerified: true } : user
        )
      );
    } catch (error) {
      console.error('Error verifying user:', error);
      // Handle the error (display an error message, etc.)
    }
  };

  return (
    <div>
      <h2>Unverified Users</h2>
      <ul>
        {unverifiedUsers.map((user) => (
          <li key={user.patientId}>
            {user.name} - {user.isVerified ? 'Verified' : 'Not Verified'}
            {!user.isVerified && (
              <button onClick={() => handleVerifyUser(user.patientId)} className="green-button">
                Verify User
              </button>
            )}
          </li>
        ))}
      </ul>
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default UnverifiedUserList;
