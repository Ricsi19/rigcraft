import { apiClient } from "./apiClient";

export const configurationService = {
  list: () => apiClient.get("/configurations"),
  create: (payload) => apiClient.post("/configurations", payload),
  update: (id, payload) => apiClient.put(`/configurations/${id}`, payload),
  remove: (id) => apiClient.del(`/configurations/${id}`)
};
