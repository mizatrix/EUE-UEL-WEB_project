import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} EUE | UEL Web Dev Hub. Built for First-Year Cybersecurity Students.
        </p>
        <div className={styles.credits}>
          <span>Supervised by <strong>Dr. Moataz Samy</strong></span>
        </div>
      </div>
    </footer>
  );
}
