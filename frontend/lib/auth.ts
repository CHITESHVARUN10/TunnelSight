import { api } from "./api";

export type User = { id: string; email: string; created_at: string };

export const register = (email: string, password: string) =>
  api("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });

export const login = (email: string, password: string) =>
  api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const logout = () => api("/api/auth/logout", { method: "POST" });

export const me = (): Promise<User> => api("/api/me");
