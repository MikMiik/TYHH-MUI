import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import LocalImageLazy from '@/components/LocalImageLazy'
import ScheduleUploadModal from '@/components/ScheduleUploadModal'
import { useGetSchedulesQuery } from '@/features/api/scheduleApi'
import { Box, Tabs, Tab, Container, Button, IconButton } from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'
import { useUserRole } from '@/hooks/useUserRole'

function LiveSchedule() {
  const queryResult = useGetSchedulesQuery()
  const { data: schedules = [], LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'inline',
    loadingText: 'Đang tải lịch livestream...',
  })
  const [tab, setTab] = useState(0)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')
  const handleAddNew = () => {
    setSelectedSchedule(null)
    setUploadModalOpen(true)
  }

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule)
    setUploadModalOpen(true)
  }

  const handleCloseModal = () => {
    setUploadModalOpen(false)
    setSelectedSchedule(null)
  }
  return (
    <Container>
      <Box width="100%" py={2}>
        <BreadCrumbsPath />

        <LoadingStateComponent>
          {schedules.length > 0 && (
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              centered
              textColor="primary"
              indicatorColor="primary"
              sx={{
                borderBottom: '1px solid #eee',
                mb: 2,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'text.secondary',
                  minWidth: 120,
                },
                '& .Mui-selected': {
                  color: 'secondary.light',
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2,
                  bgcolor: 'secondary.main',
                },
              }}
            >
              {schedules.map((t) => (
                <Tab key={t.id} label={t.target} />
              ))}
            </Tabs>
          )}
        </LoadingStateComponent>

        {/* Action buttons */}
        {isTeacher && (<Box display="flex" justifyContent="center" gap={2} mb={2}>
          {schedules.length > 0 && schedules[tab] && (
            <IconButton
              onClick={() => handleEdit(schedules[tab])}
              color="primary"
              size="small"
              sx={{
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            >
              <Edit />
            </IconButton>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={handleAddNew} size="small">
            Thêm lịch mới
          </Button>
        </Box>)}

        {schedules.length > 0 && schedules[tab] && <LocalImageLazy src={schedules[tab].url} w="100%" />}
      </Box>

      <ScheduleUploadModal open={uploadModalOpen} onClose={handleCloseModal} schedule={selectedSchedule} />
    </Container>
  )
}

export default LiveSchedule
