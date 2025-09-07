import { baseApi } from './baseApi'

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => 'schedules',
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetSchedulesQuery } = scheduleApi
