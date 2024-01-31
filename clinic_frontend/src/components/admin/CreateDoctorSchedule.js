import React, { useState } from 'react';
import { adminApi, setAuthToken } from '../../api';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom'; 

const CreateDoctorSchedule = () => {
  const [scheduleData, setScheduleData] = useState({
    DoctorId: '',
    Date_DateOnly: '',
    StartTime_TimeOnly: '',
    EndTime_TimeOnly: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = location.state;
  scheduleData.DoctorId = doctorId;

  const handleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthToken();

    if (!scheduleData.Date_DateOnly || !scheduleData.StartTime_TimeOnly || !scheduleData.EndTime_TimeOnly) {
      alert('All fields are required.');
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(scheduleData.Date_DateOnly + 'T' + scheduleData.StartTime_TimeOnly);

    if (selectedDate < currentDate) {
      alert('Please select a date and time in the future.');
      return;
    }

    if (scheduleData.StartTime_TimeOnly >= scheduleData.EndTime_TimeOnly) {
      alert('End time must be after start time.');
      return;
    }

    try {
      const response = await adminApi.createDoctorSchedule(scheduleData);
      toast.success('Doctor schedule created successfully.');
      console.log('API Response:', response.data);
      
      // Redirect to "/all-doctors" after successful schedule creation
      navigate('/all-doctors');
    } catch (error) {
      console.error('Error creating doctor schedule:', error);

      if (error.response) {
        console.log('Server Response:', error.response.data);
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error('Error: No response from the server.');
      } else {
        toast.error(`Error: ${error.response.data}`);
      }
    }
  };

  return (
    <div>
      <h2>Create Doctor Schedule</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields for date, start time, and end time */}
        <label>Date:</label>
        <input
          type="date"
          name="Date_DateOnly"
          value={scheduleData.Date_DateOnly}
          onChange={handleChange}
        />
        <br />

        <label>Start Time:</label>
        <input
          type="time"
          name="StartTime_TimeOnly"
          value={scheduleData.StartTime_TimeOnly}
          onChange={handleChange}
        />
        <br />

        <label>End Time:</label>
        <input
          type="time"
          name="EndTime_TimeOnly"
          value={scheduleData.EndTime_TimeOnly}
          onChange={handleChange}
        />
        <br />

        <button type="submit" className="blue-button">Create Schedule </button>
      </form>
    </div>
  );
};

export default CreateDoctorSchedule;
