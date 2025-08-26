import DocumentListItem from '@/components/DocumentListItem'
import { List, Box, Pagination } from '@mui/material'
import React from 'react'

const documents = [
  {
    image: '/src/assets/images/banner.png',
    title: 'LỜI GIẢI CHI TIẾT BỘ 2 CUỐN SÁCH TRỌNG TÂM HÓA HỌC 12 (LOVEVIP)',
    date: '21 Tháng 8, 2025',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-1.png',
    title: '199 CÂU ĐẠI CƯƠNG KIM LOẠI - HÓA 12',
    date: '31 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-2.png',
    title: '250 CÂU TỔNG ÔN HÓA HỮU CƠ 12',
    date: '26 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/banner.png',
    title: 'LỜI GIẢI CHI TIẾT BỘ 2 CUỐN SÁCH TRỌNG TÂM HÓA HỌC 12 (LOVEVIP)',
    date: '21 Tháng 8, 2025',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-1.png',
    title: '199 CÂU ĐẠI CƯƠNG KIM LOẠI - HÓA 12',
    date: '31 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-2.png',
    title: '250 CÂU TỔNG ÔN HÓA HỮU CƠ 12',
    date: '26 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/banner.png',
    title: 'LỜI GIẢI CHI TIẾT BỘ 2 CUỐN SÁCH TRỌNG TÂM HÓA HỌC 12 (LOVEVIP)',
    date: '21 Tháng 8, 2025',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-1.png',
    title: '199 CÂU ĐẠI CƯƠNG KIM LOẠI - HÓA 12',
    date: '31 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-2.png',
    title: '250 CÂU TỔNG ÔN HÓA HỮU CƠ 12',
    date: '26 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/banner.png',
    title: 'LỜI GIẢI CHI TIẾT BỘ 2 CUỐN SÁCH TRỌNG TÂM HÓA HỌC 12 (LOVEVIP)',
    date: '21 Tháng 8, 2025',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-1.png',
    title: '199 CÂU ĐẠI CƯƠNG KIM LOẠI - HÓA 12',
    date: '31 Tháng 12, 2024',
    vip: true,
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-2.png',
    title: '250 CÂU TỔNG ÔN HÓA HỮU CƠ 12',
    date: '26 Tháng 12, 2024',
    vip: true,
  },
]

function VipDocuments() {
  // Pagination state (only if needed)
  const [page, setPage] = React.useState(1)

  const handlePageChange = (_, value) => {
    setPage(value)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }
  const pageSize = 10
  const pageCount = Math.ceil(documents.length / pageSize)
  const pagedDocs = documents.length >= 10 ? documents.slice((page - 1) * pageSize, page * pageSize) : documents

  return (
    <Box ml={4} width="100%">
      <List sx={{ mt: -2 }}>
        {pagedDocs.map((doc, idx) => (
          <DocumentListItem key={idx + (page - 1) * pageSize} {...doc} />
        ))}
      </List>
      {documents.length >= 10 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        </Box>
      )}
    </Box>
  )
}

export default VipDocuments
