import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="about">
      <div className={styles.heroContent}>
        <span className={styles.badge}>EUE (UEL) — Web Development Projects</span>
        <h2 className={styles.title}>Build Real-World Web Apps</h2>
        <p className={styles.description}>
          First-year cybersecurity students: Design with{" "}
          <strong>Stitch</strong>, build with <strong>Next.js</strong> &amp;{" "}
          <strong>Node.js</strong>, and deploy your own full-stack web
          application. Supervised by <strong>Dr. Moataz Samy</strong> &amp;{" "}
          <strong>T.A Steven</strong>.
        </p>
        <div className={styles.buttons}>
          <a href="#projects" className={`${styles.btn} ${styles.primaryBtn}`}>
            Explore Projects <span><i className="fa-solid fa-arrow-down"></i></span>
          </a>
          <Link href="/ideas" className={`${styles.btn} ${styles.secondaryBtn}`}>
            Propose Your Idea <span><i className="fa-solid fa-lightbulb"></i></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
