import axios from "axios";

const protocol = window.location.protocol;
const host = window.location.host;

const api = axios.create({
  baseURL: `${protocol}//${host}/api/v1`,
  withCredentials: true,
});

export default api;
