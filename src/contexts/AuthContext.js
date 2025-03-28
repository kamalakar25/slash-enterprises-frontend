import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  // Logout function
  const logout = () => {
    // Perform client-side cleanup even if server request fails
    try {
      axios.post(`${API_URL}/auth/logout`).catch((error) => {
        console.warn("Logout request failed, proceeding with client-side cleanup:", error);
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth check failed:", error.response?.status);
      if (error.response?.status === 401) {
        logout(); // Logout on unauthorized error
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, signup }}>
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