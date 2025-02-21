import axios from "axios";

const url = "https://quick-chat-app-server-l0yu.onrender.com";

export const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
