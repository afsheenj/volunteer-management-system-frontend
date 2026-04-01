import api from "./api";

export const getAllRequests = async (
    page=0,
    size=10
)=>{
    const res = await api.get(`/public/requests`,{
        params:{page,size}
    });


    return res;
}

export const getRequestById = async (id) => {
  const res = await api.get(`/public/requests/id/${id}`);
  return res;
};

export const aiSearchRequests = (params) => {
  return api.get("/public/requests/ai-search", {
    params
  });
};

// export const getOrganizationMembers = async (
//   orgId,
//   page = 0,
//   size = 5,
//   search = "",
//   sortBy = "createdAt",
//   order = "asc"
// ) => {
//   const res = await api.get(`/organizations/${orgId}/members`, {
//     params: { page, size, search, sortBy, order },
//   });

//   return res.data; 

// };