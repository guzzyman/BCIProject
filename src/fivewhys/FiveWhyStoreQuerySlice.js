import { StoreQueryTagEnum } from "common/Constants";
import { baseApi } from "common/StoreQuerySlice";

export const rcaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRating: builder.query({
      query: () => ({
        url: "/EnumHelper/GetRatingsSelectionList",
      }),
      providesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    addRCA: builder.mutation({
      query: (data) => ({
        url: "/Rca/",
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    updateRCA: builder.mutation({
      query: (data) => ({
        url: `/Rca/${data?.bciRegisterId}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    getEmployeeByADSearch: builder.query({
      query: ({ ...params }) => ({
        url: `/UserManagement/SearchUsersFromAD`,
        params,
      }),
      // providesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    getRCATeamManagerMembersByBciId: builder.query({
      query: (id) => ({
        url: `/Rca/RCATeamMembersByBciId?bciID=${id}&Option=Manager`,
      }),
      providesTags: (id) => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
  }),
});
