import { useEffect, useState } from 'react'
import {
  API_BASE_URL,
  ApiRequestError,
  getApiHealth,
  getApiRoot,
  getDatabaseHealth,
} from './api'
import './App.css'

function toUserFriendlyApiError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.kind === 'timeout') {
      return 'Backend timed out. Check if your server is running and reachable.'
    }

    if (error.kind === 'network') {
      return 'Network/CORS issue: backend may be down, wrong API URL, or blocked by CORS.'
    }

    return `Backend returned HTTP ${error.status ?? 'error'}.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error while checking backend.'
}

function App() {
  const [apiMessage, setApiMessage] = useState('Checking backend...')
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>(
    'checking',
  )
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>(
    'checking',
  )
  const [dbDetail, setDbDetail] = useState('Checking database...')

  const checkBackendConnection = async () => {
    setApiStatus('checking')
    setDbStatus('checking')
    setApiMessage('Checking backend...')
    setDbDetail('Checking database...')

    try {
      const [root, health, dbHealth] = await Promise.all([
        getApiRoot(),
        getApiHealth(),
        getDatabaseHealth(),
      ])

      if (health.status === 'ok') {
        setApiStatus('ok')
        setApiMessage(root.message)
      } else {
        setApiStatus('error')
        setApiMessage('Backend responded, but health check failed.')
      }

      if (dbHealth.status === 'ok') {
        setDbStatus('ok')
        setDbDetail('Supabase/Postgres connection is healthy.')
      } else {
        setDbStatus('error')
        setDbDetail(dbHealth.detail || 'Database health check failed.')
      }
    } catch (error) {
      setApiStatus('error')
      setDbStatus('error')
      setApiMessage(toUserFriendlyApiError(error))
      setDbDetail('DB check skipped because API check failed.')
    }
  }

  useEffect(() => {
    void checkBackendConnection()
  }, [])

  return (
    <>
        <div className="backend-status">
          <h2>Backend Connection</h2>
          <p>
            API URL: <code>{API_BASE_URL}</code>
          </p>
          <p>
            API Status:{' '}
            <span className={`status-pill ${apiStatus}`}>
              {apiStatus.toUpperCase()}
            </span>
          </p>
          <p>{apiMessage}</p>
          <p>
            DB Status:{' '}
            <span className={`status-pill ${dbStatus}`}>
              {dbStatus.toUpperCase()}
            </span>
          </p>
          <p>{dbDetail}</p>
          <button className="counter" onClick={() => void checkBackendConnection()}>
            Recheck Backend
          </button>
        </div>
    </>
)}

export default App
