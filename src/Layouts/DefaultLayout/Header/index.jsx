import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faArrowRightToBracket, faUserPlus, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import styles from './Header.module.scss'
import mainlogo from '@/assets/images/mainlogo.png'
import { CountDown, HeaderNavItem, HeaderNavButton } from './components'
import config from '@/config'

function Header() {
  return (
    <header>
      <div className={styles.headerTopBar}>
        <FontAwesomeIcon className={styles.calendarIcon} icon={faCalendarDays} />
        Đếm ngược ngày thi tốt nghiệp THPT 2025
        <CountDown />
      </div>

      <div className={styles.headerMenu}>
        <div className={styles.menuContainer}>
          <Link to={'/'}>
            <img className={styles.mainLogo} src={mainlogo} alt="Tyhh.net" />
          </Link>

          <nav>
            <ul>
              <HeaderNavItem>Danh mục</HeaderNavItem>
              <HeaderNavItem goto={config.routes.home}>Trang chủ</HeaderNavItem>
              <HeaderNavItem goto={config.routes.onlineLearning}>Học Online</HeaderNavItem>
              <HeaderNavItem goto={config.routes.vipDocuments}>Tài liệu Vip</HeaderNavItem>
              <HeaderNavItem goto={config.routes.documents}>Tài liệu</HeaderNavItem>
              <HeaderNavItem goto={config.routes.liveSchedule}>Lịch Live</HeaderNavItem>
              <HeaderNavItem>Thanh toán</HeaderNavItem>
            </ul>
          </nav>

          <section></section>
        </div>
      </div>
    </header>
  )
}

export default Header
