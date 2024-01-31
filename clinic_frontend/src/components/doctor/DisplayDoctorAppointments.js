import React, { useState, useEffect } from 'react';
import { doctorAPi, setAuthToken } from '../../api';
import { useNavigate} from "react-router-dom";
const DisplayDoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  setAuthToken();

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPi.displayDoctorAppointments();
      setAppointments(response.data.appointments);
      console.log('Doctor Appointments:', response.data.appointments);
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
const handleEDitAppointment = (appointmentId) => {
    navigate('/edit-appointment', { state: { appointmentId } });
  };
  return (
    <div>
      <h2>Your Appointments</h2>
      {appointments?.length > 0 ? (
        <table>
          <thead>
            <tr>
            <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.name}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.startTime}</td>
                <td>
                    {appointment.description}
                </td>
                <td>
                  <button onClick={() => handleEDitAppointment(appointment.appointmentId)} className="red-button">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
};

export default DisplayDoctorAppointments;
