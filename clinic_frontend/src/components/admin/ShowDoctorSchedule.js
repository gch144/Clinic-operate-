// ShowDoctorSchedule.js
import React, { useState, useEffect } from "react";
import { adminApi, setAuthToken } from "../../api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ShowDoctorSchedule = () => {
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const location = useLocation();
  const { doctorId } = location.state;
  const navigate = useNavigate();
  const handleEditSchedule = (scheduleId) => {
    navigate("/edit-doctor-schedule", { state: { doctorId, scheduleId } });
  };
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await adminApi.deleteDoctorSchedule(
        scheduleId,
        doctorId
      );
    toast.success("Doctor schedule deleted successfully.");
      console.log("Schedule deleted successfully:", response.data);
      navigate('/all-doctors');
      
    } catch (error) {
      console.error("Error deleting doctor schedule:", error);
    }
  };
  useEffect(() => {
    setAuthToken();

    adminApi
      .getDoctorSchedules(doctorId)
      .then((response) => {
        setDoctorSchedules(response.data.showDoctorSceduleDTO); // Assuming the array is inside data property
      })
      .catch((error) => {
        console.error("Error fetching doctor schedules:", error);
      });
  }, [doctorId]);


  return (
    <div>
      <h2>Doctor Schedule</h2>
      {Array.isArray(doctorSchedules) && doctorSchedules.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctorSchedules.map((schedule) => (
              <tr key={schedule.seduleId}>
                <td>{schedule.doc_DateOnly}</td>
                <td>{schedule.dateOfWeek}</td>
                <td>{`${schedule.startTime_TimeOnly} - ${schedule.endTime_TimeOnly}`}</td>
                <td>
                  <button onClick={() => handleEditSchedule(schedule.seduleId)}className="orange-button">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.seduleId)}
                    className="red-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedules available.</p>
      )}
    </div>
  );
};

export default ShowDoctorSchedule;
