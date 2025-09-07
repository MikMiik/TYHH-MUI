import CheckIcon from '@mui/icons-material/Check'

const GreenCircleStepIcon = ({ isSeen, ...props }) => {
  // Loại bỏ tất cả props của MUI StepIcon khỏi DOM
  // eslint-disable-next-line no-unused-vars
  const { active, completed, error, icon, className, ownerState, ...rest } = props
  return (
    <span
      className={className}
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '3px solid #4caf50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isSeen ? '#e8f5e9' : 'transparent',
      }}
      {...rest}
    >
      {isSeen && <CheckIcon sx={{ fontSize: 16, color: '#4caf50' }} />}
    </span>
  )
}

export default GreenCircleStepIcon
