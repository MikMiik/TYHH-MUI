import DocumentListItem from '@/components/DocumentListItem'
import { useGetAllDocumentsQuery } from '@/features/api/documentApi'
import { Box, List, Pagination } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useLoadingState } from '@/components/withLoadingState'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUserRole } from '@/hooks/useUserRole'

function VipDocuments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  const topic = searchParams.get('topic') || ''
  const search = searchParams.get('search') || ''
  const pageSize = 6
  const queryResult = useGetAllDocumentsQuery(
    { page, limit: pageSize, sort, vip: 1, topic, search },
    { refetchOnMountOrArgChange: true }
  )

  const { data: { documents, totalPages } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'section',
    loadingText: 'Đang tải tài liệu VIP...',
    emptyText: 'Chưa có tài liệu VIP nào',
    skeletonType: 'list',
    skeletonCount: 5,
    dataKey: 'documents',
    hasDataCheck: (docs) => docs && docs.length > 0,
  })

  // Get current user and role information
  const user = useCurrentUser()
  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')
  const hasActiveKey = user?.activeKey || false

  const handlePageChange = (_, value) => {
    setSearchParams({ page: value.toString(), sort })
  }

  return (
    <Box ml={4} width="100%">
      <LoadingStateComponent>
        <List sx={{ mt: -2 }}>
          {documents && documents.length > 0 && documents.map((doc) => (
            <DocumentListItem 
              key={doc.id} 
              doc={doc} 
              isTeacher={isTeacher}
              hasActiveKey={hasActiveKey}
            />
          ))}
        </List>
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
          </Box>
        )}
      </LoadingStateComponent>
    </Box>
  )
}

export default VipDocuments
