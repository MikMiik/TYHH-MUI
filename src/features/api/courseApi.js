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
      providesTags: (result, error, slug) => [
        { type: 'Course', id: slug },
        { type: 'Course', id: result?.id },
      ],
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
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.id },
        { type: 'Course', id: result?.slug },
        'CreatedCourses',
        'Course', // Invalidate all Course cache to ensure fresh data
      ],
    }),
    createCourseOutline: builder.mutation({
      query: (outlineData) => ({
        url: '/course-outlines',
        method: 'POST',
        body: outlineData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.courseId },
        'CreatedCourses',
        'Course', // Invalidate all Course cache to ensure fresh data
      ],
    }),
    deleteCourseOutline: builder.mutation({
      query: (outlineId) => ({
        url: `/course-outlines/${outlineId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: () => [
        'CreatedCourses',
        'Course', // Invalidate all Course cache to ensure fresh data
      ],
    }),
    updateCourseOutline: builder.mutation({
      query: ({ id, ...outlineData }) => ({
        url: `/course-outlines/${id}`,
        method: 'PUT',
        body: outlineData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: () => [
        'CreatedCourses',
        'Course', // Invalidate all Course cache to ensure fresh data
      ],
    }),
    reorderCourseOutlines: builder.mutation({
      query: ({ courseId, orders }) => ({
        url: `/course-outlines/course/${courseId}/reorder`,
        method: 'PATCH',
        body: { orders },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: () => [
        'CreatedCourses',
        'Course', // Invalidate all Course cache to ensure fresh data
      ],
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
  useCreateCourseOutlineMutation,
  useDeleteCourseOutlineMutation,
  useUpdateCourseOutlineMutation,
  useReorderCourseOutlinesMutation,
} = courseApi
