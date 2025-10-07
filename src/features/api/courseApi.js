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
      query: (slug) => `/courses/${slug}`,
      transformResponse: (response) => response.data,
    }),
    getCreatedCourses: builder.query({
      query: (params) => ({
        url: '/courses/teacher/created-courses',
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: ['CreatedCourses'],
    }),
  }),
})

export const { useGetCourseQuery, useGetAllCoursesQuery, useGetCreatedCoursesQuery } = courseApi
