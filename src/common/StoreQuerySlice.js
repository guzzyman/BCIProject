import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { RtkqTagEnum } from "./Constants";
import { baseHttp } from "./Http";

export const baseApi = createApi({
  reducerPath: "baseApi",
  keepUnusedDataFor: 60 * 60,
  baseQuery: axiosBaseQuery({ url: "https://localhost:7228/api/v1" }, baseHttp),
  endpoints: (builder) => ({}),
});
// https://localhost:7228/api/v1
// https://bny-s-t68/BCI.WebApi.Core/api/v1/
[baseApi].forEach((api) => {
  api.enhanceEndpoints({ addTagTypes: Object.values(RtkqTagEnum) });
});

/**
 *
 * @param {import("axios").AxiosRequestConfig} baseConfig
 */
export function axiosBaseQuery(baseConfig = {}, http = axios) {
  return request;

  /**
   *
   * @param {import("axios").AxiosRequestConfig} config
   */
  async function request(config = {}) {
    const url = config.url
      ? (baseConfig.url || "") + config.url
      : baseConfig.url;
    try {
      const response = await http.request({ ...baseConfig, ...config, url });

      return {
        ...response,
        data: response.data,
        message: response.data?.Message || response.data.message,
        status: response.status || 200,
        meta: { request: response.request, response },
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.response
          ? {
              message: error.response.data?.Message,
              status: error.response.status,
              data: error.response.data,
            }
          : {
              message: "Something went wrong",
              data: { message: "Something went wrong" },
            },
      };
    }
  }
}

export function providesTags(resultsWithIds, tagType, options = {}) {
  const { selectId = ({ id }) => id } = options;
  const listTag = { type: tagType, id: "LIST" };
  const result = resultsWithIds
    ? [
        listTag,
        ...resultsWithIds.map((result) => ({
          type: tagType,
          id: selectId(result),
        })),
      ]
    : [listTag];

  return result;
}

export function invalidatesTags(tagType, options = {}) {
  const { ids = [] } = options;
  const result = [
    { type: tagType, id: "LIST" },
    ...ids.map((id) => ({ type: tagType, id })),
  ];

  return result;
}