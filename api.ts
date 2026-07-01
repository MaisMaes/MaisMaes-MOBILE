import axios from "axios";
import TokenService from "./service/TokenService";

const BASE_URL = "https://maismaes-api-hda7beaud2frbvfz.canadacentral-01.azurewebsites.net/";

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
  console.log("Requisição:", config.method?.toUpperCase(), BASE_URL + config.url);
  return config;
});

export default api;
