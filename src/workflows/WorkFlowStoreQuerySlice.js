import { RtkqTagEnum } from "common/Constants";
import { baseApi, providesTags } from "common/StoreQuerySlice";

export const bciWorkFlowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBciWorkflowStatusList: builder.query({
      query: () => ({
        url: "/EnumHelper/GetBciWorkflowStatusList",
      }),
      providesTags: () => providesTags(RtkqTagEnum.getBcis),
    }),
    getBciFunctionsList: builder.query({
      query: () => ({
        url: "/EnumHelper/GetBciFunctionsList",
      }),
      providesTags: () => providesTags(RtkqTagEnum.getBcis),
    }),
    getBciByWorkflowStatus: builder.query({
      query: (status) => ({
        url: "/BciRegister/BciByWorkflowStatus/" + status,
      }),
      providesTags: () => providesTags(RtkqTagEnum.getBcis),
    }),
    getBciByWorkflowStatusInitiatorManager: builder.query({
      query: ({...params}) => ({
        url: "/BciRegister/BciByWorkflowStatus/", params
      }),
      providesTags: () => providesTags(RtkqTagEnum.getBcis),
    }),
  }),
});