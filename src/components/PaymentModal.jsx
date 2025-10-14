import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useCreateMockPaymentMutation } from '@/features/api/paymentsApi'
import { toast } from 'react-toastify'

const paymentSchema = yup.object({
  cardholderName: yup.string().required('Tên chủ thẻ là bắt buộc').min(2, 'Tên chủ thẻ phải có ít nhất 2 ký tự'),
  cardNumber: yup
    .string()
    .required('Số thẻ là bắt buộc')
    .matches(/^[0-9\s]{13,19}$/, 'Số thẻ không hợp lệ')
    .transform((value) => value.replace(/\s/g, '')),
  expiryDate: yup
    .string()
    .required('Ngày hết hạn là bắt buộc')
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Định dạng MM/YY'),
  cvv: yup
    .string()
    .required('CVV là bắt buộc')
    .matches(/^[0-9]{3,4}$/, 'CVV phải có 3-4 chữ số'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
})

const PaymentModal = ({ open, onClose, onPaymentSuccess, course, user, amount }) => {
  const [paymentStep, setPaymentStep] = useState('form') // 'form', 'processing', 'success', 'error'
  const [paymentResult, setPaymentResult] = useState(null)

  const [createMockPayment, { isLoading }] = useCreateMockPaymentMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      cardholderName: user?.name || '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      email: user?.email || '',
    },
  })

  const cardNumber = watch('cardNumber')

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Get card brand from number
  const getCardBrand = (number) => {
    const num = number.replace(/\s/g, '')
    if (/^4/.test(num)) return 'visa'
    if (/^5[1-5]/.test(num)) return 'mastercard'
    if (/^3[47]/.test(num)) return 'amex'
    return 'unknown'
  }

  const onSubmit = async (data) => {
    setPaymentStep('processing')

    try {
      const paymentData = {
        courseId: course?.id,
        amount: amount || course?.discount || course?.price,
        paymentMethod: {
          type: 'card',
          name: data.cardholderName,
          last4: data.cardNumber.slice(-4),
          brand: getCardBrand(data.cardNumber),
        },
        metadata: {
          email: data.email,
          courseName: course?.title,
        },
        // For testing: you can set 'failed' to simulate payment failure
        simulate: 'success',
      }

      const result = await createMockPayment(paymentData).unwrap()

      setPaymentResult(result)
      setPaymentStep('success')

      // Call success callback
      if (onPaymentSuccess) {
        onPaymentSuccess(result)
      }

      toast.success('Thanh toán thành công! Bạn đã đăng ký khóa học.')
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStep('error')
      setPaymentResult(error)
      toast.error(error?.data?.message || 'Thanh toán thất bại')
    }
  }

  const handleClose = () => {
    if (paymentStep === 'processing') return // Prevent closing during processing

    reset()
    setPaymentStep('form')
    setPaymentResult(null)
    onClose()
  }

  const handleTryAgain = () => {
    setPaymentStep('form')
    setPaymentResult(null)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 500 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CreditCardIcon color="primary" />
          <Typography variant="h6">
            {paymentStep === 'success' ? 'Thanh toán thành công' : 'Thanh toán khóa học'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {/* Course Summary */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600}>
              {course?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {course?.description}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary.main">
                Tổng thanh toán:
              </Typography>
              <Typography variant="h6" fontWeight={700} color="tertiary.main">
                {parseInt(amount || course?.discount || course?.price || 0, 10).toLocaleString('vi-VN')}₫
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {paymentStep === 'form' && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="cardholderName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tên chủ thẻ"
                      error={!!errors.cardholderName}
                      helperText={errors.cardholderName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="cardNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Số thẻ"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(field.value)}
                      onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
                      InputProps={{
                        endAdornment: (
                          <Chip label={getCardBrand(cardNumber).toUpperCase()} size="small" variant="outlined" />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="MM/YY"
                      placeholder="12/25"
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="cvv"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      error={!!errors.cvv}
                      helperText={errors.cvv?.message}
                      InputProps={{
                        endAdornment: <SecurityIcon color="action" fontSize="small" />,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 2 }}>
              💳 <strong>Thẻ test:</strong> 4242 4242 4242 4242, bất kỳ ngày trong tương lai, bất kỳ CVV 3 chữ số
            </Alert>
          </Box>
        )}

        {paymentStep === 'processing' && (
          <Box textAlign="center" py={4}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang xử lý thanh toán...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng không đóng cửa sổ này
            </Typography>
          </Box>
        )}

        {paymentStep === 'success' && paymentResult && (
          <Box textAlign="center" py={2}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Chúc mừng! Thanh toán thành công
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mã thanh toán: {paymentResult.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn đã đăng ký thành công khóa học "{course?.title}"
            </Typography>
          </Box>
        )}

        {paymentStep === 'error' && (
          <Box textAlign="center" py={2}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Thanh toán thất bại</Typography>
              <Typography variant="body2">
                {paymentResult?.data?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {paymentStep === 'form' && (
          <>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              variant="contained"
              color="tertiary"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <CreditCardIcon />}
            >
              {isLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
            </Button>
          </>
        )}

        {paymentStep === 'success' && (
          <Button variant="contained" color="primary" onClick={handleClose} fullWidth>
            Hoàn thành
          </Button>
        )}

        {paymentStep === 'error' && (
          <>
            <Button onClick={handleClose}>Đóng</Button>
            <Button variant="contained" color="tertiary" onClick={handleTryAgain}>
              Thử lại
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default PaymentModal
