import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import DetectionPage from './pages/DetectionPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedType, setSelectedType] = useState(null)

  const navigate = (page, type = null) => {
    setSelectedType(type)
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={navigate} />
      )}
      {currentPage === 'detect' && (
        <DetectionPage type={selectedType} onBack={() => navigate('dashboard')} />
      )}
    </div>
  )
}