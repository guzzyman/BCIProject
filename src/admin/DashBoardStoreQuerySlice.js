import { RtkqTagEnum, StoreQueryTagEnum } from "common/Constants";
import { baseApi, providesTags } from "common/StoreQuerySlice";

export const bciApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * APIs for BreachType
     * **/

    getIncidentType: builder.query({
      query: () => ({
        url: "/BreachType",
      }),
    }),
    getIncidentTypeById: builder.query({
      query: (id) => ({
        url: `/BreachType/${id}`,
      }),
    }),
    addIncidentType: builder.mutation({
      query: (data) => ({
        url: `/BreachType`,
        data,
        method: "post",
      }),
    }),
    updateIncidentType: builder.mutation({
      query: (data) => ({
        url: `/BreachType/${data.id}`,
        data,
        method: "put",
      }),
    }),
    deleteIncidentType: builder.mutation({
      query: (data) => ({
        url: `/BreachType/${data.id}`,
        data,
        method: "delete",
      }),
    }),

    /**
     * APIs for CategoryRanking
     * **/

    getCategoryRanking: builder.query({
      query: () => ({
        url: "/CategoryRanking",
      }),
    }),
    getCategoryRankingById: builder.query({
      query: (id) => ({
        url: `/CategoryRanking/${id}`,
      }),
    }),
    addCategoryRanking: builder.mutation({
      query: (data) => ({
        url: `/CategoryRanking`,
        data,
        method: "post",
      }),
    }),
    updateCategoryRanking: builder.mutation({
      query: (data) => ({
        url: `/CategoryRanking/${data.id}`,
        data,
        method: "put",
      }),
    }),
    deleteCategoryRanking: builder.mutation({
      query: (data) => ({
        url: `/CategoryRanking/${data.id}`,
        data,
        method: "delete",
      }),
    }),

    /**
     * APIs for Impact
     * **/

    getImpact: builder.query({
      query: () => ({
        url: "/Impact",
      }),
    }),
    addImpact: builder.mutation({
      query: (data) => ({
        url: `/Impact`,
        data,
        method: "post",
      }),
    }),
    updateImpact: builder.mutation({
      query: (data) => ({
        url: `/Impact/${data.id}`,
        data,
        method: "put",
      }),
    }),
    deleteImpact: builder.mutation({
      query: (data) => ({
        url: `/Impact/${data.id}`,
        data,
        method: "delete",
      }),
    }),

    /**
     * APIs for Location
     * **/

    getLocation: builder.query({
      query: () => ({
        url: "/Location",
      }),
    }),
    addLocation: builder.mutation({
      query: (data) => ({
        url: `/Location`,
        data,
        method: "post",
      }),
    }),
    updateLocation: builder.mutation({
      query: (data) => ({
        url: `/Location/${data.id}`,
        data,
        method: "put",
      }),
    }),
    deleteLocation: builder.mutation({
      query: (data) => ({
        url: `/Location/${data.id}`,
        data,
        method: "delete",
      }),
    }),

    /**
     * Other APIs
     * **/

    getIncidentCategory: builder.query({
      query: () => ({
        url: "/IncidentCategory",
      }),
    }),
    getIncidentRanking: builder.query({
      query: () => ({
        url: "/IncidentRanking",
      }),
    }),
    getBCIStatus: builder.query({
      query: () => ({
        url: "/EnumHelper/GetBciStatusList",
      }),
    }),
    getBcis: builder.query({
      query: ({ ...params }) => ({
        url: "/BciRegister",
        params,
      }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.getBcis),
    }),
    getBciByStatus: builder.query({
      query: ({ ...params }) => ({
        url: "/BciRegister/BciByStatus",
        params,
      }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.getBcis),
    }),
    getBciCommentsByBCIId: builder.query({
      query: (id) => ({
        url: `/BciRegister/GetCommentsByBCIId/${id}`,
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.BCI_COMMENT_DETAILS }],
    }),
  }),
});
