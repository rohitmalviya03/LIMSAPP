import axios from "axios";

// Utility to get labcode from sessionStorage
export const getLabcode = () => sessionStorage.getItem("labcode") || "";

const api = axios.create({
  baseURL: "http://216.24.60.0/24/api", // adjust as needed
  withCredentials: true,
});

export default api;