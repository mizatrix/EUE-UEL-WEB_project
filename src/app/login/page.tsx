import { login, signup } from './actions'
import styles from './login.module.css'
import Header from '@/components/Header'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const error = resolvedParams?.error as string | undefined
  const success = resolvedParams?.success as string | undefined

  return (
    <>
      <Header />

      <div className={styles.pageWrapper}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.lockIcon}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className={styles.cardTitle}>Welcome Back</h2>
            <p className={styles.cardSubtitle}>Sign in to the Web Dev Hub with your institutional email</p>
          </div>

          {error && (
            <div className={styles.alertError}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess}>
              <i className="fa-solid fa-circle-check"></i>
              {success}
            </div>
          )}

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="email">Institutional Email <span className={styles.required}>*</span></label>
              <input id="email" name="email" type="email" required placeholder="name@eue.edu.eg or name@uel.ac.uk" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password <span className={styles.required}>*</span></label>
              <input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <div className={styles.actionButtons}>
              <button formAction={login} className={styles.btnPrimary}>
                <i className="fa-solid fa-right-to-bracket"></i> Log in
              </button>
              <button formAction={signup} className={styles.btnSecondary}>
                <i className="fa-solid fa-user-plus"></i> Sign up
              </button>
            </div>
          </form>

          <p className={styles.footerNote}>
            Accepted: <strong>@eue.edu.eg</strong> · <strong>@uel.ac.uk</strong> · <strong>@student.uel.ac.uk</strong>
          </p>
        </div>
      </div>
    </>
  )
}
