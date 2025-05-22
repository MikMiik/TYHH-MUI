import CountDownItem from "../CountDownItem"
import styles from "./CountDown.module.scss"

function CountDown() {
    return (
        <ul className={styles.countDownWrapper}>
            <CountDownItem number="52" text="Day" />
            <CountDownItem number="18" text="Hour" />
            <CountDownItem number="50" text="Minutes" />
            <CountDownItem number="22" text="Seconds" noColons />
        </ul>
    )
}

export default CountDown
