import { apiClient } from "./apiClient";

export const componentService = {
  list: ({ query = "", categoryId = "", sortBy = "price_asc" } = {}) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryId) params.set("category_id", String(categoryId));
    if (sortBy) params.set("sort", sortBy);
    const suffix = params.toString();
    return apiClient.get(`/components${suffix ? `?${suffix}` : ""}`);
  },
  create: (payload) => apiClient.post("/components", payload),
  update: (id, payload) => apiClient.put(`/components/${id}`, payload),
  remove: (id) => apiClient.del(`/components/${id}`)
};
