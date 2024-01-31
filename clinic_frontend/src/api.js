// src/utils/api.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5178/api'; // Replace with your actual backend API URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
   
  },
});

// Authentication API functions
const authApi = {
  login: (credentials) => api.post('/authentication/login', credentials),
  register: (userData) => api.post('/authentication/register', userData),
  changePassword: (passwordData) => api.post('/authentication/changepassword', passwordData),

};
const adminApi = {
  getData: () => api.get('/Admin/GetData'),
  registerDoctor: (doctorData) => api.post('/Admin/registerDOC', doctorData),
  getUnverifiedUsers: () => api.get('/Admin/GetUnverifiedUsers'),
  verifyUser: (userId) => api.post(`/Admin/VerifyUser/${userId}`),
  getAllDoctors : () => api.get('/Admin/ListAllDoctors'),
  createDoctorSchedule: (scheduleData) => api.post(`/Admin/Createdoctorschedules`, scheduleData),
  getDoctorSchedules: (doctorId) => api.get(`/Admin/GetDoctorSchedules/${doctorId}`),
  editDoctorSchedule: (scheduleData) => api.put(`/Admin/EditDoctorschedules`, scheduleData),
  deleteDoctorSchedule: (scheduleId, doctorId) =>
  api.delete(`/Admin/DeleteDoctorschedules/${scheduleId}/${doctorId}`),
  getAllDoctorsSchedulesThisWeek: () => api.get('/Admin/GetAllDoctorsSchedulesThisWeek'),
  copyCurrentWeekSchedules: () => api.post('/Admin/CopyCurrentWeekSchedules'),
};
const patientAPi={
  
    searchDoctor: (doctorSpecialty) => api.get('/Appointment/SearchDoctorsBySpecialty', { params: { doctorSpecialty } }),
    displayDoctorAvailability: (doctorId) => api.get(`/Appointment/DisplayDoctorAvailability`, { params: { doctorId } }),
    dispalayAvailableSlots: (doctorId, doctordate) => api.get(`/Appointment/DisplayAvailableTimeSlots`, { params: { doctorId, doctordate } }),
    bookAppointment: (appointmentData) => api.post('/Appointment/BookAppointment', appointmentData),
    diaplayPatientAppointments: () => api.get('/Appointment/DisplayPatientAppointments'),
    cancelAppointment: (appointmentId) => api.delete(`/Appointment/CancelAppointment/${appointmentId}`),
};
const doctorAPi={
  displayDoctorAppointments: () => api.get('/Appointment/DisplayDoctorAppointments'),
  checkAppointment: (updateAppointment) =>
  api.put('/Appointment/CheckAppointment', updateAppointment ),
};

const setAuthToken = () => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
export { authApi,adminApi,patientAPi,doctorAPi,setAuthToken
 };
