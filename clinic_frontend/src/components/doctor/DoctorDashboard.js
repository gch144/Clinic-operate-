
import React from "react";
import { Link } from "react-router-dom";
import {  setAuthToken } from "../../api";

const DoctorDashboard = () => {
  setAuthToken();
  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <p>Welcome to your Doctor dashboard!</p>

      <div>
        <h3>Quick Actions</h3>
        <ul>
          <li>
            <Link to="/Display-doctor-appointment">View Your Appointments</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
