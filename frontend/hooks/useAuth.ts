"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@zhimiry/shared";
import api from "@/lib/api-client";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/auth-utils";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<User>("/api/user/me")
      .then((res) => setUser(res.data))
      .catch(() => clearStoredToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password });
    setStoredToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { data } = await api.post<{ token: string; user: User }>("/api/auth/register", {
      email,
      password,
      name,
    });
    setStoredToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return { user, loading, login, register, logout };
}
