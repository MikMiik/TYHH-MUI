import { baseApi } from './baseApi'

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data) => ({
        url: 'comments',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    updateComment: builder.mutation({
      query: ({ id, data }) => ({
        url: `comments/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}/like`,
        method: 'POST',
      }),
    }),
    unlikeComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}/unlike`,
        method: 'DELETE',
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
} = commentApi
