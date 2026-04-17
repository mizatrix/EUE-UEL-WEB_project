import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { submitIdea } from './actions'
import styles from './ideas.module.css'
import Link from 'next/link'

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const error = resolvedParams?.error as string | undefined
  const success = resolvedParams?.success as string | undefined

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch approved & instructor ideas
  const { data: ideas } = await supabase
    .from('project_ideas')
    .select('*')
    .order('created_at', { ascending: false })

  const instructorIdeas = ideas?.filter(i => i.is_instructor_idea) ?? []
  const studentIdeas = ideas?.filter(i => !i.is_instructor_idea) ?? []

  return (
    <div className={styles.ideasPage}>
      <Header />

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <i className="fa-solid fa-lightbulb"></i> Open for Submissions
          </span>
          <h1 className={styles.title}>Project Ideas</h1>
          <p className={styles.subtitle}>
            Browse instructor-proposed ideas or submit your own custom project idea for approval.
          </p>
        </div>
      </section>

      {/* Instructor-Proposed Ideas */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-chalkboard-user"></i>
            Instructor-Proposed Ideas
          </h2>
          {instructorIdeas.length > 0 ? (
            <div className={styles.ideasGrid}>
              {instructorIdeas.map(idea => (
                <div key={idea.id} className={styles.ideaCard}>
                  <div className={styles.ideaIcon} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className={styles.ideaBody}>
                    <h3 className={styles.ideaTitle}>{idea.title}</h3>
                    <p className={styles.ideaDesc}>{idea.description}</p>
                    <div className={styles.ideaMeta}>
                      <span className={`${styles.ideaTag} ${styles.tagInstructor}`}>
                        <i className="fa-solid fa-check-circle"></i> Instructor
                      </span>
                      <span className={`${styles.ideaTag} ${styles.tagApproved}`}>
                        <i className="fa-solid fa-circle-check"></i> Pre-Approved
                      </span>
                      {idea.category && (
                        <span className={`${styles.ideaTag} ${styles.tagStudent}`}>{idea.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-clock"></i>
              <p>Instructor ideas will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Student-Proposed Ideas */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-users"></i>
            Student-Proposed Ideas
          </h2>
          {studentIdeas.length > 0 ? (
            <div className={styles.ideasGrid}>
              {studentIdeas.map(idea => (
                <div key={idea.id} className={styles.ideaCard}>
                  <div className={styles.ideaIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <div className={styles.ideaBody}>
                    <h3 className={styles.ideaTitle}>{idea.title}</h3>
                    <p className={styles.ideaDesc}>{idea.description}</p>
                    <div className={styles.ideaMeta}>
                      <span className={`${styles.ideaTag} ${styles.tagStudent}`}>
                        <i className="fa-solid fa-user"></i> Student
                      </span>
                      <span className={`${styles.ideaTag} ${idea.status === 'approved' ? styles.tagApproved : styles.tagPending}`}>
                        <i className={`fa-solid ${idea.status === 'approved' ? 'fa-circle-check' : 'fa-clock'}`}></i>
                        {idea.status === 'approved' ? 'Approved' : idea.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </span>
                      {idea.category && (
                        <span className={`${styles.ideaTag} ${styles.tagInstructor}`}>{idea.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-lightbulb"></i>
              <p>No student ideas yet. Be the first to propose one!</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Your Idea */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-paper-plane"></i>
            Submit Your Idea
          </h2>

          {user ? (
            <div className={styles.proposalCard}>
              <div className={styles.proposalHeader}>
                <i className="fa-solid fa-rocket"></i>
                <h3>Propose a Custom Project</h3>
              </div>

              {error && (
                <div className={`${styles.alert} ${styles.alertError}`}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {error}
                </div>
              )}
              {success && (
                <div className={`${styles.alert} ${styles.alertSuccess}`}>
                  <i className="fa-solid fa-circle-check"></i> {success}
                </div>
              )}

              <form>
                <div className={styles.formGroup}>
                  <label>Project Title <span className={styles.required}>*</span></label>
                  <input name="title" required placeholder="e.g. Cybersecurity Risk Assessment Tool" />
                </div>
                <div className={styles.formGroup}>
                  <label>Category <span className={styles.required}>*</span></label>
                  <select name="category" required>
                    <option value="">— Choose a Category —</option>
                    <option value="Security Tools">Security Tools</option>
                    <option value="Dashboards">Dashboards & Monitoring</option>
                    <option value="Education">Education & Awareness</option>
                    <option value="Utility">Utility & Productivity</option>
                    <option value="Full-Stack Apps">Full-Stack Applications</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Description <span className={styles.required}>*</span></label>
                  <textarea name="description" rows={4} required placeholder="Describe your project idea, what problem it solves, and what features it would include..." />
                </div>
                <button formAction={submitIdea} className={styles.submitBtn}>
                  <i className="fa-solid fa-paper-plane"></i> Submit Idea
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.loginPrompt}>
              <i className="fa-solid fa-lock" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block', color: '#6366f1' }}></i>
              <p>You must be logged in to submit an idea.</p>
              <Link href="/login">Log in with your institutional email →</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
