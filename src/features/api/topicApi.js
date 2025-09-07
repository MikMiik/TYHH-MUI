import { baseApi } from './baseApi'

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => 'topics',
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetTopicsQuery } = topicApi
