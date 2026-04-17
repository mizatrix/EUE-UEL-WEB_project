import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { projectsData } from '@/data/projects'
import AdminTabs from './AdminTabs'

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams

  const error = resolvedParams?.error as string | undefined
  const success = resolvedParams?.success as string | undefined

  // Authenticate user and verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'instructor') {
    redirect('/dashboard')
  }

  // Fetch all teams with submissions
  const { data: teams } = await supabase
    .from('teams')
    .select('*, submissions(*)')
    .order('created_at', { ascending: false })

  // Fetch all submissions with team details
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      teams ( team_name, project_id, members )
    `)
    .order('created_at', { ascending: false })

  // Fetch all student profiles
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  // Fetch idea submissions
  const { data: ideas } = await supabase
    .from('project_ideas')
    .select('*')
    .order('created_at', { ascending: false })

  // Stats
  const totalTeams = teams?.length || 0
  const totalSubmissions = submissions?.length || 0
  const gradedCount = submissions?.filter(s => s.status === 'graded').length || 0
  const pendingCount = totalSubmissions - gradedCount
  const totalStudents = students?.length || 0
  const totalIdeas = ideas?.length || 0

  // Enrich teams with project title
  const enrichedTeams = (teams || []).map(team => ({
    ...team,
    projectTitle: projectsData.find(p => p.id === team.project_id)?.title || `Project #${team.project_id}`,
    projectCategory: projectsData.find(p => p.id === team.project_id)?.category || 'Unknown',
  }))

  // Enrich submissions with project title
  const enrichedSubmissions = (submissions || []).map(sub => ({
    ...sub,
    projectTitle: projectsData.find(p => p.id === sub.teams?.project_id)?.title || `Project #${sub.teams?.project_id}`,
  }))

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

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {/* Header */}
        <div className="section-header">
          <div>
            <span className="badge" style={{ marginBottom: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              <i className="fa-solid fa-shield-halved" style={{ marginRight: '0.3rem' }}></i>
              Instructor Panel
            </span>
            <h2 style={{ marginTop: '0.5rem' }}>
              Welcome, {profile?.full_name || user.email?.split('@')[0]}
            </h2>
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

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{totalTeams}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-users" style={{ marginRight: '0.3rem' }}></i>Teams
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{totalSubmissions}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-code-branch" style={{ marginRight: '0.3rem' }}></i>Submissions
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{pendingCount}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-clock" style={{ marginRight: '0.3rem' }}></i>Pending
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{gradedCount}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-check-circle" style={{ marginRight: '0.3rem' }}></i>Graded
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{totalStudents}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.3rem' }}></i>Students
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899' }}>{totalIdeas}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              <i className="fa-solid fa-lightbulb" style={{ marginRight: '0.3rem' }}></i>Ideas
            </div>
          </div>
        </div>

        {/* Tabs */}
        <AdminTabs
          teams={enrichedTeams}
          submissions={enrichedSubmissions}
          students={students || []}
          ideas={ideas || []}
          projectsData={projectsData}
        />
      </div>
    </>
  )
}
