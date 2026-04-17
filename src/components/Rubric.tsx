"use client";

import React, { useState, useRef } from 'react';
import styles from './Rubric.module.css';

interface RubricItem {
  id: string;
  label: string;
  icon: string;
  accent: string;
  points: number;
  content: {
    title: string;
    grades: { level: string; range: string; desc: string }[];
  }[];
}

const RUBRIC_DATA: RubricItem[] = [
  {
    id: 'design',
    label: 'UI/UX Design (Stitch)',
    icon: 'fa-palette',
    accent: '#6366f1',
    points: 25,
    content: [
      {
        title: 'Design System & Wireframes',
        grades: [
          { level: 'Excellent', range: '20–25 pts', desc: 'Professional Stitch wireframes for all screens. Cohesive design system with color palette, typography, and spacing tokens. Responsive layouts for mobile and desktop. Polished, production-ready UI.' },
          { level: 'Satisfactory', range: '13–19 pts', desc: 'Basic wireframes exist but inconsistent styling. Some screens missing from Stitch. Partial responsiveness — works on desktop but breaks on mobile.' },
          { level: 'Poor', range: '0–12 pts', desc: 'No Stitch wireframes created. UI built ad-hoc with no design system. Layout is broken or visually unappealing.' },
        ]
      }
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend (Next.js)',
    icon: 'fa-laptop-code',
    accent: '#0ea5e9',
    points: 25,
    content: [
      {
        title: 'Component Architecture & Routing',
        grades: [
          { level: 'Excellent', range: '20–25 pts', desc: 'Clean component hierarchy with reusable components. Proper use of App Router, server/client components, dynamic routes, and loading/error states. SEO metadata implemented. Code is modular and well-organized.' },
          { level: 'Satisfactory', range: '13–19 pts', desc: 'Components work but are monolithic — all logic in one file. Basic routing exists but no error handling or loading states. Some components needlessly client-side.' },
          { level: 'Poor', range: '0–12 pts', desc: 'Single-page app with no routing. Components are copy-pasted with duplicated code. Project does not follow Next.js conventions.' },
        ]
      }
    ]
  },
  {
    id: 'backend',
    label: 'Backend (Node.js)',
    icon: 'fa-server',
    accent: '#10b981',
    points: 20,
    content: [
      {
        title: 'API Design & Database Integration',
        grades: [
          { level: 'Excellent', range: '16–20 pts', desc: 'Well-structured API routes or Server Actions with proper validation and error handling. Supabase integration with RLS policies. Authentication flow (signup, login, protected routes) works correctly. Data relationships are properly modeled.' },
          { level: 'Satisfactory', range: '10–15 pts', desc: 'API routes exist but lack validation — accepts any input. Database connected but no RLS or security policies. Auth works for login but breaks on edge cases.' },
          { level: 'Poor', range: '0–9 pts', desc: 'No backend logic. Data is hardcoded or only stored in browser localStorage. No authentication or database integration.' },
        ]
      }
    ]
  },
  {
    id: 'quality',
    label: 'Code Quality & GitHub',
    icon: 'fa-code-branch',
    accent: '#f43f5e',
    points: 15,
    content: [
      {
        title: 'Version Control & Documentation',
        grades: [
          { level: 'Excellent', range: '12–15 pts', desc: 'Clean Git history with meaningful commits. Professional README with setup instructions, screenshots, and tech stack. Proper folder structure. No hardcoded secrets. Deployed to Vercel with working live URL.' },
          { level: 'Satisfactory', range: '7–11 pts', desc: 'Git used but commits are like "update" or "fix". README exists but is incomplete. Some secrets or API keys visible in code. Deployment exists but has issues.' },
          { level: 'Poor', range: '0–6 pts', desc: 'Code submitted as ZIP with no Git history. No README. Secrets exposed. Not deployed — only runs locally.' },
        ]
      }
    ]
  },
  {
    id: 'presentation',
    label: 'Presentation & Demo',
    icon: 'fa-person-chalkboard',
    accent: '#8b5cf6',
    points: 15,
    content: [
      {
        title: 'Live Demo & Communication',
        grades: [
          { level: 'Excellent', range: '12–15 pts', desc: 'Live demo of deployed app. Team explains architecture decisions, security considerations, and user flows clearly. All members participate. Demo includes real data and working features.' },
          { level: 'Satisfactory', range: '7–11 pts', desc: 'Demo works but only locally. Team reads from slides instead of explaining. Only one member speaks. Limited understanding of the codebase.' },
          { level: 'Poor', range: '0–6 pts', desc: 'No working demo. Team cannot explain their code or design decisions. Presentation is disorganized or not prepared.' },
        ]
      }
    ]
  }
];

const LEVEL_COLORS: Record<string, string> = {
  Excellent: '#10b981',
  Satisfactory: '#f59e0b',
  Poor: '#ef4444',
};

export default function Rubric() {
  const [openItems, setOpenItems] = useState<string[]>(['design']);
  const tocRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (openItems.length === RUBRIC_DATA.length) {
      setOpenItems([]);
    } else {
      setOpenItems(RUBRIC_DATA.map(i => i.id));
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`rubric-${id}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      if (!openItems.includes(id)) {
        setOpenItems(prev => [...prev, id]);
      }
    }
  };

  const totalPoints = RUBRIC_DATA.reduce((acc, r) => acc + r.points, 0);

  return (
    <section className={styles.rubricSection} id="rubric">
      <div className={styles.container}>
        <div className={styles.rubricHeader}>
          <span className="badge">Grading Standards</span>
          <h2 className={styles.rubricTitle}>Project Rubric</h2>
          <p className={styles.rubricSubtitle}>
            Your web development project will be evaluated across these 5 pillars.
            Design in Stitch, build in Next.js, and deploy to production.
          </p>
        </div>

        <div className={styles.gradingGrid}>
          <div className={styles.gradingCard}>
            <div className={styles.gradingIcon}><i className="fa-solid fa-palette"></i></div>
            <div>
              <span className={styles.gradingValue}>25 Points</span>
              <span className={styles.gradingLabel}>UI/UX Design (Stitch)</span>
            </div>
          </div>
          <div className={styles.gradingCard}>
            <div className={styles.gradingIcon}><i className="fa-solid fa-laptop-code"></i></div>
            <div>
              <span className={styles.gradingValue}>25 Points</span>
              <span className={styles.gradingLabel}>Frontend (Next.js)</span>
            </div>
          </div>
          <div className={styles.gradingCard}>
            <div className={styles.gradingIcon}><i className="fa-solid fa-server"></i></div>
            <div>
              <span className={styles.gradingValue}>20 Points</span>
              <span className={styles.gradingLabel}>Backend (Node.js)</span>
            </div>
          </div>
          <div className={styles.gradingCard}>
            <div className={styles.gradingIcon}><i className="fa-solid fa-code-branch"></i></div>
            <div>
              <span className={styles.gradingValue}>15 Points</span>
              <span className={styles.gradingLabel}>Code Quality & GitHub</span>
            </div>
          </div>
          <div className={styles.gradingCard}>
            <div className={styles.gradingIcon}><i className="fa-solid fa-person-chalkboard"></i></div>
            <div>
              <span className={styles.gradingValue}>15 Points</span>
              <span className={styles.gradingLabel}>Presentation & Demo</span>
            </div>
          </div>
          <div className={styles.gradingCard} style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(244,63,94,0.06))', borderColor: 'rgba(244,63,94,0.2)' }}>
            <div className={styles.gradingIcon} style={{ color: '#f43f5e' }}><i className="fa-solid fa-star"></i></div>
            <div>
              <span className={styles.gradingValue} style={{ color: '#f43f5e' }}>{totalPoints} Total</span>
              <span className={styles.gradingLabel}>Full Score</span>
            </div>
          </div>
        </div>

        <div className={styles.rubricToc} ref={tocRef}>
          {RUBRIC_DATA.map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`${styles.tocPill} ${openItems.includes(item.id) ? styles.tocPillActive : ''}`}
              style={{ '--accent': item.accent } as React.CSSProperties}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
              <span className={styles.tocPoints}>{item.points}pts</span>
            </button>
          ))}
          <button
            onClick={toggleAll}
            className={`${styles.tocPill} ${styles.tocPillToggleAll}`}
          >
            <i className={`fa-solid ${openItems.length === RUBRIC_DATA.length ? 'fa-compress' : 'fa-expand'}`}></i>
            {openItems.length === RUBRIC_DATA.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className={styles.rubricAccordion}>
          {RUBRIC_DATA.map(sect => (
            <div
              key={sect.id}
              id={`rubric-${sect.id}`}
              className={`${styles.accordionItem} ${openItems.includes(sect.id) ? styles.accordionItemOpen : ''}`}
              style={{ '--accent': sect.accent } as React.CSSProperties}
            >
              <button
                className={styles.accordionTrigger}
                onClick={() => toggleItem(sect.id)}
                aria-expanded={openItems.includes(sect.id)}
              >
                <div className={styles.accordionIcon}>
                  <i className={`fa-solid ${sect.icon}`}></i>
                </div>
                <span className={styles.accordionLabel}>{sect.label}</span>
                <span className={styles.accordionCount}>{sect.points} Points</span>
                <i className={`fa-solid fa-chevron-down ${styles.accordionChevron} ${openItems.includes(sect.id) ? styles.accordionChevronUp : ''}`}></i>
              </button>

              <div className={styles.accordionBody}>
                <div className={styles.accordionInner}>
                  {sect.content.map((group, idx) => (
                    <div key={idx} className={styles.rubricItem}>
                      <h4 className={styles.itemHeading}>
                        <i className="fa-solid fa-circle-check"></i>
                        {group.title}
                      </h4>
                      <div className={styles.gradesTable}>
                        {group.grades.map((g, gIdx) => (
                          <div key={gIdx} className={styles.gradeRow}>
                            <span className={styles.gradeLevel} style={{ color: LEVEL_COLORS[g.level] }}>
                              <i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.4rem' }}></i>
                              {g.level}
                            </span>
                            <span className={styles.gradeRange}>{g.range}</span>
                            <span className={styles.gradeDesc}>{g.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
