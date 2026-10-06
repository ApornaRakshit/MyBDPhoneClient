import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

const clearStoredSession = () => {
  localStorage.removeItem('mybdphone_token');
  localStorage.removeItem('mybdphone_user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mybdphone_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mybdphone_token') || null);
  const [loading, setLoading] = useState(true);

  // The database is the source of truth. localStorage is only a fast UI cache.
  const fetchMe = useCallback(async () => {
    const storedToken = localStorage.getItem('mybdphone_token');
    if (!storedToken) {
      setLoading(false);
      return null;
    }

    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setToken(storedToken);
        localStorage.setItem('mybdphone_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
      return null;
    } catch (err) {
      const status = err.response?.status;
      // A suspended/inactive account is rejected by the backend even if the old JWT is valid.
      if (status === 401 || status === 403) {
        clearStoredSession();
        setToken(null);
        setUser(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();

    const onFocus = () => fetchMe();
    window.addEventListener('focus', onFocus);

    // Keeps Admin -> User changes (balance/status/subscription) visible without requiring a full reload.
    const interval = window.setInterval(fetchMe, 30000);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.clearInterval(interval);
    };
  }, [fetchMe]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('mybdphone_token', res.data.token);
      localStorage.setItem('mybdphone_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (
    name,
    email,
    phone,
    password,
    company_name,
    confirm_password
  ) => {
    const res = await API.post('/auth/register', {
      name,
      email,
      phone,
      password,
      confirm_password,
      company_name,
    });

    if (res.data.success) {
      // Registration now requires email verification before login.
      return res.data;
    }

    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => fetchMe();
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
