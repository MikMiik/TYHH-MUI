import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper,
  Grid,
  Skeleton,
  Alert,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { EmojiEvents, School, LocationOn, Star } from '@mui/icons-material'
import { useGetAllStudentsQuery } from '@/features/api/userApi'
import LocalImageLazy from '@/components/LocalImageLazy'

function Ranking() {
  const theme = useTheme()
  const { data: students = [], isLoading, error } = useGetAllStudentsQuery()

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant="text" width="300px" height={40} />
          <Skeleton variant="text" width="500px" height={24} />
        </Box>
        {[...Array(10)].map((_, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="circular" width={60} height={60} />
                <Box flex={1}>
                  <Skeleton variant="text" width="200px" height={28} />
                  <Skeleton variant="text" width="150px" height={20} />
                  <Skeleton variant="text" width="100px" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={30} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Có lỗi xảy ra khi tải danh sách học viên. Vui lòng thử lại sau.</Alert>
      </Container>
    )
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <EmojiEvents sx={{ color: theme.palette.medal.gold, fontSize: 32 }} /> // Gold
      case 1:
        return <EmojiEvents sx={{ color: theme.palette.medal.silver, fontSize: 32 }} /> // Silver
      case 2:
        return <EmojiEvents sx={{ color: theme.palette.medal.bronze, fontSize: 32 }} /> // Bronze
      default:
        return (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {index + 1}
          </Box>
        )
    }
  }

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return 'warning' // Gold
      case 1:
        return 'default' // Silver
      case 2:
        return 'secondary' // Bronze
      default:
        return 'primary'
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🏆 Bảng Xếp Hạng Học Viên
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Danh sách học viên xuất sắc được xếp hạng theo điểm số
        </Typography>
      </Box>

      {/* Top 3 Students - Podium Style */}
      {students.length > 0 && (
        <Box mb={4}>
          <Grid container spacing={2} justifyContent="center">
            {students.slice(0, 3).map((student, index) => (
              <Grid item xs={12} sm={4} key={student.id}>
                <Paper
                  elevation={index === 0 ? 8 : 4}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    background:
                      index === 0
                        ? theme.palette.medal.goldGradient
                        : index === 1
                        ? theme.palette.medal.silverGradient
                        : theme.palette.medal.bronzeGradient,
                    color: 'white',
                    transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: index === 0 ? 'scale(1.08)' : 'scale(1.03)',
                    },
                  }}
                >
                  <Box mb={2}>{getRankIcon(index)}</Box>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid white',
                    }}
                  >
                    {student.avatar ? (
                      <LocalImageLazy src={student.avatar} alt={student.name} w="100%" />
                    ) : (
                      student.name?.charAt(0)?.toUpperCase()
                    )}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {student.name}
                  </Typography>
                  <Typography variant="body2" mb={1} sx={{ opacity: 0.9 }}>
                    @{student.username}
                  </Typography>

                  {/* Student Details */}
                  <Box mb={2} sx={{ opacity: 0.9 }}>
                    {student.yearOfBirth && (
                      <Typography variant="caption" display="block">
                        Sinh năm {student.yearOfBirth}
                      </Typography>
                    )}
                    {student.city && (
                      <Typography variant="caption" display="block">
                        📍 {student.city}
                      </Typography>
                    )}
                    {student.school && (
                      <Typography variant="caption" display="block">
                        🏫 {student.school}
                      </Typography>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <Star />
                    <Typography variant="h5" fontWeight="bold">
                      {student.point || 0} điểm
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Students List */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Toàn bộ học viên ({students.length})
          </Typography>
          <List>
            {students.map((student, index) => (
              <ListItem
                key={student.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: index < 3 ? 'action.hover' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <Box display="flex" alignItems="center" width="100%" gap={2}>
                  {/* Rank */}
                  <Box minWidth="50px" textAlign="center">
                    {getRankIcon(index)}
                  </Box>

                  {/* Avatar */}
                  <ListItemAvatar>
                    <Avatar sx={{ width: 50, height: 50 }}>
                      {student.avatar ? (
                        <LocalImageLazy src={student.avatar} alt={student.name} w="100%" />
                      ) : (
                        student.name?.charAt(0)?.toUpperCase()
                      )}
                    </Avatar>
                  </ListItemAvatar>

                  {/* Student Info */}
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6" component="span">
                          {student.name}
                        </Typography>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={getRankBadgeColor(index)}
                          variant={index < 3 ? 'filled' : 'outlined'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          @{student.username}
                        </Typography>

                        {/* Student Details Row */}
                        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                          {student.yearOfBirth && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <School fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Sinh năm {student.yearOfBirth}
                              </Typography>
                            </Box>
                          )}
                          {student.city && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {student.city}
                              </Typography>
                            </Box>
                          )}
                          {student.school && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <School fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {student.school}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    }
                  />

                  {/* Points */}
                  <Box textAlign="right" minWidth="100px">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                      <Star color="warning" />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {student.point || 0}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      điểm
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {students.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Chưa có học viên nào được xếp hạng
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default Ranking
