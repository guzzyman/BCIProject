import { StoreQueryTagEnum } from "common/Constants";
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
      query: ({ id, ...data }) => ({
        url: `/BciRegister/${id}`,
        data,
        method: "put",
      }),
    }),
    getBciById: builder.query({
      query: (id) => ({
        url: `/BciRegister/${id}`,
      }),
      providesTags: () => [{ type: StoreQueryTagEnum.INCIDENT_DETAILS }],
    }),
    getRCATeamMembersByBciId: builder.query({
      query: (id) => ({
        url: `/Rca/RCATeamMembersByBciId/${id}`,
      }),
      providesTags: () => [{ type: StoreQueryTagEnum.INCIDENT_DETAILS }],
    }),
    getLoggedInUser: builder.query({
      query: () => ({
        url: "/UserManagement/GetLoggedInUser",
      }),
    }),
    addReviewMember: builder.mutation({
      query: (data) => ({
        url: `/Rca/AddReviewTeamMembers`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    updateReviewTeamResponsiblePerson: builder.mutation({
      query: (data) => ({
        url: `/Rca/UpdateReviewTeamResponsiblePerson?id=${data.id}&BCIRegisterId=${data.BCIRegisterId}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    addBciByWorkflowExpress: builder.mutation({
      query: (data) => ({
        url: `/BciRegister/BciByWorkflowExpress?BCIid=${data.BCIid}&Approver=${data.Approver}&CurrentStep=${data.CurrentStep}&ApproverStatus=${data.ApproverStatus}&ApprovalComment=${data.ApprovalComment}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [
        { type: StoreQueryTagEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST },
      ],
    }),
    getBciWorkflowByStepId: builder.query({
      query: (id) => ({
        url: `/BciRegister/BciWorkflowByStepId/${id}`,
      }),
    }),
    getEmployeeByADSearch: builder.query({
      query: ({ ...params }) => ({
        url: `/UserManagement/SearchUsersFromAD`,
        params,
      }),
    }),
  }),
});
