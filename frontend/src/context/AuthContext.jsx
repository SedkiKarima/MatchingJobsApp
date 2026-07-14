import { createContext, useContext, useState } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  function persist(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  }

  async function register(fullName, email, password, role) {
    const { data } = await apiClient.post('/auth/register', {
      full_name: fullName,
      email,
      password,
      role,
    });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
