import { RtkqTagEnum } from "common/Constants";
import { baseApi, providesTags } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentType: builder.query({
      query: () => ({
        url: "/BreachType",
      }),
    }), 
    getIncidentCategory: builder.query({
      query: () => ({
        url: "/IncidentCategory",
      }),
    }),
    getCategoryRanking: builder.query({
      query: () => ({
        url: "/CategoryRanking",
      }),
    }),   
    getImpact: builder.query({
      query: () => ({
        url: "/Impact",
      }),
    }),  
    addBCI: builder.mutation({
      query:(data)=>({
        url:"/BciRegister/",
        data,
        method: "post",
      })
    }),    
  }),
});
