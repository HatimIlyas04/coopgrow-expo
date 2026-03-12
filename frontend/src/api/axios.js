import axios from "axios";

const api = axios.create({
  baseURL: "https://coopgrow-expo.onrender.com/api",
});

export default api;