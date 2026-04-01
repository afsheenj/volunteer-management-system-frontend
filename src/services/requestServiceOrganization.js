import api from "./api"; // your axios instance

export const createOrganizationRequest = async (orgId, payload) => {
  const res = await api.post(`/requests/organizations/${orgId}`, payload);
  return res;
};

export const getUserRequests = (userId, page = 0, size = 10) => {
  return api.get(`/requests/users/${userId}?page=${page}&size=${size}`);
};