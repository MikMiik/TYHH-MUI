import { baseApi } from './baseApi'

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDocuments: builder.query({
      query: (params) => ({
        url: 'documents',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
    getDocumentBySlug: builder.query({
      query: (slug) => `documents/${slug}`,
      transformResponse: (response) => response.data,
    }),
    createDocument: builder.mutation({
      query: (documentData) => ({
        url: '/documents',
        method: 'POST',
        body: documentData,
      }),
      transformResponse: (response) => response.data,
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
    }),
    incrementDownload: builder.mutation({
      query: (slugOrId) => ({
        url: `/documents/${slugOrId}/download`,
        method: 'POST',
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useGetAllDocumentsQuery,
  useGetDocumentBySlugQuery,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useIncrementDownloadMutation,
} = documentApi
