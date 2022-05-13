// import { RtkqTagEnum } from "common/Constants";
import { baseApi } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/Dashboard/GetGeneralStats",
      }),
    }),
    getLoggedInUser: builder.query({
      query: () => ({
        url: "/UserManagement/GetLoggedInUser",
      }),
    }),
  }),
});
