import axios from "axios";
import { APP_CONFIG } from "../config/config";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
 
  }
);

export default api;




