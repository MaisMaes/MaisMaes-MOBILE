import axios from "axios";
import TokenService from "./service/TokenService";

const BASE_URL = "http://192.168.1.100:8080/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await TokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Requisição:", config.method?.toUpperCase(), config.url);
  return config;
});

export default api;
