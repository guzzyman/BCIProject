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
      query: (category) => ({
        url: `/CategoryRanking/GetByCategory?category=${category}`,
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
        url: `/Rca/RCATeamMembersByBciId?bciID=${id}&Option=Member`,
      }),
      providesTags: (id) => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),

    getRCATeamMembersByBciIdAndLoggedOnUser: builder.query({
      query: ({id, LoggedInUser}) => ({
        url: `/Rca/RCATeamMembersByBciId?bciID=${id}&LoggedInUser=${LoggedInUser}&Option=Member`,
      }),
      providesTags: (id) => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),

    resendRCAFormToTeamMember: builder.mutation({
      query: ({ ...data }) => ({
        url: `/Rca/ResendRCAFormToTeamMember?BCIid=${data?.id}&Member=${data?.member}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    resendRCAFormToTeamManager: builder.mutation({
      query: ({ ...data }) => ({
        url: `/Rca/ResendRCAFormToTeamManager?BCIid=${data?.id}&Manager=${data?.manager}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
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
    getBCIByTitle: builder.query({
      query: ({ BCITitle, ...params }) => ({
        url: `/BciRegister/SearchBCIByTitle/${BCITitle}`,
        params,
      }),
    }),
    addReviewTeamMembers: builder.mutation({
      query: (data) => ({
        url: `/Rca/AddReviewTeamMembers`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    addReviewTeamManagers: builder.mutation({
      query: (data) => ({
        url: `/Rca/AddReviewTeamManagers`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    deleteReviewTeam: builder.mutation({
      query: ({ id }) => ({
        url: `/Rca/DeleteReviewTeam/${id}`,
        method: "get",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    deleteReviewTeamManager: builder.mutation({
      query: ({ id }) => ({
        url: `/Rca/DeleteReviewTeamManager/${id}`,
        method: "get",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    getRCATeamManagersByBciId: builder.query({
      query: ({ searchedBciId }) => ({
        url: `/Rca/RCATeamManagersByBciId/${searchedBciId}`,
      }),
      providesTags: (searchedBciId) => [
        { type: StoreQueryTagEnum.ADD_REVIEW_MANAGER },
      ],
    }),
    updateRCAWithMembersComment: builder.mutation({
      query: (data) => ({
        url: `/Rca/UpdateRCAWithMembersComment?BCIid=${data?.BCIid}&Comments=${data?.Comments}&Acknowledged=${data?.Acknowledged}&Agreed=${data?.Agreed}&Member=${data?.Member}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    updateRCAWithManagersComment: builder.mutation({
      query: (data) => ({
        url: `/Rca/UpdateRCAWithManagersComment?BCIid=${data?.BCIid}&Comments=${data?.Comments}&Acknowledged=${data?.Acknowledged}&Agreed=${data?.Agreed}&Manager=${data?.Manager}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: StoreQueryTagEnum.ADD_REVIEW_MEMBER }],
    }),
    checkIfLinkHasBeenUsed: builder.query({
      query: (data) => ({
        url: `/Rca/CheckIfLinkHasBeenUsed?BCIid=${data?.BCIid}&Member=${data?.Member}&Module=${data?.Module}`,
        data,
        method: "get",
      }),
      providesTags: (searchedBciId) => [
        { type: StoreQueryTagEnum.ADD_REVIEW_MANAGER },
      ],
    }),
  }),
});
