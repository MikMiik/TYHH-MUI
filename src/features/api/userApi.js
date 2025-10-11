import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCourses: builder.query({
      query: () => ({
        url: 'users/my-courses',
      }),
      transformResponse: (response) => response.data,
    }),
    getAllStudents: builder.query({
      query: () => ({
        url: 'users/students',
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetMyCoursesQuery, useGetAllStudentsQuery } = userApi
