import { apiClient } from "./apiClient";

export const statsService = {
  get: () => apiClient.get("/stats")
};
