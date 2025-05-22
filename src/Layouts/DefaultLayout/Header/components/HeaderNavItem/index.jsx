import { NavLink } from "react-router-dom"

import styles from "./HeaderNavItem.module.scss"

function HeaderNavItem({ goto = "/", children }) {
    return (
        <NavLink className={styles.headerNavItem} to={goto} caseSensitive>
            {children}
        </NavLink>
    )
}

export default HeaderNavItem
