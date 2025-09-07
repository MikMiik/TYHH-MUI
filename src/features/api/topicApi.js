import { baseApi } from './baseApi'

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopics: builder.query({
      query: () => 'topics',
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetAllTopicsQuery } = topicApi
