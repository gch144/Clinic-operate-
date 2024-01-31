import { adminApi, setAuthToken } from '../../api'; // Update the path
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// import {
//   MDBBtn,
//   MDBContainer,
//   MDBCard,
//   MDBCardBody,
//   MDBInput,
//   MDBCheckbox
// } from 'mdb-react-ui-kit';
const specialties = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Home' },
  { value: 2, label: 'ENT' },
  { value: 3, label: 'Dermatologist' },
  { value: 4, label: 'Ophtalmologist' },
  { value: 5, label: 'Neurologist' },
  { value: 6, label: 'Orthopedist' },
  { value: 7, label: 'Pediatrician' },
];

const DoctorRegistration = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [specialty, setSpecialty] = useState(0);
  const isEmailValid = (email) => {
    // Regular expression for a basic email validation
    const emailRegex = /^.*@doc\.com$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Regular expression for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$/;
    return passwordRegex.test(password);
  };
  const handleDoctorRegistration = async () => {
    if (!name || !username || !email || !password || !passwordConfirm) {
        toast.warning('All fields are required.');
        return;
      }
    
      if (!isEmailValid(email)) {
        toast.warning('Enter a valid email address ending with @doc.com');
        return;
      }
    
      if (!isPasswordValid(password)) {
        toast.warning('Password must meet the specified criteria.');
        toast.info('Minimum length 6 and must contain 1 Uppercase, 1 lowercase, 1 special character, and 1 digit');
        return;
      }
    
      if (password !== passwordConfirm) {
        toast.warning('Password and Confirm Password must match.');
        return;
      }
    setAuthToken();

    try {
      // Use the registerDoctor API function to register a doctor
      const response = await adminApi.registerDoctor({
        name,
        username,
        email,
        password,
        passwordConfirm,
        specialty,
      });

      // Handle the response as needed
      toast.success('Doctor registration successful');
      console.log('Doctor registration successful:', response.data);

      // You can reset the form or take any other actions after successful registration
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setSpecialty(0);
    } catch (error) {
        toast.error('Doctor registration failed');
      console.error('Error registering doctor:', error);
      // Handle the error (display an error message, etc.)
    }
  };

  return (
    
    <div>
      <h2>Doctor Registration</h2>
      {/* Doctor Registration Form */}
      <form>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br />

        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />

        <label>Confirm Password:</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <br />

        <label>Specialty:</label>
        <select value={specialty} onChange={(e) => setSpecialty(parseInt(e.target.value, 10))}>
          {specialties.map((spec) => (
            <option key={spec.value} value={spec.value}>
              {spec.label}
            </option>
          ))}
        </select>
        <br />

        {/* Add other fields for doctor registration as needed */}

        <button type="button" onClick={handleDoctorRegistration} className="blue-button" >
          Register Doctor
        </button>
      </form>
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default DoctorRegistration;
