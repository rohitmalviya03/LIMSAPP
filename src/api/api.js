import axios from "axios";

// Utility to get labcode from sessionStorage
export const getLabcode = () => sessionStorage.getItem("labcode") || "";

const api = axios.create({
  baseURL: "http://localhost:8181/api", // adjust as needed
  withCredentials: true,
});

export default api;