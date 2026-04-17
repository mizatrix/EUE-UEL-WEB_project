import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { registerTeam } from './actions'
import { projectsData } from '@/data/projects'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams

  const error = resolvedParams?.error as string | undefined
  const success = resolvedParams?.success as string | undefined

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch the student's team (as leader)
  const { data: team } = await supabase
    .from('teams')
    .select('*, submissions(*)')
    .eq('leader_id', user.id)
    .single()

  // Fetch all taken project IDs to disable them in the dropdown
  const { data: takenTeams } = await supabase
    .from('teams')
    .select('project_id')

  const takenProjectIds = new Set(takenTeams?.map(t => t.project_id) || [])

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
            <span className="badge" style={{ marginBottom: '0.5rem' }}>Student Dashboard</span>
            <h2 style={{ marginTop: '0.5rem' }}>Welcome, {profile?.full_name || user.email?.split('@')[0]}</h2>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#e11d48', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#059669', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-circle-check"></i>
            {success}
          </div>
        )}

        <div className="grid">
          {/* Team Card */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <div className="modal-icon"><i className="fa-solid fa-users"></i></div>
              <h3>Your Team</h3>
            </div>

            {team ? (
              <div style={{ marginTop: '1rem', flexGrow: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <p><strong>Team Name:</strong> <span style={{ color: 'var(--primary-color)' }}>{team.team_name}</span></p>
                  <p><strong>Project:</strong> {projectsData.find(p => p.id === team.project_id)?.title || `Project #${team.project_id}`}</p>
                  <div>
                    <strong>Members:</strong>
                    {Array.isArray(team.members) && team.members.length > 0 ? (
                      <ul style={{ marginTop: '0.6rem', paddingLeft: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {team.members.map((member: string, i: number) => {
                          const parts = member.split('|').map((p: string) => p.trim())
                          const [name, moodleEmail, eueEmail] = parts.length === 3 ? parts : [member, '', '']
                          return (
                            <li key={i} style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-color)', marginBottom: moodleEmail ? '0.3rem' : 0 }}>
                                <i className="fa-solid fa-user" style={{ marginRight: '0.5rem', fontSize: '0.75rem', color: 'var(--primary-color)' }}></i>
                                {name}
                              </p>
                              {moodleEmail && (
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  <i className="fa-solid fa-envelope" style={{ marginRight: '0.35rem', color: '#818cf8' }}></i>
                                  {moodleEmail}
                                </p>
                              )}
                              {eueEmail && (
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  <i className="fa-solid fa-envelope" style={{ marginRight: '0.35rem', color: '#34d399' }}></i>
                                  {eueEmail}
                                </p>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>No members added</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Team Registration Form */
              <form action={registerTeam} style={{ marginTop: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-info-circle" style={{ marginRight: '0.4rem' }}></i>
                  You haven&apos;t registered a team yet. Fill in the details below:
                </p>
                <div className="form-group">
                  <label htmlFor="team_name">
                    Team Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="team_name"
                    name="team_name"
                    required
                    placeholder="e.g. CyberSquad Alpha"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project_id">
                    Select Project <span className="required">*</span>
                  </label>
                  <select id="project_id" name="project_id" required defaultValue="">
                    <option value="" disabled>-- Choose a Project --</option>
                    {projectsData.map((project) => {
                      const isTaken = takenProjectIds.has(project.id)
                      return (
                        <option key={project.id} value={project.id} disabled={isTaken}>
                          {project.id}. {project.title}{isTaken ? ' (Taken)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="members">
                    Team Members (one per line) &mdash; <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>max 4</span>
                  </label>
                  <textarea
                    id="members"
                    name="members"
                    rows={4}
                    placeholder={"Ahmed Ali - 2110001\nSara Ahmed - 2110002\nOmar Sayed - 2110003\nMona Tarek - 2110004"}
                  ></textarea>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: '0.3rem' }}></i>
                    Enter each member&apos;s name and ID on a separate line. Maximum 4 members allowed.
                  </p>
                </div>
                <button type="submit" className="btn primary-btn submit-btn" style={{ marginTop: 'auto' }}>
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.4rem' }}></i> Register Team
                </button>
              </form>
            )}
          </div>

          {/* Submission Card — only show if team exists */}
          {team && (
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <div className="modal-icon"><i className="fa-solid fa-code"></i></div>
                <h3>Project Submission</h3>
              </div>

              {team.submissions && team.submissions.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>GitHub URL:</strong> <a href={team.submissions[0].github_url} target="_blank" style={{ color: 'var(--primary-color)' }}>{team.submissions[0].github_url}</a></p>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: team.submissions[0].status === 'graded' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)', color: team.submissions[0].status === 'graded' ? '#4ade80' : '#facc15', fontSize: '0.85rem' }}>{team.submissions[0].status}</span></p>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Grade:</strong> {team.submissions[0].grade || 'Not graded yet'}</p>
                  <p><strong>Feedback:</strong> {team.submissions[0].feedback || 'No feedback yet'}</p>
                </div>
              ) : (
                <form style={{ marginTop: '1rem' }} action="/actions/submit-project" method="POST">
                  <input type="hidden" name="team_id" value={team.id} />
                  <div className="form-group">
                    <label htmlFor="github_url">GitHub Repository URL</label>
                    <input type="url" id="github_url" name="github_url" required placeholder="https://github.com/your-username/your-project" />
                  </div>
                  <button type="submit" className="btn primary-btn submit-btn" style={{ marginTop: '0.5rem' }}>
                    <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.4rem' }}></i> Submit Code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
