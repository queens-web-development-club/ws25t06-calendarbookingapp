import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simple QWEB password authentication
  const login = async (password) => {
    setLoading(true);
    try {
      // For demo purposes, using a simple password check
      // In production, this should be a secure API call
      if (password === 'qweb2024' || password === 'QWEB2024') {
        const user = {
          id: 'qweb-member',
          displayName: 'QWEB Member',
          email: 'member@qweb.ca',
          role: 'member',
          isActive: true
        };
        setUser(user);
        // Store in localStorage for persistence
        localStorage.setItem('qweb-user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid QWEB password');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qweb-user');
  };

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('qweb-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
