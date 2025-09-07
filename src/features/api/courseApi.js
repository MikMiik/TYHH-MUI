import { baseApi } from './baseApi'

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: (params) => ({
        url: '/courses',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
    getCourse: builder.query({
      query: (id) => `/courses/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetCourseQuery, useGetAllCoursesQuery } = courseApi
