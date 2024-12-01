import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;  // Método para cerrar sesión
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
