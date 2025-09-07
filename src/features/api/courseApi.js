import { baseApi } from './baseApi'

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourse: builder.query({
      query: (id) => `/courses/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetCourseQuery } = courseApi
