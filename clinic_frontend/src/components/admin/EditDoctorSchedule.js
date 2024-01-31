
import React, { useState, useEffect } from 'react';
import { adminApi, setAuthToken } from '../../api';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { toast } from 'react-toastify';

const EditDoctorSchedule = () => {
  const [scheduleData, setScheduleData] = useState({
    seduleId: '',
    doctorId: '',
    date_DateOnly: '',
    startTime_TimeOnly: '',
    endTime_TimeOnly: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId, scheduleId } = location.state;
  scheduleData.seduleId = scheduleId;
    scheduleData.doctorId = doctorId;

  
  const handleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthToken();
    if(!scheduleData.date_DateOnly || !scheduleData.startTime_TimeOnly || !scheduleData.endTime_TimeOnly){
        alert('All fields are required.');
        return;
        }
        const currentDate = new Date();
        const selectedDate = new Date(scheduleData.date_DateOnly + 'T' + scheduleData.startTime_TimeOnly);
        if(selectedDate < currentDate){
            alert('Please select a date and time in the future.');
            return;
        }
        if(scheduleData.startTime_TimeOnly >= scheduleData.endTime_TimeOnly){
            alert('End time must be after start time.');
            return;
        }


    try {
      const response = await adminApi.editDoctorSchedule(scheduleData);
     
      toast.success('Doctor schedule updated successfully.');
      console.log('API Response:', response.data);
      navigate('/all-doctors');
    
    } catch (error) {
     
      console.error('Error updating doctor schedule:', error);

      if (error.response) {
      
        console.log('Server Response:', error.response.data);
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        
        toast.error('Error: No response from the server.');
      } else {
       
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Edit Doctor Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          name="date_DateOnly"
          value={scheduleData.date_DateOnly}
          onChange={handleChange}
        />
        <br />

        <label>Start Time:</label>
        <input
          type="time"
          name="startTime_TimeOnly"
          value={scheduleData.startTime_TimeOnly}
          onChange={handleChange}
        />
        <br />

        <label>End Time:</label>
        <input
          type="time"
          name="endTime_TimeOnly"
          value={scheduleData.endTime_TimeOnly}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Update Schedule className="blue-button"</button>
      </form>
    </div>
  );
};

export default EditDoctorSchedule;
