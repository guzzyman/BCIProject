import { RtkqTagEnum } from "common/Constants";
import { baseApi, providesTags } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRating: builder.query({
      query: () => ({
        url: "/EnumHelper/GetRatingsSelectionList",
      }),
    }), 
    addRCA: builder.mutation({
      query:(data)=>({
        url:"/Rca/",
        data,
        method: "post",
      })
    }),    
    getEmployeeByADSearch: builder.query({
      query: ({ ...params }) => ({
        url: `/UserManagement/SearchUsersFromAD`,
        params,
      }),
    }),      
  }),
});
