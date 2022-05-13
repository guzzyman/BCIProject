// import { RtkqTagEnum } from "common/Constants";
import { baseApi } from "common/StoreQuerySlice";

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
      query: (data) => ({
        url: "/BciRegister/",
        data,
        method: "post",
      }),
    }),
    updateWorkFlow: builder.mutation({
      query: (data) => ({
        url: "/BciRegister/UpdateBciStatus/" + data.id,
        data,
        method: "put",
      }),
    }),
    updateBCI: builder.mutation({
      query: (data) => ({
        url: `/BciRegister/${data.id}`,
        data,
        method: "put",
      }),
    }),
    getBciById: builder.query({
      query: (id) => ({
        url: `/BciRegister/${id}`,
      }),
    }),
    getLoggedInUser: builder.query({
      query: () => ({
        url: "/UserManagement/GetLoggedInUser",
      }),
    }),
  }),
});
