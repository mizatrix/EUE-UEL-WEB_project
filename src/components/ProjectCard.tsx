import { Project } from "@/data/projects";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  takenBy?: string;
}

export default function ProjectCard({ project, onClick, takenBy }: ProjectCardProps) {
  return (
    <div
      className={`${styles.card} ${takenBy ? styles.taken : ""}`}
      onClick={takenBy ? undefined : onClick}
      style={{
        cursor: takenBy ? 'not-allowed' : 'pointer',
        '--accent': project.accent,
      } as React.CSSProperties}
    >
      {/* Top accent bar uses ::before pseudo-element from CSS */}

      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <i className={`fa-solid ${project.icon}`}></i>
        </div>
        <div>
          <span className={styles.cardCategory}>
            <i className="fa-solid fa-folder" style={{ fontSize: '0.7rem' }}></i>
            {project.category}
          </span>
          <h3 className={styles.cardTitle}>{project.title}</h3>
        </div>
      </div>

      <p className={styles.cardDescription}>{project.description}</p>

      {takenBy ? (
        <div className={styles.takenBadge}>
          <i className="fa-solid fa-lock"></i> Taken by {takenBy}
        </div>
      ) : (
        <div className={styles.availableBadge}>
          <i className="fa-solid fa-circle-check"></i> Available
        </div>
      )}
    </div>
  );
}
