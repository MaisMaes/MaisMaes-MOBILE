import axios from "axios";

const BASE_URL = "http://192.168.1.100:8080/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
