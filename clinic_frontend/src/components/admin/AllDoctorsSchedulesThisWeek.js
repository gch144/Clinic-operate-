import React, { useState, useEffect } from "react";
import { adminApi, setAuthToken } from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorSchedulesAccordion = ({ doctor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      {/* <button onClick={toggleExpansion}>
        {isExpanded ? "-" : "+"}
      </button> */}
      <h3 onClick={toggleExpansion}>
        {doctor.doctorName}
        <button onClick={toggleExpansion}className="orange-button">
        {isExpanded ? "-" : "+"}
      </button>
      </h3>
      {isExpanded && (
        <div>
          {Array.isArray(doctor.allDoctorSchedules) && doctor.allDoctorSchedules.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {doctor.allDoctorSchedules.map((schedule) => (
                  <tr key={schedule.seduleId}>
                    <td>{schedule.doc_DateOnly}</td>
                    <td>{schedule.dateOfWeek}</td>
                    <td>{`${schedule.startTime_TimeOnly} - ${schedule.endTime_TimeOnly}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No schedules available for this week.</p>
          )}
        </div>
      )}
    </div>
  );
};

const AllDoctorsSchedulesThisWeek = () => {
  const [allDoctorsSchedulesThisWeek, setAllDoctorsSchedulesThisWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewSchedules = async () => {
    setAuthToken();
    setIsLoading(true);

    try {
     
      const response = await adminApi.getAllDoctorsSchedulesThisWeek();
      setAllDoctorsSchedulesThisWeek(response.data.doctorsSchedulesThisWeek);
    } catch (error) {
      console.error("Error fetching all doctors' schedules for this week:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyCurrentWeekSchedules = async () => {
    setAuthToken();

    try {
     
      await adminApi.copyCurrentWeekSchedules();
      
      handleViewSchedules();
      toast.success("Current week schedules copied successfully.");
    } catch (error) {
      console.error("Error copying current week schedules:", error);
    }
  };

  useEffect(() => {
   
    handleViewSchedules();
  }, []);

  return (
    <div>
      <h2>All Doctors' Schedules This Week</h2>
      <button onClick={handleViewSchedules} disabled={isLoading} className="blue-button">
        {isLoading ? "Loading..." : "View Schedules"}
      </button>
      
      <button onClick={handleCopyCurrentWeekSchedules} className="green-button">
        Copy Current Week Schedules
      </button>

      {Array.isArray(allDoctorsSchedulesThisWeek) && allDoctorsSchedulesThisWeek.length > 0 ? (
        allDoctorsSchedulesThisWeek.map((doctor) => (
          <DoctorSchedulesAccordion key={doctor.doctorId} doctor={doctor} />
        ))
      ) : (
        <p>No doctors with schedules available for this week.</p>
      )}
    </div>
  );
};

export default AllDoctorsSchedulesThisWeek;
