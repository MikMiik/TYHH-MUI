import { baseApi } from './baseApi'

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query({
      query: () => 'cities',
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetAllCitiesQuery } = cityApi
