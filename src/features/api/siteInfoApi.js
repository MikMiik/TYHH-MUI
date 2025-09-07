import { baseApi } from './baseApi'

export const siteInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocials: builder.query({
      query: () => 'socials',
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetSocialsQuery } = siteInfoApi
