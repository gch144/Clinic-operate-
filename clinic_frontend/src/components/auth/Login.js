// Login.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const Login = () => {
    const navigate = useNavigate();
    const { updateUserRole } = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isPasswordValid = (password) => {
    
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$/;
        return passwordRegex.test(password);
    };

    const isUsernameValid = (username) => {
       
        return username.trim() !== ''; // Example: Ensure username is not empty
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            if (!isUsernameValid(username)) {
                toast.error('Please enter a valid username.');
                return;
            }
    
            if (!isPasswordValid(password)) {
                toast.error('Please enter a valid password.');
                return;
            }
    
            const credentials = { username, password };
            const response = await authApi.login(credentials);
    
            // Check if the necessary properties exist in the response
            if (!response.data || !response.data.loginInfo) {
                const error = response.data;
                toast.error(error ? error.message : 'Login failed. Please try again.');
                return;
            }
    
            const { token, user } = response.data.loginInfo;
    
            // Check if the user is verified
            if (user && user.isVerified === false) {
                toast.error('User is not verified.');
                return;
            }
    
            // Check if the necessary properties exist in the user object
            const userRole = user?.userRole;
            const name = user?.name;
            const userId = user?.userId;
    
            if (!token || !userRole || !name) {
                toast.error('Invalid response format. Please try again.');
                return;
            }
    
            // Update user role in the context
            updateUserRole(userRole);
    
            // Store the token and user role in localStorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('UserRole', userRole);
            localStorage.setItem('name', name);
            localStorage.setItem('userId',userId);
            console.log('User Id:', userId);
    
            toast.success('Login successful.');
            console.log('User Role:', userRole);
            console.log('Login successful:', response);
            navigate('/');
            // Handle successful login (e.g., redirect to dashboard)
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please try again.');
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="button" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
};

export default Login;
