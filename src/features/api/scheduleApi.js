import { baseApi } from './baseApi'

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => 'schedules',
      transformResponse: (response) => response.data,
      providesTags: ['Schedule'],
    }),
    createSchedule: builder.mutation({
      query: (scheduleData) => ({
        url: '/schedules',
        method: 'POST',
        body: scheduleData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Schedule'],
    }),
    updateSchedule: builder.mutation({
      query: ({ id, ...scheduleData }) => ({
        url: `/schedules/${id}`,
        method: 'PUT',
        body: scheduleData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Schedule'],
    }),
  }),
})

export const { useGetSchedulesQuery, useCreateScheduleMutation, useUpdateScheduleMutation } = scheduleApi
