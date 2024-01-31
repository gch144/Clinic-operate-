// PatientDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import {  setAuthToken } from "../../api";

const PatientDashboard = () => {
  setAuthToken();
  return (
    <div>
      <h2>Patient Dashboard</h2>
      <p>Welcome to your patient dashboard!</p>

      <div>
        <h3>Quick Actions</h3>
        <ul>
          <li>
            <Link to="/patient-search-doctors">
              Search Doctors by Specialty
            </Link>
          </li>
          <li>
            <Link to="/Display-patient-appointment">View Your Appointments</Link>
          </li>
          {/* Add other quick action links as needed */}
        </ul>
      </div>
    </div>
  );
};

export default PatientDashboard;
