import axios from "axios";

// Utility to get labcode from sessionStorage
export const getLabcode = () => sessionStorage.getItem("labcode") || "";

const api = axios.create({
  baseURL: "https://lims-backend-2bc1.onrender.com/api", // adjust as needed
  withCredentials: true,
});

export default api;