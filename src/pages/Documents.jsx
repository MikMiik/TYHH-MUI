import DocumentListItem from '@/components/DocumentListItem'
import { List, Box } from '@mui/material'

const documents = [
  {
    image: '/src/assets/images/banner.png',
    title: 'LỜI GIẢI CHI TIẾT BỘ 2 CUỐN SÁCH TRỌNG TÂM HÓA HỌC 12 (LOVEVIP)',
    date: '21 Tháng 8, 2025',
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-1.png',
    title: '199 CÂU ĐẠI CƯƠNG KIM LOẠI - HÓA 12',
    date: '31 Tháng 12, 2024',
  },
  {
    image: '/src/assets/images/tyhh-hero-carousel-2.png',
    title: '250 CÂU TỔNG ÔN HÓA HỮU CƠ 12',
    date: '26 Tháng 12, 2024',
  },
]

const Documents = () => {
  return (
    <Box ml={4} width="100%">
      <List sx={{ mt: -2 }}>
        {documents.map((doc, idx) => (
          <DocumentListItem key={idx} {...doc} />
        ))}
      </List>
    </Box>
  )
}

export default Documents
