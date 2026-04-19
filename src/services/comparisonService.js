import { apiClient } from "./apiClient";

export const comparisonService = {
  list: () => apiClient.get("/comparisons"),
  create: (payload) => apiClient.post("/comparisons", payload)
};
