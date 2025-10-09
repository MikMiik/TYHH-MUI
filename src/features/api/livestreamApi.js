import { baseApi } from './baseApi'

export const livestreamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLivestreams: builder.query({
      query: (params) => ({
        url: '/livestreams',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
    getLivestream: builder.query({
      query: (slug) => `/livestreams/${slug}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, slug) => [
        { type: 'Livestream', id: slug },
        { type: 'Livestream', id: result?.id },
      ],
    }),
    createLivestream: builder.mutation({
      query: (livestreamData) => ({
        url: '/livestreams/teacher/create',
        method: 'POST',
        body: livestreamData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.courseId },
        { type: 'CourseOutline', id: arg.courseOutlineId },
      ],
    }),
    updateLivestream: builder.mutation({
      query: ({ id, ...livestreamData }) => ({
        url: `/livestreams/teacher/${id}`,
        method: 'PUT',
        body: livestreamData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Livestream', id: arg.id },
        { type: 'Livestream', id: result?.slug },
        { type: 'Course', id: result?.courseId },
        { type: 'CourseOutline', id: result?.courseOutlineId },
      ],
    }),
  }),
})

export const {
  useGetLivestreamQuery,
  useGetAllLivestreamsQuery,
  useCreateLivestreamMutation,
  useUpdateLivestreamMutation,
} = livestreamApi
