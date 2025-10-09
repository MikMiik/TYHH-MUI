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
  }),
})

export const { useGetLivestreamQuery, useGetAllLivestreamsQuery, useCreateLivestreamMutation } = livestreamApi
