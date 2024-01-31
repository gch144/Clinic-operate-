// SearchDoctor.js
import React, { useState } from "react";
import { patientAPi, setAuthToken } from "../../api";
import { toast } from "react-toastify";
import { useNavigate,useLocation } from "react-router-dom";
const specialties = [
  { value: 0, label: "None" },
  { value: 1, label: "Home" },
  { value: 2, label: "ENT" },
  { value: 3, label: "Dermatologist" },
  { value: 4, label: "Ophtalmologist" },
  { value: 5, label: "Neurologist" },
  { value: 6, label: "Orthopedist" },
  { value: 7, label: "Pediatrician" },
];

const SearchDoctor = () => {
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  setAuthToken();

  const handleSearch = async () => {
    try {
      // Fetch doctors by specialty
      const response = await patientAPi.searchDoctor(specialty);
      setDoctors(response.data.doctorUsers);
      console.log("Doctors:", response.data);

      if (response.data.doctorUsers.length === 0) {
        toast.info("No doctors found for the specified specialty.");
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
      toast.error("Error searching doctors. Please try again.");
    }
  };
  const handleCheckAvailability = (doctorId) => {
    navigate("/DoctorAvailability", { state: { doctorId } });
  };
  return (
    <div>
      <h2>Search Doctors by Specialty</h2>
      <label>Specialty:</label>
      <select
        value={specialty}
        onChange={(e) => setSpecialty(parseInt(e.target.value, 10))}
      >
        {specialties.map((spec) => (
          <option key={spec.value} value={spec.value}>
            {spec.label}
          </option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>

      {doctors.length > 0 && (
        <div>
          <h3>Doctors</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>
                    <button
                      onClick={() => handleCheckAvailability(doctor.doctorId)} className="green-button"
                    >
                      Check Availability
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default SearchDoctor;
