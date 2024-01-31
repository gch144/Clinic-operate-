// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem('UserRole'));

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem('UserRole', role);
  };

  return (
    <UserContext.Provider value={{ userRole, updateUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
