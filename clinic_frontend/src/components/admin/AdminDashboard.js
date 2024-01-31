import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi, setAuthToken } from '../../api';
import { MDBBtn } from 'mdb-react-ui-kit';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleOpenDoctorRegistration = () => {
    navigate('/doctor-registration');
  };

  const handleOpenUnverifiedUserList = () => {
    navigate('/admin/unverified-users');
  };

  const handleOpenAllDoctors = () => {
    navigate('/all-doctors');
  };

  useEffect(() => {
    setAuthToken();

    // Example: Fetch admin data
    adminApi
      .getData()
      .then((response) => {
        console.log('Admin data:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching admin data:', error);
      });
  }, []);

  const buttonStyle = {
    fontSize: '20px', 
    padding: '20px 40px', 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #4CAF50, #2196F3)', 
    color: '#ffffff', 
    border: 'none', 
    boxShadow: '0 0px 6px rgba(0, 0, 0, 0.1)', 
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <MDBBtn style={buttonStyle} onClick={handleOpenDoctorRegistration}>
          Doctor Registration
        </MDBBtn>
      </div>
      <div>
        <MDBBtn style={buttonStyle} onClick={handleOpenUnverifiedUserList}>
          Unverified Users
        </MDBBtn>
      </div>
      <div>
        <MDBBtn style={buttonStyle} onClick={handleOpenAllDoctors}>
          All Doctors
        </MDBBtn>
      </div>
      <Link to="/all-doctors-schedules-this-week">
        <MDBBtn style={buttonStyle}>This Week Schedules</MDBBtn>
      </Link>
    </div>
  );
};

export default AdminDashboard;
