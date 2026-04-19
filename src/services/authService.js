import { apiClient } from "./apiClient";

export const authService = {
  register: (payload) =>
    apiClient.post("/auth/register", {
      email: payload.email,
      display_name: payload.displayName,
      password: payload.password
    }),
  login: (payload) => apiClient.post("/auth/login", payload),
  logout: () => apiClient.post("/auth/logout", {}),
  me: () => apiClient.get("/auth/me")
};
