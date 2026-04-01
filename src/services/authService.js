// import api from "./api";
// import { parseToken } from "../utils/jwt";

// export const authService = {
//   async userLogin(username, password) {
//     const res = await api.post("/auth/user/login", { username, password });
//     return handleToken(res.token);
//   },

//   async organizationLogin(username, password) {
//     const res = await api.post("/auth/organization/login", { username, password });
//     return handleToken(res.token);
//   },

//   logout() {
//     localStorage.clear();
//   }
// };

// function handleToken(token) {
//   localStorage.setItem("authToken", token);

//   const payload = parseToken(token);

//   localStorage.setItem("userProfile", JSON.stringify(payload));

//   return payload;
// }










import api from "./api";
import { parseToken } from "../utils/jwt";

export const authService = {
  async userLogin(username, password) {
    const res = await api.post("/auth/user/login", { username, password });
    return handleToken(res.token);
  },

  async organizationLogin(username, password) {
    const res = await api.post("/auth/organization/login", { username, password });
    return handleToken(res.token);
  },

  logout() {
    localStorage.clear();
  }
};

function handleToken(token) {
  localStorage.setItem("authToken", token);
  // localStorage.setItem("token", token);

  const payload = parseToken(token);

  localStorage.setItem("userProfile", JSON.stringify(payload));

  return payload;
}
