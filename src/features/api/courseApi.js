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
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/courses/teacher/create',
        method: 'POST',
        body: courseData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['CreatedCourses'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/teacher/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['CreatedCourses'],
    }),
    editCourse: builder.mutation({
      query: ({ id, courseData }) => ({
        url: `/courses/teacher/${id}`,
        method: 'PUT',
        body: courseData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['CreatedCourses'],
    }),
  }),
})

export const {
  useGetCourseQuery,
  useGetAllCoursesQuery,
  useGetCreatedCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useEditCourseMutation,
} = courseApi
