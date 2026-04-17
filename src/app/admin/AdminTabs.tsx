'use client'

import { useState } from 'react'
import styles from './admin.module.css'

interface Team {
  id: string
  team_name: string
  project_id: number
  members: string[]
  created_at: string
  projectTitle: string
  projectCategory: string
  submissions?: Submission[]
}

interface Submission {
  id: string
  github_url: string
  status: string
  grade: number | null
  feedback: string | null
  created_at: string
  teams?: {
    team_name: string
    project_id: number
    members: string[]
  }
  projectTitle: string
}

interface Student {
  id: string
  full_name: string
  student_id: string | null
  role: string
  created_at: string
}

interface Idea {
  id: string
  title: string
  description: string
  category: string | null
  status: string
  is_instructor_idea: boolean
  created_at: string
}

interface ProjectData {
  id: number
  title: string
  category: string
}

export default function AdminTabs({
  teams,
  submissions,
  students,
  ideas,
  projectsData,
}: {
  teams: Team[]
  submissions: Submission[]
  students: Student[]
  ideas: Idea[]
  projectsData: ProjectData[]
}) {
  const [activeTab, setActiveTab] = useState<'teams' | 'submissions' | 'students' | 'ideas'>('teams')
  const [searchTerm, setSearchTerm] = useState('')

  // CSV export helpers
  const downloadCSV = (data: string[][], filename: string) => {
    const csvContent = data.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  const exportTeamsCSV = () => {
    const header = ['Team Name', 'Project ID', 'Project Title', 'Category', 'Members', 'Registered At']
    const rows = teams.map(t => [
      t.team_name,
      String(t.project_id),
      t.projectTitle,
      t.projectCategory,
      (t.members || []).join('; '),
      new Date(t.created_at).toLocaleDateString(),
    ])
    downloadCSV([header, ...rows], 'teams_export.csv')
  }

  const exportSubmissionsCSV = () => {
    const header = ['Team Name', 'Project Title', 'GitHub URL', 'Status', 'Grade', 'Feedback', 'Submitted At']
    const rows = submissions.map(s => [
      s.teams?.team_name || '',
      s.projectTitle,
      s.github_url,
      s.status,
      s.grade !== null ? String(s.grade) : 'Not graded',
      s.feedback || '',
      new Date(s.created_at).toLocaleDateString(),
    ])
    downloadCSV([header, ...rows], 'submissions_export.csv')
  }

  const exportStudentsCSV = () => {
    const header = ['Full Name', 'Student ID', 'Role', 'Registered At']
    const rows = students.map(s => [
      s.full_name || 'Unknown',
      s.student_id || '',
      s.role,
      new Date(s.created_at).toLocaleDateString(),
    ])
    downloadCSV([header, ...rows], 'students_export.csv')
  }

  // Filter logic
  const filteredTeams = teams.filter(t =>
    t.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.members || []).some((m: string) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredSubmissions = submissions.filter(s =>
    (s.teams?.team_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.github_url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredStudents = students.filter(s =>
    (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.student_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredIdeas = ideas.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { key: 'teams' as const, label: 'Teams', icon: 'fa-users', count: teams.length },
    { key: 'submissions' as const, label: 'Submissions', icon: 'fa-code-branch', count: submissions.length },
    { key: 'students' as const, label: 'Students', icon: 'fa-graduation-cap', count: students.length },
    { key: 'ideas' as const, label: 'Ideas', icon: 'fa-lightbulb', count: ideas.length },
  ]

  return (
    <>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
            onClick={() => { setActiveTab(tab.key); setSearchTerm('') }}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search + Export Bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-search" style={{ color: '#94a3b8' }}></i>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === 'teams' && (
          <button className={styles.exportBtn} onClick={exportTeamsCSV}>
            <i className="fa-solid fa-file-csv"></i> Export CSV
          </button>
        )}
        {activeTab === 'submissions' && (
          <button className={styles.exportBtn} onClick={exportSubmissionsCSV}>
            <i className="fa-solid fa-file-csv"></i> Export CSV
          </button>
        )}
        {activeTab === 'students' && (
          <button className={styles.exportBtn} onClick={exportStudentsCSV}>
            <i className="fa-solid fa-file-csv"></i> Export CSV
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>

        {/* ========== TEAMS TAB ========== */}
        {activeTab === 'teams' && (
          <>
            <h3 className={styles.panelTitle}>
              <i className="fa-solid fa-users"></i>
              Registered Teams
            </h3>
            {filteredTeams.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-inbox"></i>
                <p>No teams registered yet.</p>
              </div>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team Name</th>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Members</th>
                    <th>Submitted</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team, idx) => (
                    <tr key={team.id}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <strong style={{ color: '#6366f1' }}>{team.team_name}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{team.projectTitle}</span>
                        <br/>
                        <small style={{ color: '#94a3b8' }}>ID: {team.project_id}</small>
                      </td>
                      <td>
                        <span className={styles.categoryTag}>{team.projectCategory}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {(team.members || []).map((m: string, i: number) => (
                            <span key={i} className={styles.memberChip}>
                              <i className="fa-solid fa-user" style={{ fontSize: '0.65rem' }}></i>
                              {m}
                            </span>
                          ))}
                          {(!team.members || team.members.length === 0) && (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No members listed</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {team.submissions && team.submissions.length > 0 ? (
                          <span className={styles.statusBadge} data-status="submitted">
                            <i className="fa-solid fa-check"></i> Yes
                          </span>
                        ) : (
                          <span className={styles.statusBadge} data-status="pending">
                            <i className="fa-solid fa-clock"></i> No
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(team.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ========== SUBMISSIONS TAB ========== */}
        {activeTab === 'submissions' && (
          <>
            <h3 className={styles.panelTitle}>
              <i className="fa-solid fa-code-branch"></i>
              All Submissions
            </h3>
            {filteredSubmissions.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-inbox"></i>
                <p>No submissions found yet.</p>
              </div>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Project</th>
                    <th>GitHub</th>
                    <th>Status</th>
                    <th>Grade & Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <strong>{sub.teams?.team_name}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{sub.projectTitle}</td>
                      <td>
                        <a
                          href={sub.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                        >
                          <i className="fa-brands fa-github"></i> View Code
                        </a>
                      </td>
                      <td>
                        <span className={styles.statusBadge} data-status={sub.status === 'graded' ? 'graded' : 'pending'}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <form action="/actions/grade-submission" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input type="hidden" name="submission_id" value={sub.id} />
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="number"
                              name="grade"
                              placeholder="0-100"
                              min={0}
                              max={100}
                              defaultValue={sub.grade ?? undefined}
                              className={styles.gradeInput}
                            />
                            <button type="submit" className={styles.gradeBtn}>
                              <i className="fa-solid fa-check"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            name="feedback"
                            placeholder="Feedback..."
                            defaultValue={sub.feedback || ''}
                            className={styles.feedbackInput}
                          />
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ========== STUDENTS TAB ========== */}
        {activeTab === 'students' && (
          <>
            <h3 className={styles.panelTitle}>
              <i className="fa-solid fa-graduation-cap"></i>
              Registered Students
            </h3>
            {filteredStudents.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-user-slash"></i>
                <p>No students registered yet.</p>
              </div>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Student ID</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                      <td><strong>{student.full_name || 'Unknown'}</strong></td>
                      <td style={{ fontFamily: 'monospace', color: '#6366f1' }}>{student.student_id || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ========== IDEAS TAB ========== */}
        {activeTab === 'ideas' && (
          <>
            <h3 className={styles.panelTitle}>
              <i className="fa-solid fa-lightbulb"></i>
              Project Ideas
            </h3>
            {filteredIdeas.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-lightbulb"></i>
                <p>No ideas submitted yet.</p>
              </div>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.map(idea => (
                    <tr key={idea.id}>
                      <td><strong>{idea.title}</strong></td>
                      <td>
                        <span className={styles.categoryTag}>{idea.category || 'General'}</span>
                      </td>
                      <td>
                        <span className={styles.statusBadge} data-status={idea.is_instructor_idea ? 'graded' : 'pending'}>
                          {idea.is_instructor_idea ? 'Instructor' : 'Student'}
                        </span>
                      </td>
                      <td>
                        <span className={styles.statusBadge} data-status={idea.status === 'approved' ? 'graded' : 'pending'}>
                          {idea.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: '300px', color: '#64748b' }}>
                        {idea.description?.substring(0, 120)}{idea.description?.length > 120 ? '...' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  )
}
