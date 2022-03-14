import axios from "axios";

export const baseHttp = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});