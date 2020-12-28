import styles from "../styles/Home.module.css";

export default function SetName({ onSubmit }) {
  return (
    <>
      <h1 className={styles.title}>Welcome to Fastest Finger First</h1>
      <form
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          onSubmit(Object.fromEntries(new FormData(evt.target)).name);
        }}
      >
        <label htmlFor="name" className={styles.description}>
          What is your name?
        </label>
        <input id="name" name="name" required />
        <button>Next</button>
      </form>
    </>
  );
}
