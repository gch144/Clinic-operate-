import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox
  } from 'mdb-react-ui-kit';
import { authApi } from '../../api';
import '../../index.css';

const Registration = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const isEmailValid = (email) => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Regular expression for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    try {
      // Validation checks
      if (!name || !username || !email || !password || !passwordConfirm) {
        toast.warning('All fields are required.');
        return;
      }

      if (!isEmailValid(email)) {
        toast.warning('Enter a valid email address.');
        return;
      }

      if (!isPasswordValid(password)) {
        toast.warning('Password must meet the specified criteria.');
        toast.info('Minimum length 6 and must contain  1 Uppercase,1 lowercase, 1 special character and 1 digit');
        return;
      }

      if (password !== passwordConfirm) {
        toast.warning('Password and Confirm Password must match.');
        return;
      }

      const registrationData = {
        name,
        username,
        email,
        password,
        passwordConfirm
      };

      const result = await authApi.register(registrationData);
      toast.success('Registration successful.');
      toast.warn('Wait for admin approval');
      console.log('Registration successful:', result);
      // Handle successful registration (e.g., show success message, redirect)
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., display error message)
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image gradient-custom-3'>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">User Registration</h2>
          <MDBInput wrapperClass='mb-4' label='Your Name' size='lg' id='form1' type='text' value={name} onChange={(e) => setName(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Usernmae' size='lg' id='form1' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Your Email' size='lg' id='form2' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Repeat your password' size='lg' id='form4' type='password' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          <div className='d-flex flex-row justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in Terms of service' />
          </div>
          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleRegister}>Register</MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};
export default Registration;
