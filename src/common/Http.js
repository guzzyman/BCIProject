import axios from "axios";

export const baseHttp = axios.create({
  baseURL: process.env.REACT_APP_BNPL_API_BASE_URL,
});
