import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import ChangePassword from "./components/auth/ChangePassword";
import Appheader from "./AppHeader"; // Update the path accordingly
import AdminDashboard from "./components/admin/AdminDashboard";
import DoctorRegistration from "./components/admin/DoctorRegistration";
import { useUser } from "./UserContext";
import UnverifiedUserList from "./components/admin/UnverifiedUserList";
import AllDoctors from "./components/admin/AllDoctors";
import CreateDoctorSchedule from "./components/admin/CreateDoctorSchedule";
import ShowDoctorSchedule from './components/admin/ShowDoctorSchedule';
import EditDoctorSchedule from './components/admin/EditDoctorSchedule';
import AllDoctorsSchedulesThisWeek from './components/admin/AllDoctorsSchedulesThisWeek';
import PatientDashboard from "./components/patient/PatientDashboard";
import SearchDoctor from "./components/patient/SearchDoctor";
import DoctorAvailability from "./components/patient/DoctorAvailability";
import AllSlots from "./components/patient/AllSlots";
import DisplayPatientAppointments from "./components/patient/DisplayPatientAppointments";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import DisplayDoctorAppointments from "./components/doctor/DisplayDoctorAppointments";
import EditAppointment from "./components/doctor/EditAppointment";
const App = () => {
  const { userRole } = useUser();
  return (
    <Router>
      <div className="App">
        {/* <h1>My Clinic App</h1> */}
        <ToastContainer theme="colored" position="top-center"></ToastContainer>
        <Appheader></Appheader>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {userRole === "Admin" && (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route
                path="/doctor-registration"
                element={<DoctorRegistration />}
              />
              <Route
                path="/admin/unverified-users"
                element={<UnverifiedUserList />}
              />
              <Route path="/all-doctors" element={<AllDoctors />} />
              <Route
                path="/create-doctor-schedule"
                element={<CreateDoctorSchedule />}
              />
               <Route path="/show-doctor-schedule" element={<ShowDoctorSchedule />} />
               <Route path="/edit-doctor-schedule" element={<EditDoctorSchedule />} />
               <Route path="/all-doctors-schedules-this-week" element={<AllDoctorsSchedulesThisWeek />} />
              
            </>
          )}
          {userRole === "Patient" && (
            <>
            <Route path="/patient" element={<PatientDashboard/>} />
            <Route path="/patient-search-doctors" element={<SearchDoctor />} />
            <Route path="/DoctorAvailability/" element={<DoctorAvailability />} />
            <Route path="/AllSlots/" element={<AllSlots />} />
            <Route path="/Display-patient-appointment" element={<DisplayPatientAppointments />} />
            </>
          )}
          {userRole === "Doctor" && (
            <>
            <Route path="/doctor" element={<DoctorDashboard/>} />
            <Route path="/Display-doctor-appointment" element={<DisplayDoctorAppointments />} />
            <Route path="/edit-appointment" element={<EditAppointment />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
