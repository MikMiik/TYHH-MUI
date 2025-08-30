import { styled } from '@mui/material/styles'
const GreenCircleStepIcon = styled('span')(() => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  border: '3px solid #4caf50',
}))

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
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import EditDocumentIcon from '@mui/icons-material/EditDocument'

const lessons = [
  { title: 'BIỆN LUẬN CTCT & SƠ ĐỒ CHUYỂN HÓA ESTER | VIP1', views: 5791 },
  { title: 'BIỆN LUẬN CTCT & SƠ ĐỒ CHUYỂN HÓA ESTER | VIP2', views: 2796 },
  { title: 'BIỆN LUẬN CTCT & SƠ ĐỒ CHUYỂN HÓA ESTER | VIP3', views: 1793 },
  { title: 'BIỆN LUẬN CTCT & SƠ ĐỒ CHUYỂN HÓA ESTER | VIP4', views: 1255 },
]

const CourseOutlineItem = ({
  mainTitle = 'BIỆN LUẬN CTCT & SƠ ĐỒ CHUYỂN HÓA HỢP CHẤT HỮU CƠ',
  lessonsData = lessons,
}) => {
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
            <CircularDeterminate size={20} thickness={5} color="primary" />
            <Typography variant="subtitle2" fontWeight={600}>
              {mainTitle}
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
            {lessonsData.map((item) => (
              <Step key={item.title} expanded>
                <StepLabel slots={{ stepIcon: GreenCircleStepIcon }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PlayCircleIcon sx={{ color: '#999' }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      1
                    </Typography>

                    <PictureAsPdfOutlinedIcon sx={{ color: '#999' }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      1
                    </Typography>

                    <EditDocumentIcon sx={{ color: '#999' }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      1
                    </Typography>

                    <RemoveRedEyeRoundedIcon sx={{ color: '#999' }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      {item.views}
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
