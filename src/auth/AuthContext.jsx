import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearToken, readToken, saveToken } from "./authStorage";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(readToken());
  const [isLoading, setIsLoading] = useState(Boolean(readToken()));

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authService.me();
        if (!isMounted) {
          return;
        }
        setUser(currentUser);
      } catch {
        if (!isMounted) {
          return;
        }
        clearToken();
        setToken("");
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [token]);

  async function register(payload) {
    const result = await authService.register(payload);
    saveToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function login(payload) {
    const result = await authService.login(payload);
    saveToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    try {
      if (token) {
        await authService.logout();
      }
    } finally {
      clearToken();
      setToken("");
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
