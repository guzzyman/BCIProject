// import { RtkqTagEnum } from "common/Constants";
import { baseApi } from "common/StoreQuerySlice";
// import { baseLoginApi } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/Dashboard/GetGeneralStats",
      }),
    }),
    getAuthenticatedLoggedInUser: builder.query({
      query: (loggedInUser) => ({
        url: `/UserManagement/GetAuthenticatedLoggedInUser/${loggedInUser}`,
      }),
    }),
    getLoggedInUser: builder.query({
      query: () => ({
        url: "",
      }),
    }),
  }),
});
