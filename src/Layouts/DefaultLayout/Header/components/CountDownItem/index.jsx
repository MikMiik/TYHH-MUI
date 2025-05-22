import styles from "./CountDownItem.module.scss"

function CountDownItem({ number, text, noColons }) {
    return (
        <li className={styles.countDownContainer}>
            <div className={styles.countDownItem}>
                <div className={styles.countDownItemNumber}>{number}</div>
                <div className={styles.countDownItemText}>{text}</div>
            </div>
            {!noColons && <div className={styles.countDownColons}>:</div>}
        </li>
    )
}

export default CountDownItem
