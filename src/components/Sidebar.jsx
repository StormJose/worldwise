import { Outlet } from "react-router-dom"
import Logo from "./Logo"
import AppNav from "./AppNav"
import styles from "./Sidebar.module.css"

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
        <Logo/>
        <AppNav/>

        {/* Where the content of a sub route is going to be displayed */}
        <Outlet/>

        
        <footer className={styles.footer}>
            <p className={styles.copyright}>
                &copy; Copyright {new Date().getFullYear()} by WorldWise
            </p>
        </footer>
    </div>
  )
}
