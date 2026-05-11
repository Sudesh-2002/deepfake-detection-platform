import { useState, useEffect } from 'react'
import { checkHealth } from '../services/api'

export default function BackendStatus() {
  const [status, setStatus] = useState('checking') // checking | online | offline

  useEffect(() => {
    checkHealth()
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'))
  }, [])

  if (status === 'checking') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse"></span>
        Connecting…
      </span>
    )
  }

  if (status === 'offline') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
        Backend offline — run <code className="bg-white/10 px-1 rounded">uvicorn main:app --reload</code>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-green-400">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
      Backend connected
    </span>
  )
}