import GreenCircleStepIcon from './GreenCircleStepIcon'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import CircularDeterminate from './CircularDeterminate'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import { Link } from 'react-router-dom'

const CourseOutlineItem = ({ title, livestreams = [] }) => {
  // Tính phần trăm hoàn thành dựa trên số livestream đã xem
  const seenCount = livestreams.filter((item) => item.isSeen).length
  const totalCount = livestreams.length
  const completionPercentage = totalCount > 0 ? (seenCount / totalCount) * 100 : 0

  return (
    <>
      <Accordion
        square
        disableGutters
        sx={{
          boxShadow: 'none',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 48,
            bgcolor: '#e0e0e0',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularDeterminate size={20} thickness={5} color="primary" progress={completionPercentage} />
            <Typography variant="subtitle2" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Stepper
            orientation="vertical"
            nonLinear
            activeStep={-1}
            sx={{ pl: 2, pr: 0, '& .MuiStepConnector-root, & .MuiStepContent-root': { ml: '10px' } }}
          >
            {livestreams.map((item) => (
              <Step key={item.title} expanded>
                <StepLabel slots={{ stepIcon: (props) => <GreenCircleStepIcon isSeen={item.isSeen} {...props} /> }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {Array.isArray(item.documents) && item.documents.length > 0 ? (
                      <Link
                        to={`/documents/${item.documents[0].slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <EditDocumentIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                      </Link>
                    ) : (
                      <EditDocumentIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                    )}
                    <Typography fontSize={14} color="#888">
                      {Array.isArray(item.documents) ? item.documents.length : 0}
                    </Typography>

                    <RemoveRedEyeRoundedIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      {item.view || 0}
                    </Typography>
                  </Stack>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default CourseOutlineItem
