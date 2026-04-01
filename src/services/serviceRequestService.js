import api from "./api"; // your axios instance

export const createOrganizationRequest = async (orgId, payload) => {
  const res = await api.post(`/requests/organizations/${orgId}`, payload);
  return res.data;
};

export const createUserRequest = async (userId, payload) => {
  try {
    const res = await api.post(`/requests/users/${userId}`, payload);

    console.log("RAW RESPONSE:", res);

    // HANDLE STRING RESPONSE
    if (typeof res === "string") {
      return {
        status: true,
        message: res,
        data: null,
      };
    }

    // HANDLE OBJECT RESPONSE
    return {
      status: res?.status ?? false,
      message: res?.message ?? "Something went wrong",
      data: res?.data ?? null,
    };

  } catch (err) {
    return {
      status: false,
      message: err?.message || "Server error",
      data: null,
    };
  }
};

export const getUserRequests = (userId, page = 0, size = 10) => {
  return api.get(`/requests/users/${userId}?page=${page}&size=${size}`);
};