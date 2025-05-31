// context/AuthContext.tsx
"use client";
import axiosInstance from "@/axios/instance";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { authlogin, authgoogleLogin, getUserService } from "@/services/auth";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserFromToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserFromToken = async (token) => {
    try {
      const { user } = await getUserService();
      setUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    const { token, user } = await authlogin(payload);
    localStorage.setItem("token", token);
    setUser(user);
    await fetchUserFromToken(token);
  };
  const googleLogin = async (tokenId) => {
    const { token, user } = await authgoogleLogin(tokenId);
    setUser(user);

    localStorage.setItem("token", token);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
