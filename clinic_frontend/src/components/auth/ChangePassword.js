import React, { useState } from 'react';
import { authApi } from '../../api';

const ChangePassword = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleChangePassword = async () => {
    try {
      const passwordChangeData = {
        username,
        currentPassword,
        newPassword,
        passwordConfirm
      };

      const result = await authApi.changePassword(passwordChangeData);
      console.log('Password change successful:', result);
    
    } catch (error) {
      console.error('Password change failed:', error);
    
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label>Current Password:</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <br />
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <br />
        <label>Confirm New Password:</label>
        <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
        <br />
        <button type="button" onClick={handleChangePassword}>Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
