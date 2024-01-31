// DoctorAvailability.js
import React, { useState, useEffect } from 'react';
import { patientAPi, setAuthToken } from '../../api';
import { useLocation,useNavigate } from 'react-router-dom';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const location = useLocation(); // Use useLocation hook
  const navigate = useNavigate();
  const { doctorId } = location.state;

  //console.log('Doctor Id:', doctorId);
  //const { doctorId}= use

  setAuthToken();
  const handleCheckSlots = (doctordate) => {
    console.log('DoctorAllSlote Id:', doctorId);
    console.log('DoctorAllSlote Date:', doctordate);
    navigate('/AllSlots/', { state: { doctorId, doctordate } });
    // console.log('DoctorAllSlote Id:', doctorId);
    // console.log('DoctorAllSlote Date:', selectedDate);
  };
  useEffect(() => {
    const fetchAvailability = async () => {
      try {

        const response = await patientAPi.displayDoctorAvailability(doctorId);
        setAvailability(response.data.showDoctorSceduleDTO); 
        console.log('Availability:', response.data);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  return (
    <div>
      <h2>Doctor Availability</h2>
      {availability.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((slot) => (
              <tr key={slot.seduleId}>
                <td>{slot.doc_DateOnly}</td>
                <td>{slot.dateOfWeek}</td>
                <td>
                  <button onClick={() => handleCheckSlots(slot.doc_DateOnly)} className="orange-button">
                    Check Slots
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No availability information available.</p>
      )}
    </div>
  );
};

export default DoctorAvailability;
