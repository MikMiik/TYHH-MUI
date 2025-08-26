import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import ImageLazy from '@/components/ImageLazy'
import { Box, Tabs, Tab, Container } from '@mui/material'
import { useState } from 'react'

const tabData = [{ label: 'HÓA 12' }, { label: 'HÓA 11' }, { label: 'HÓA 10' }]

function LiveSchedule() {
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
          {tabData.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        <ImageLazy src="live-schedule.png" w="100%" />
      </Box>
    </Container>
  )
}

export default LiveSchedule
