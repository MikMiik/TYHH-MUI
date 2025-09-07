import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import ImageLazy from '@/components/ImageLazy'
import { useGetSchedulesQuery } from '@/features/api/scheduleApi'
import { Box, Tabs, Tab, Container } from '@mui/material'
import { useState } from 'react'

function LiveSchedule() {
  const { data: schedules, isSuccess: isSchedulesLoaded } = useGetSchedulesQuery()
  const [tab, setTab] = useState(0)
  return (
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
          {isSchedulesLoaded && schedules && schedules.map((t) => <Tab key={t.id} label={t.target} />)}
        </Tabs>
        {isSchedulesLoaded && schedules && schedules[tab] && <ImageLazy src={schedules[tab].url} w="100%" />}
      </Box>
    </Container>
  )
}

export default LiveSchedule
