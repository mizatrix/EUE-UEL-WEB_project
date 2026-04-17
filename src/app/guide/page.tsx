import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './guide.module.css';

const STEPS = [
  { num: '01', icon: 'fa-palette', title: 'Design Your UI with Stitch', color: '#6366f1', items: ['Open Google Stitch and create a new project', 'Design wireframes for all your screens (Home, Dashboard, Login, etc.)', 'Set up a design system: choose colors, fonts, and component styles', 'Export your designs and use them as reference for your build'] },
  { num: '02', icon: 'fa-terminal', title: 'Set Up Your Next.js Project', color: '#0ea5e9', items: ['Run npx create-next-app@latest my-project --typescript', 'Install dependencies: npm install @supabase/supabase-js @supabase/ssr', 'Set up your folder structure: components/, lib/, data/', 'Create your .env.local with Supabase credentials'] },
  { num: '03', icon: 'fa-database', title: 'Create Your Supabase Database', color: '#10b981', items: ['Create a new Supabase project at supabase.com', 'Design your database schema using the Table Editor', 'Enable Row Level Security (RLS) on all tables', 'Set up authentication providers (Email/Password)'] },
  { num: '04', icon: 'fa-cubes', title: 'Build Your Components', color: '#8b5cf6', items: ['Create reusable components: Header, Footer, Cards, Forms', 'Use CSS Modules for component-scoped styling', 'Implement responsive design (mobile-first approach)', 'Add micro-animations and hover effects for polish'] },
  { num: '05', icon: 'fa-shield-halved', title: 'Implement Authentication', color: '#f43f5e', items: ['Set up Supabase Auth with server-side helpers', 'Create login and signup pages with form validation', 'Implement middleware for route protection', 'Add role-based access control (student vs. admin)'] },
  { num: '06', icon: 'fa-server', title: 'Build Your API Routes', color: '#f59e0b', items: ['Create Server Actions for form submissions', 'Implement CRUD operations with Supabase client', 'Add input validation and error handling', 'Use service-role client for admin operations'] },
  { num: '07', icon: 'fa-link', title: 'Connect Frontend to Backend', color: '#06b6d4', items: ['Fetch data using Server Components (async/await)', 'Handle loading and error states gracefully', 'Implement real-time updates where appropriate', 'Add search, filter, and pagination features'] },
  { num: '08', icon: 'fa-wand-magic-sparkles', title: 'Style & Polish Your UI', color: '#ec4899', items: ['Apply your Stitch design system consistently', 'Add glassmorphism, gradients, and modern effects', 'Ensure accessibility: contrast, focus states, semantic HTML', 'Test on multiple screen sizes and browsers'] },
  { num: '09', icon: 'fa-rocket', title: 'Deploy to Vercel', color: '#14b8a6', items: ['Push your code to a GitHub repository', 'Connect your repo to Vercel at vercel.com', 'Add environment variables in Vercel project settings', 'Verify your production build works correctly'] },
  { num: '10', icon: 'fa-paper-plane', title: 'Submit Your Work', color: '#6366f1', items: ['Ensure your GitHub repo has a professional README', 'Include screenshots of your app in the README', 'Go to the Dashboard on this hub and submit your GitHub link', 'Prepare your live demo for presentation day'] },
];

export default function GuidePage() {
  return (
    <div className={styles.guidePage}>
      <Header />

      <section className={styles.guideHero}>
        <div className={styles.guideHeroContent}>
          <span className={styles.guideBadge}>
            <i className="fa-solid fa-map"></i> Step-by-Step
          </span>
          <h1 className={styles.guideTitle}>Web Development Guide</h1>
          <p className={styles.guideSubtitle}>
            Follow these 10 steps to design, build, and deploy your full-stack web application using <strong>Stitch</strong>, <strong>Next.js</strong>, and <strong>Node.js</strong>.
          </p>
          <div className={styles.guideStats}>
            <div className={styles.guideStat}><span>10</span> Steps</div>
            <div className={styles.guideStat}><span>3</span> Tools</div>
            <div className={styles.guideStat}><span>1</span> Project</div>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.container}>
          {STEPS.map((step) => (
            <div key={step.num} className={styles.stepCard} style={{ '--step-color': step.color } as React.CSSProperties}>
              <div className={styles.stepNum} style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)` }}>
                <i className={`fa-solid ${step.icon}`}></i>
                {step.num}
              </div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <ul className={styles.stepList}>
                  {step.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to Build?</h2>
          <p>Choose a project, design in Stitch, and start coding!</p>
          <div className={styles.ctaButtons}>
            <Link href="/#projects" className="btn primary-btn">
              <i className="fa-solid fa-laptop-code"></i> Browse Projects
            </Link>
            <Link href="/ideas" className="btn secondary-btn">
              <i className="fa-solid fa-lightbulb"></i> Propose an Idea
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
