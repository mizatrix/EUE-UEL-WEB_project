"use client";

import { useEffect } from "react";
import { Project } from "@/data/projects";
import styles from "./ProjectModal.module.css";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.modalOverlayActive : ""}`}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-accent': project.accent } as React.CSSProperties}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalIcon} style={{ color: project.accent, background: `${project.accent}15`, borderColor: `${project.accent}30` }}>
            <i className={`fa-solid ${project.icon}`}></i>
          </div>
          <div>
            <span className={styles.modalCategory} style={{ color: project.accent }}>{project.category}</span>
            <h3>{project.title}</h3>
          </div>
        </div>

        <p className={styles.modalDesc}>{project.description}</p>

        <h4>
          <i className="fa-solid fa-list-check"></i> Required Features:
        </h4>
        <ul className={styles.featuresList}>
          {project.features.map((feature, idx) => (
            <li key={idx}>
              <i className="fa-solid fa-circle-check" style={{ color: project.accent, marginRight: '0.5rem', fontSize: '0.8rem' }}></i>
              {feature}
            </li>
          ))}
        </ul>

        {/* Tech Stack */}
        <div className={styles.datasetSection}>
          <h4><i className="fa-solid fa-layer-group"></i> Required Tech Stack:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(99,102,241,0.15)' }}>
              <i className="fa-solid fa-palette" style={{ marginRight: '0.3rem' }}></i> Stitch Design
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(14,165,233,0.15)' }}>
              <i className="fa-brands fa-react" style={{ marginRight: '0.3rem' }}></i> Next.js
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.15)' }}>
              <i className="fa-solid fa-database" style={{ marginRight: '0.3rem' }}></i> Supabase
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(139,92,246,0.15)' }}>
              <i className="fa-brands fa-node-js" style={{ marginRight: '0.3rem' }}></i> Node.js
            </span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="/login" className="btn primary-btn" style={{ flex: 1, textAlign: 'center', minWidth: '160px' }}>
            <i className="fa-solid fa-users" style={{ marginRight: '0.4rem' }}></i>
            Register Team
          </a>
          <a href="/guide" className="btn secondary-btn" style={{ flex: 1, textAlign: 'center', minWidth: '160px' }}>
            <i className="fa-solid fa-book-open" style={{ marginRight: '0.4rem' }}></i>
            View Guide
          </a>
        </div>
      </div>
    </div>
  );
}
