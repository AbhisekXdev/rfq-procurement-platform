import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api, { getErrorMessage } from "../lib/api.js";
import {
  clearSession,
  getStoredUser,
  getToken,
  setSession,
} from "../lib/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getToken);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
        ...(role ? { role } : {}),
      });
      setSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyRegistration = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/verify-otp", {
        email,
        otp,
      });
      setSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const resendRegistrationOtp = useCallback(async (email) => {
    const { data } = await api.post("/auth/register/resend-otp", { email });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      verifyRegistration,
      resendRegistrationOtp,
      logout,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      verifyRegistration,
      resendRegistrationOtp,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
