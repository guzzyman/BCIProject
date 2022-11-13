import store from "common/Store";
import { logoutAction } from "common/StoreActions";
import { baseHttp } from "./Http";

baseHttp.interceptors.request.use((config) => {
  const { base64EncodedAuthenticationKey } =
    store.getState().global.authUser || {};

  if (base64EncodedAuthenticationKey) {
    config.headers.Authorization = `Basic ${base64EncodedAuthenticationKey}`;
  }

  return config;
});

baseHttp.interceptors.response.use(undefined, (error) => {
  if (error?.response?.status === 401) {
    store.dispatch(logoutAction());
  }
  return Promise.reject(error);
});
