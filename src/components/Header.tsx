"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.glassNav}>
      <div className={styles.container}>
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <Link href="/" className={styles.logo}>
          <i className="fa-solid fa-code"></i> EUE | UEL <span>Web Dev Hub</span>
        </Link>

        {isMenuOpen && (
          <div 
            className={styles.overlay} 
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
          <button 
            className={styles.navClose} 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close Menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <Link href="/#rubric" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Rubric</Link>
          <Link href="/#projects" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Projects</Link>
          <Link href="/ideas" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Ideas</Link>
          <Link href="/guide" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Guide</Link>
          <Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
        </nav>
      </div>
    </header>
  );
}
