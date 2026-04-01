import api from "./api";

export const getOrganizationProfile = (orgId) =>
  api.get(`/organizations/profile/${orgId}`);

export const updateOrganizationProfile = (orgId, data) =>
  api.put(`/organizations/profile/${orgId}`, data);

export const getOrganizationAddress = (orgId) =>
  api.get(`/organizations/address/${orgId}`);

export const registerOrganizationAddress = (data) =>
  api.post(`/organizations/address/register`, data);

export const updateOrganizationAddress = (data) =>
  api.put(`/organizations/address/update`, data);

export const addOrganizationMembers =(orgId,data) =>
  api.post(`/organizations/${orgId}/members`,data);

// export const getOrganizationMembers = (orgId) =>
//   api.get(`/organizations/profile/${orgId}/members`);

export const getOrganizationMembers = async (
  orgId,
  page = 0,
  size = 5,
  search = "",
  sortBy = "createdAt",
  order = "asc"
) => {
  const res = await api.get(`/organizations/${orgId}/members`, {
    params: { page, size, search, sortBy, order },
  });

  return res.data; 

};

export const updateOrganizationMember = (memberId, data) =>
  api.put(`/organizations/members/${memberId}`, data);

export const deleteOrganizationMember = (memberId) =>
  api.delete(`/organizations/members/${memberId}`);