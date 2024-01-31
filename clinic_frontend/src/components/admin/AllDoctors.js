// AllDoctors.js
import React, { useEffect, useState } from 'react';
import { adminApi, setAuthToken } from '../../api'; // Update the path
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken();

    adminApi.getAllDoctors()
      .then(response => {
        setDoctors(response.data.doctorUsers);
        console.log('API Response:', response.data.doctorUsers);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleCreateSchedule = (doctorId) => {
    console.log('Doctor ID:', doctorId);
    navigate('/create-doctor-schedule', { state: { doctorId } });
  };
  const handleShowSchedule = (doctorId) => {
    navigate('/show-doctor-schedule', { state: { doctorId } });
  };
  return (
    <div>
      <h2>Doctors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.doctorId}>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>
                <button onClick={() => handleCreateSchedule(doctor.doctorId)}className="orange-button">
                  Create Schedule
                </button>
                <button onClick={() => handleShowSchedule(doctor.doctorId)} className="blue-button">
                  Show Schedule
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AllDoctors;
