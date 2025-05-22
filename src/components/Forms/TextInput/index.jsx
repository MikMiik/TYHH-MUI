import styles from "./TextInput.module.scss"

function TextInput({ type = "text", className = "", name, register = () => ({}), message = "", ...rest }) {
    return (
        <label>
            <input className={styles[className]} type={type} name={name} {...register} {...rest} />
            {message && <p style={{ color: "red" }}>{message}</p>}
            <br />
        </label>
    )
}

export default TextInput
