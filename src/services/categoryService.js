import { apiClient } from "./apiClient";

export const categoryService = {
  list: () => apiClient.get("/categories"),
  create: (payload) => apiClient.post("/categories", payload),
  update: (id, payload) => apiClient.put(`/categories/${id}`, payload),
  remove: (id) => apiClient.del(`/categories/${id}`)
};
