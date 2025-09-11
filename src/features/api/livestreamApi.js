import { baseApi } from './baseApi'

export const livestreamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLivestreams: builder.query({
      query: (params) => ({
        url: '/livestreams',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
    getLivestream: builder.query({
      query: (slug) => `/livestreams/${slug}`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetLivestreamQuery, useGetAllLivestreamsQuery } = livestreamApi
