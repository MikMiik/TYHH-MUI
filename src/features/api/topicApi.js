import { baseApi } from './baseApi'

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopics: builder.query({
      query: () => 'topics',
      transformResponse: (response) => response.data,
    }),
    getTopics: builder.query({
      query: (params) => ({
        url: 'topics',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetAllTopicsQuery, useGetTopicsQuery } = topicApi
