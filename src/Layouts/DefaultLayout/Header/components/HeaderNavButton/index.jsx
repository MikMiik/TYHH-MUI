import { useNavigate } from "react-router-dom"

import styles from "./HeaderNavButton.module.scss"

function HeaderNavButton({ type, children }) {
    const navigate = useNavigate()
    function handleClick() {
        navigate(`/${type}`)
    }
    let color
    switch (type) {
        case "activateCard":
            color = "rgb(236, 151, 31)"
            break
        case "register":
            color = "rgb(24, 144, 255)"
            break
        case "login":
            color = "rgb(255, 77, 79)"
            break
        default:
            color = "rgb(236, 151, 31)"
    }
    return (
        <button className={styles.headerNavButton} onClick={handleClick} style={{ backgroundColor: color }}>
            {children}
        </button>
    )
}

export default HeaderNavButton
