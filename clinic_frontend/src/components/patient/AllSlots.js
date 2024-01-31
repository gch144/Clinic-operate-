import React, { useState, useEffect } from 'react';
import { patientAPi, setAuthToken } from '../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllSlots = () => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorId, doctordate } = location.state;

  setAuthToken();

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await patientAPi.dispalayAvailableSlots(doctorId, doctordate);
        setAvailableTimeSlots(response.data.availableTimeSlots);
        console.log('Available Time Slots:', response.data);
      } catch (error) {
        console.error('Error fetching available time slots:', error);
      }
    };

    fetchAvailableTimeSlots();
  }, [doctorId, doctordate]);

  const handleBookSlot = async (appointmentDate, startTime) => {
    try {
      const response = await patientAPi.bookAppointment({
        doctorId: doctorId,
        appointmentDate: appointmentDate,
        startTime_TimeOnly: startTime
      });

      console.log('Appointment booked successfully:', response.data);
      if (response.data.statusCode === 1) {
        toast.success('Appointment booked successfully.');
        // Redirect to "/Display-patient-appointment" after successful booking
        navigate('/Display-patient-appointment');
      } else {
        toast.error('Appointment slot is not available.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Error booking appointment. Please try again.');
    }
  };

  return (
    <div>
      <h2>Available Time Slots</h2>
      {availableTimeSlots.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableTimeSlots.map((slot, index) => (
              <tr key={index}>
                <td>{slot.appointmentDate}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>
                  <button onClick={() => handleBookSlot(slot.appointmentDate, slot.startTime)}className="green-button">
                    Book Slot
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No available time slots.</p>
      )}
    </div>
  );
};

export default AllSlots;
