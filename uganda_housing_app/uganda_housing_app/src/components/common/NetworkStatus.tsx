/**
 * Network Status Component
 * Shows the current network connectivity status with offline mode indicators
 */

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Wifi, 
  WifiSlash, 
  CloudArrowUp, 
  Warning,
  CheckCircle,
  Clock
} from '@phosphor-icons/react'
import { useNetworkStatus, useOfflineStorage } from '@/lib/offlineStorage'
import { toast } from 'sonner'

interface NetworkStatusProps {
  showDetails?: boolean
  className?: string
}

export function NetworkStatus({ showDetails = false, className = '' }: NetworkStatusProps) {
  const { isOnline, networkStatus } = useNetworkStatus()
  const { pendingPhotos, offlineData } = useOfflineStorage()
  const [showOfflineInfo, setShowOfflineInfo] = useState(false)

  const pendingUploads = pendingPhotos.filter(photo => photo.status === 'pending')
  const hasOfflineData = offlineData.properties.length > 0 || offlineData.savedProperties.length > 0

  // Auto-hide offline info when back online
  useEffect(() => {
    if (isOnline && showOfflineInfo) {
      setTimeout(() => setShowOfflineInfo(false), 3000)
    }
  }, [isOnline, showOfflineInfo])

  const handleSyncData = async () => {
    // Simulate syncing offline data
    toast.loading('Syncing offline data...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Data synced successfully!')
  }

  if (!showDetails) {
    // Simple badge version
    return (
      <Badge 
        variant={isOnline ? "secondary" : "outline"} 
        className={`text-xs ${className}`}
        onClick={() => setShowOfflineInfo(true)}
      >
        {isOnline ? (
          <><Wifi size={12} className="mr-1" />Online</>
        ) : (
          <><WifiSlash size={12} className="mr-1" />Offline</>
        )}
      </Badge>
    )
  }

  // Detailed offline info panel
  if (!isOnline && (showOfflineInfo || hasOfflineData)) {
    return (
      <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WifiSlash size={20} className="text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Offline Mode</h4>
                  <p className="text-sm text-yellow-700">
                    Limited functionality until connection is restored
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOfflineInfo(false)}
                className="text-yellow-700 hover:text-yellow-800"
              >
                ×
              </Button>
            </div>

            {/* Offline data summary */}
            {hasOfflineData && (
              <div className="bg-yellow-100 rounded-lg p-3 space-y-2">
                <h5 className="font-medium text-yellow-800 text-sm">Available Offline:</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {offlineData.properties.length > 0 && (
                    <Badge variant="outline" className="bg-white/50">
                      {offlineData.properties.length} Properties
                    </Badge>
                  )}
                  {offlineData.savedProperties.length > 0 && (
                    <Badge variant="outline" className="bg-white/50">
                      {offlineData.savedProperties.length} Saved
                    </Badge>
                  )}
                  {Object.keys(offlineData.photos).length > 0 && (
                    <Badge variant="outline" className="bg-white/50">
                      {Object.keys(offlineData.photos).length} Photos
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Pending uploads */}
            {pendingUploads.length > 0 && (
              <div className="bg-blue-100 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Clock size={14} />
                  <span className="text-sm font-medium">
                    {pendingUploads.length} items waiting to sync
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Photos and data will upload automatically when online
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Online status with sync button
  if (isOnline && (pendingUploads.length > 0 || showOfflineInfo)) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Back Online</h4>
                <p className="text-sm text-green-700">
                  Connection restored
                </p>
              </div>
            </div>
            {pendingUploads.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncData}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <CloudArrowUp size={14} className="mr-1" />
                Sync ({pendingUploads.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

/**
 * Network Status Hook for Components
 * Provides network status and related functions
 */
export function useNetworkStatusIndicator() {
  const { isOnline, networkStatus } = useNetworkStatus()
  const { pendingPhotos, offlineData } = useOfflineStorage()
  
  const pendingUploads = pendingPhotos.filter(photo => photo.status === 'pending')
  const hasOfflineData = offlineData.properties.length > 0 || offlineData.savedProperties.length > 0
  
  const showSyncIndicator = isOnline && pendingUploads.length > 0
  const showOfflineIndicator = !isOnline && hasOfflineData
  
  return {
    isOnline,
    networkStatus,
    pendingUploads: pendingUploads.length,
    hasOfflineData,
    showSyncIndicator,
    showOfflineIndicator,
    statusText: isOnline ? 'Online' : 'Offline'
  }
}