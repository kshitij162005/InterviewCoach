import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim())

function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <h1>InterviewCoach</h1>
        <p className="auth-subtitle">Choose an option to continue</p>
        <div className="auth-actions">
          <button className="auth-btn" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="auth-btn" onClick={() => navigate('/signup')}>
            Signup
          </button>
        </div>
      </section>
    </main>
  )
}

type AuthMode = 'login' | 'signup'

function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()

  const onGoogleSuccess = (response: CredentialResponse) => {
    // Next step: send response.credential to backend for verification/session creation.
    console.log(`${mode} success`, response)
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <h1>{mode === 'login' ? 'Login' : 'Signup'}</h1>
        <p className="auth-subtitle">Continue with Google</p>

        <div className="google-wrap">
          {hasGoogleClientId ? (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => console.error(`Google ${mode} failed`)}
              text={mode === 'login' ? 'signin_with' : 'signup_with'}
              width="280"
            />
          ) : (
            <p className="auth-warning">
              Missing VITE_GOOGLE_CLIENT_ID. Add it in your environment variables.
            </p>
          )}
        </div>

        <button className="auth-link" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
