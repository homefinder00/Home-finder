import { useState, useEffect } from 'react'
import { AuthProvider, useAuth, useIsLoggedIn, useUser, useIsLandlord } from '@/lib/auth'
// import { useInitializeSampleData } from '@/lib/sampleData' // Removed to prevent API conflicts
import { useNetworkStatus } from '@/lib/offlineStorage'
import { PropertyBrowser } from '@/components/property/PropertyBrowser'
import { LandlordDashboard } from '@/components/landlord/LandlordDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import { Toaster } from 'sonner'

import './index.css'; // Make sure Tailwind CSS is imported

type AppMode = 'browse' | 'landlord-dashboard'

function MainApp() {
  const [appMode, setAppMode] = useState<AppMode>('browse')
  const { logout } = useAuth()
  const isLoggedIn = useIsLoggedIn()
  const user = useUser()
  const isLandlord = useIsLandlord()
  const { initNetworkDetection } = useNetworkStatus()

  // Removed sample data initialization - now using backend data only

  // Initialize network detection
  useEffect(() => {
    const cleanup = initNetworkDetection()
    return cleanup
  }, [initNetworkDetection])

  // Automatically switch to landlord dashboard if user is logged in and is a landlord
  useEffect(() => {
    if (isLoggedIn && isLandlord) {
      setAppMode('landlord-dashboard')
    } else {
      setAppMode('browse')
    }
  }, [isLoggedIn, isLandlord])

  // Show Landlord Dashboard if user is authenticated and is a landlord
  if (appMode === 'landlord-dashboard' && isLoggedIn && isLandlord) {
    return <LandlordDashboard onLogout={() => {
      logout()
      setAppMode('browse')
    }} />
  }

  // Default: Property Browser (accessible to everyone)
  return (
    <PropertyBrowser />
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <MainApp />
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  )
}

export default App