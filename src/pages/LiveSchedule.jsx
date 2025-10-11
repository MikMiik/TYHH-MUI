import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import LocalImageLazy from '@/components/LocalImageLazy'
import ScheduleUploadModal from '@/components/ScheduleUploadModal'
import { useGetSchedulesQuery } from '@/features/api/scheduleApi'
import { Box, Tabs, Tab, Container, Button, IconButton } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'

function LiveSchedule() {
  const queryResult = useGetSchedulesQuery()
  const { data: schedules, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải lịch livestream...',
    emptyText: 'Chưa có lịch livestream nào',
    hasDataCheck: (schedules) => schedules && schedules.length > 0,
  })
  const [tab, setTab] = useState(0)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

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
    <LoadingStateComponent>
      <Container>
        <Box width="100%" mt={2}>
          <BreadCrumbsPath />
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
            {schedules && schedules.map((t) => <Tab key={t.id} label={t.target} />)}
          </Tabs>

          {/* Action buttons */}
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            {schedules && schedules.length > 0 && schedules[tab] ? (
              // Nếu có data schedule hiện tại, chỉ hiển thị nút edit
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
            ) : (
              // Nếu không có data hoặc tab hiện tại không có schedule, hiển thị nút thêm mới
              <Button variant="contained" startIcon={<Add />} onClick={handleAddNew} size="small">
                Thêm lịch mới
              </Button>
            )}
          </Box>

          {schedules && schedules[tab] && <LocalImageLazy src={schedules[tab].url} w="100%" />}
        </Box>
      </Container>

      <ScheduleUploadModal open={uploadModalOpen} onClose={handleCloseModal} schedule={selectedSchedule} />
    </LoadingStateComponent>
  )
}

export default LiveSchedule
