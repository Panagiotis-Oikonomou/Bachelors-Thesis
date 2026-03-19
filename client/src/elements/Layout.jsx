// Layout.jsx
import Menu from "./Menu";
import styles from "./Menu.module.css"

export default function Layout({ children }) {
    return (
        <>
            <Menu />
            <div className={styles.container}>
                {children}
            </div>
        </>
    );
}