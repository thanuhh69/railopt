import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('railopt_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-admin-01',
      name: 'Chief Planning Engineer (Admin)',
      email: 'admin@railopt.demo',
      role: 'admin',
      department: 'Operations Planning & Safety'
    };
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('railopt_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('railopt_user');
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
