import React, { useState, useEffect } from 'react';
import { doctorAPi, setAuthToken } from '../../api';
import { useLocation, useNavigate } from 'react-router-dom';

const EditAppointment = () => {
  const [appointment, setAppointment] = useState({
    appointmentId: '',
    description: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  setAuthToken();

  useEffect(() => {
    const { appointmentId } = location.state || {};
    setAppointment((prev) => ({ ...prev, appointmentId }));
  }, [location]);

  const handleSaveChanges = async () => {
    try {
     // console.log('Sending update request:', appointment);
      const updatedAppointment = { ...appointment, appointmentId: appointment.appointmentId.toString() };
      console.log('Sending update request:', updatedAppointment);
      if (!updatedAppointment.appointmentId || !updatedAppointment.description) {
        console.error('AppointmentId and Description are required.');
        return;
      }

      await doctorAPi.checkAppointment(updatedAppointment);
      console.log('Appointment updated successfully.');

      navigate('/Display-doctor-appointment');
    } catch (error) {
      console.error('Error updating appointment:', error);

      if (error.response) {
        console.error('Server responded with:', error.response.data);
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          console.error('Validation errors:', validationErrors);
          
        }
      }
    }
  };

  return (
    <div>
      <h2>Edit Appointment</h2>
      <label>Description:</label>
      <textarea
        value={appointment.description}
        onChange={(e) => setAppointment({ ...appointment, description: e.target.value })}
      />
      <button onClick={handleSaveChanges} className="green-button">
        Save Changes
      </button>
      <button onClick={() => navigate('/Display-doctor-appointment')} className="blue-button">
        Cancel
      </button>
    </div>
  );
};

export default EditAppointment;
