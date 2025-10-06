import DocumentListItem from '@/components/DocumentListItem'
import { useGetAllDocumentsQuery } from '@/features/api/documentApi'
import { Box, List, Pagination } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

function VipDocuments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  const topic = searchParams.get('topic') || ''
  const pageSize = 6
  const { data: { documents, totalPages } = {}, isLoading } = useGetAllDocumentsQuery(
    { page, limit: pageSize, sort, vip: 1, topic },
    { refetchOnMountOrArgChange: true }
  )

  const handlePageChange = (_, value) => {
    setSearchParams({ page: value.toString(), sort })
  }
  if (isLoading) return <Box ml={4}>Đang tải tài liệu...</Box>

  return (
    <Box ml={4} width="100%">
      <List sx={{ mt: -2 }}>
        {documents && documents.length > 0 ? (
          documents.map((doc) => <DocumentListItem key={doc.id} doc={doc} />)
        ) : (
          <Box>Không có tài liệu nào.</Box>
        )}
      </List>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        </Box>
      )}
    </Box>
  )
}

export default VipDocuments
