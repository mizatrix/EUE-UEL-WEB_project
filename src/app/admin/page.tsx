import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Authenticate user and verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'instructor') {
    redirect('/dashboard')
  }

  // Fetch all submissions with team details
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      teams ( team_name, project_id, members ),
      profiles!submitted_by ( full_name, student_id )
    `)
    .order('created_at', { ascending: false })

  return (
    <>
      <header className="glass-nav">
        <div className="container">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="logo">
              <i className="fa-solid fa-code"></i> EUE | UEL <span>Web Dev Hub</span>
            </h1>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/#projects">Projects</Link>
            <form action="/auth/signout" method="post" style={{ display: 'inline' }}>
              <button className="btn secondary-btn" type="submit" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.4rem' }}></i> Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <div className="section-header">
          <div>
            <span className="badge" style={{ marginBottom: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.15)' }}>Instructor Panel</span>
            <h2 style={{ marginTop: '0.5rem' }}>Submission Review</h2>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>
            <i className="fa-solid fa-clipboard-list" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            All Submissions
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Team</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Project</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Link</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {submissions?.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                    No submissions found yet.
                  </td>
                </tr>
              ) : (
                submissions?.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                     <td style={{ padding: '1rem' }}>
                      <strong>{sub.teams?.team_name}</strong><br/>
                      <small style={{ color: 'var(--text-muted)' }}>by: {sub.profiles?.full_name || 'Unknown'}</small>
                    </td>
                    <td style={{ padding: '1rem' }}>ID: {sub.teams?.project_id}</td>
                    <td style={{ padding: '1rem' }}>
                      <a href={sub.github_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="fa-brands fa-github"></i> View Code
                      </a>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        background: sub.status === 'graded' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                        color: sub.status === 'graded' ? '#10b981' : '#f59e0b',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <form action="/actions/grade-submission" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input type="hidden" name="submission_id" value={sub.id} />
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input type="number" name="grade" placeholder="0-100" min={0} max={100} defaultValue={sub.grade} style={{ width: '75px', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#1e293b', textAlign: 'center' }} />
                          <button type="submit" className="btn primary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </div>
                        <input type="text" name="feedback" placeholder="Feedback..." defaultValue={sub.feedback || ''} style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#1e293b', fontSize: '0.8rem' }} />
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
