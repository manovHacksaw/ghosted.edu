"use client";

import { createContext, useContext, useState, useCallback } from "react";

const OpenCampusAuthContext = createContext();

export function OpenCampusAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ocId, setOcId] = useState(null);
  const [userWallet, setUserWallet] = useState(null);

  // Login function
  const login = useCallback((id, wallet) => {
    setIsAuthenticated(true);
    setOcId(id);
    setUserWallet(wallet);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setOcId(null);
    setUserWallet(null);
  }, []);

  const value = {
    isAuthenticated,
    ocId,
    userWallet,
    login,
    logout,
  };

  return (
    <OpenCampusAuthContext.Provider value={value}>
      {children}
    </OpenCampusAuthContext.Provider>
  );
}

export const useOpenCampusAuth = () => {
  const context = useContext(OpenCampusAuthContext);
  if (!context) {
    throw new Error(
      "useOpenCampusAuth must be used within a OpenCampusAuthProvider"
    );
  }
  return context;
};