import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8181/api", // adjust as needed
  withCredentials: true,
});

export default api;