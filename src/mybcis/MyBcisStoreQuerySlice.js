import { RtkqTagEnum } from "common/Constants";
import { baseApi, providesTags } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBcis: builder.query({
      query: () => ({
        url: "/BciRegister",
      }),
    }), 
    getRCAs: builder.query({
      query: () => ({
        url: "/Rca",
      }),
    }),   
  }),
});
