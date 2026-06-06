import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/services";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem("auth_token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password, passwordConfirm) => {
    const response = await authService.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirm,
    });
    const { token: authToken, user: userData } = response.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("auth_token", authToken);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token: authToken, user: userData } = response.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("auth_token", authToken);
    return response.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("auth_token");
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
