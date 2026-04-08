import { apiClient } from "./apiClient";

export const comparisonService = {
  list: () => apiClient.get("/comparisons")
};
