import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Chip, Container, Stack, Typography, Card, CardContent, Divider, Paper } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useParams, Link } from 'react-router-dom'
import { useGetDocumentBySlugQuery } from '@/features/api/documentApi'
import { useLoadingState } from '@/components/withLoadingState'

const DocumentDetail = () => {
  const { slug } = useParams()
  const queryResult = useGetDocumentBySlugQuery(slug)
  const { data: document, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải tài liệu...',
    emptyText: 'Không tìm thấy tài liệu này',
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <LoadingStateComponent>
      <Container maxWidth="lg">
        <Box py={3}>
          <BreadCrumbsPath />

          <Paper elevation={1} sx={{ mt: 3, p: 4 }}>
            <Stack spacing={3}>
              {/* Header Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {document.title}
                  </Typography>
                  {document.vip && <Chip label="VIP" color="warning" variant="filled" sx={{ fontWeight: 600 }} />}
                </Stack>
              </Box>

              <Divider />

              {/* Info Section */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                {/* Left Column - Document Info */}
                <Box flex={1}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Thông tin tài liệu
                      </Typography>

                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarTodayIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Ngày tạo:
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDate(document.createdAt)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DownloadIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Lượt tải:
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {document.downloadCount || 0}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <VisibilityIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Trạng thái:
                          </Typography>
                          <Chip
                            label={document.vip ? 'VIP' : 'Miễn phí'}
                            size="small"
                            color={document.vip ? 'warning' : 'success'}
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                {/* Right Column - Related Livestream & Documents */}
                {document.livestream && (
                  <Box flex={1}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          Livestream liên quan
                        </Typography>

                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {document.livestream.title}
                            </Typography>
                            {document.livestream.course && (
                              <Typography variant="body2" color="text.secondary" mt={0.5}>
                                Khóa học: {document.livestream.course.title}
                              </Typography>
                            )}
                          </Box>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <VisibilityIcon fontSize="small" color="action" />
                            <Typography variant="body2">{document.livestream.view || 0} lượt xem</Typography>
                          </Stack>

                          <Button
                            component={Link}
                            to={`/livestreams/${document.livestream.slug}`}
                            variant="outlined"
                            startIcon={<PlayCircleOutlineIcon />}
                            fullWidth
                          >
                            Xem Livestream
                          </Button>

                          {/* Documents liên quan */}
                          {Array.isArray(document.livestream.documents) && document.livestream.documents.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                                Tài liệu khác trong Livestream này:
                              </Typography>
                              <Stack spacing={1}>
                                {document.livestream.documents.map((doc) => (
                                  <Button
                                    key={doc.id}
                                    component={Link}
                                    to={`/documents/${doc.slug}`}
                                    variant="text"
                                    color="primary"
                                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                                  >
                                    {doc.title || doc.slug}
                                  </Button>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Stack>

              {/* Action Buttons */}
              <Box pt={2}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={document.url ? `${import.meta.env.VITE_SERVER_URL}${document.url}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!document.url}
                  >
                    Tải PDF
                  </Button>

                  {document.slidenote && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<DownloadIcon />}
                      component="a"
                      href={`${import.meta.env.VITE_SERVER_URL}${document.slidenote}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tải slidenote
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Topics Section */}
              {document.livestream?.course?.topics && document.livestream.course.topics.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      Chủ đề liên quan
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {document.livestream.course.topics.map((topic) => (
                        <Chip key={topic.id} label={topic.title} variant="outlined" color="primary" size="small" />
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Box>
      </Container>
    </LoadingStateComponent>
  )
}

export default DocumentDetail
