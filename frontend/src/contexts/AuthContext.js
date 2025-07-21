import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Adjust path if needed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Handle potential corrupted data in localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
  }, [token]);
  const login = async (email, password, role = null) => {
    // Accept optional role
    try {
      // Create the payload object
      const payload = { email, password };
      // If a role is provided, add it to the payload
      if (role) {
        payload.role = role;
      }

      // Send the payload to the backend
      const response = await api.post("/auth/login", payload);
      const { user, token } = response.data.data;

      // The rest of your function remains the same, as the backend has already
      // verified the role. If the check failed, this code would never be reached.
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error.response?.data || new Error("An unknown error occurred");
    }
  };
  const loginWithProvider = async (provider, data, role = null) => {
    try {
      // Create a payload that includes the original data (the token)
        const payload = { ...data };
        // If a role is passed, add it to the payload to be sent to the backend
        if (role) {
            payload.role = role;
        }
        const response = await api.post(`/auth/${provider}`, payload);
        const { user, token } = response.data.data;

        // Same logic as your regular login
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        navigate('/dashboard');

    } catch (error) {
        console.error(`${provider} login failed:`, error);
        throw error.response?.data || new Error(`An unknown error occurred during ${provider} login.`);
    }
};
  // const login = async (email, password) => {
  //   try {
  //     const response = await api.post('/auth/login', { email, password });
  //     const { user, token } = response.data.data;

  //     localStorage.setItem('authToken', token);
  //     localStorage.setItem('user', JSON.stringify(user));

  //     setToken(token);
  //     setUser(user);

  //     navigate('/dashboard');
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     // Re-throw the error so the form can display it
  //     throw error.response?.data || new Error("An unknown error occurred");
  //   }
  // };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      console.error("Forgot Password request failed:", error);
      throw (
        error.response?.data ||
        new Error("An unknown error occurred while sending the reset link.")
      );
    }
  };

  const updateAuthUser = (newUserData) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...newUserData };
      // Also update localStorage so the change persists after a refresh
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    updateAuthUser,
    forgotPassword,
    loginWithProvider
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
