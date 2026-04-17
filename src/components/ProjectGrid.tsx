"use client";

import { useState } from "react";
import { projectsData, categories, Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({ takenProjects }: { takenProjects: Record<number, string> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projectsData.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const takenCount = Object.keys(takenProjects).length;
  const availableCount = projectsData.length - takenCount;

  return (
    <section className={styles.projectsSection} id="projects">
      <div className={styles.container}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge">Web Dev Projects</span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)', fontWeight: 800, color: '#1e293b', marginTop: '0.5rem' }}>
            Available Projects
          </h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{availableCount} available</span>
            {takenCount > 0 && <> · <span style={{ color: '#f43f5e', fontWeight: 600 }}>{takenCount} taken</span></>}
            {' '} across {categories.length} cybersecurity domains
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <i className={`fa-solid fa-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'All' ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            <i className="fa-solid fa-th-large" style={{ marginRight: '0.3rem' }}></i>
            All <span className={styles.pillCount}>{projectsData.length}</span>
          </button>
          {categories.map((cat) => {
            const count = projectsData.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} <span className={styles.pillCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className={styles.grid} id="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-search"></i>
              <p>No projects found matching your search.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                takenBy={takenProjects[project.id]}
                onClick={() => setSelectedProject(project)}
              />
            ))
          )}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
