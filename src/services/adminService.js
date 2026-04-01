import api from "./api";
export const getDashboardData = ()=>{
    const res = api.get(`/admin/dashboard`);
    return res;
}