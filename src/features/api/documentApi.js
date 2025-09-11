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
  }),
})

export const { useGetAllDocumentsQuery, useGetDocumentBySlugQuery } = documentApi
