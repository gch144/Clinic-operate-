import React, { useState, useEffect } from 'react';
import { patientAPi, setAuthToken } from '../../api';
import { toast } from 'react-toastify';

const DisplayPatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  setAuthToken();

  useEffect(() => {
    const fetchPatientAppointments = async () => {
      try {
        const response = await patientAPi.diaplayPatientAppointments();
        if (response.data.statusCode === 1) {
          setAppointments(response.data.appointments);
          console.log('Patient Appointments:', response.data.appointments);
        } else {
          console.log('No appointments found for the patient.');
        }
      } catch (error) {
        console.error('Error fetching patient appointments:', error);
      }
    };

    fetchPatientAppointments();
  }, []);
  const handleDeleteAppointment = async (appointmentId) => {
    try {

      const response = await patientAPi.cancelAppointment(appointmentId);
      if (response.data.statusCode === 1) {
       
        toast.success('Appointment canceled successfully.');
       
        const updatedAppointments = appointments.filter((appointment) => appointment.appointmentId !== appointmentId);
        setAppointments(updatedAppointments);
      } else {
        toast.error('Error canceling appointment.');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      {appointments && appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Day of the Week</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.name}</td>
                <td>{(appointment.appointmentDate)}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                <td>{appointment.startTime}</td>
                <td>{appointment.endTime}</td>
                <td>{appointment.description}</td>
                <td>
                  <button onClick={() => handleDeleteAppointment(appointment.appointmentId)}className="red-button">
                    Cancel Appointment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default DisplayPatientAppointments;
