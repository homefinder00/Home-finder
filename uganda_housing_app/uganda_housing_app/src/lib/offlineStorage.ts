/**
 * Offline Storage System for Uganda Housing App
 * Handles persistent storage of saved properties, photos, and sync management
 */

import { useState } from 'react'
import { Property, SavedProperty } from './types'

// Types for offline storage
export interface OfflineStorageData {
  properties: Property[]
  savedProperties: SavedProperty[]
  photos: { [key: string]: string } // Base64 encoded photos indexed by propertyId-imageIndex
  lastSync: string
  networkStatus: 'online' | 'offline'
}

export interface PhotoUpload {
  id: string
  propertyId: string
  base64Data: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  status: 'pending' | 'uploaded' | 'failed'
}

// Hook for managing offline storage
export function useOfflineStorage() {
  const [offlineData, setOfflineData] = useState<OfflineStorageData>({
    properties: [],
    savedProperties: [],
    photos: {},
    lastSync: new Date().toISOString(),
    networkStatus: 'online'
  })

  const [pendingPhotos, setPendingPhotos] = useState<PhotoUpload[]>([])

  // Save a property for offline access
  const savePropertyOffline = (property: Property) => {
    setOfflineData((current) => ({
      ...current,
      properties: [
        ...current.properties.filter(p => p.id !== property.id),
        property
      ],
      lastSync: new Date().toISOString()
    }))
  }

  // Remove property from offline storage
  const removePropertyOffline = (propertyId: string) => {
    setOfflineData((current) => ({
      ...current,
      properties: current.properties.filter(p => p.id !== propertyId),
      lastSync: new Date().toISOString()
    }))
  }

  // Save a property to user's saved list
  const saveProperty = (userId: string, propertyId: string) => {
    const savedProperty: SavedProperty = {
      userId,
      propertyId,
      savedAt: new Date().toISOString()
    }

    setOfflineData((current) => ({
      ...current,
      savedProperties: [
        ...current.savedProperties.filter(
          sp => !(sp.userId === userId && sp.propertyId === propertyId)
        ),
        savedProperty
      ],
      lastSync: new Date().toISOString()
    }))
  }

  // Remove property from user's saved list
  const unsaveProperty = (userId: string, propertyId: string) => {
    setOfflineData((current) => ({
      ...current,
      savedProperties: current.savedProperties.filter(
        sp => !(sp.userId === userId && sp.propertyId === propertyId)
      ),
      lastSync: new Date().toISOString()
    }))
  }

  // Check if property is saved by user
  const isPropertySaved = (userId: string, propertyId: string): boolean => {
    return offlineData.savedProperties.some(
      sp => sp.userId === userId && sp.propertyId === propertyId
    )
  }

  // Get all saved properties for a user
  const getSavedProperties = (userId: string): Property[] => {
    const savedPropertyIds = offlineData.savedProperties
      .filter(sp => sp.userId === userId)
      .map(sp => sp.propertyId)
    
    return offlineData.properties.filter(p => savedPropertyIds.includes(p.id))
  }

  // Store photo in offline storage
  const storePhotoOffline = (propertyId: string, imageIndex: number, base64Data: string) => {
    const key = `${propertyId}-${imageIndex}`
    setOfflineData((current) => ({
      ...current,
      photos: {
        ...current.photos,
        [key]: base64Data
      },
      lastSync: new Date().toISOString()
    }))
  }

  // Get photo from offline storage
  const getPhotoOffline = (propertyId: string, imageIndex: number): string | undefined => {
    const key = `${propertyId}-${imageIndex}`
    return offlineData.photos[key]
  }

  // Add photo to pending upload queue
  const addPendingPhoto = (photo: Omit<PhotoUpload, 'id' | 'uploadedAt' | 'status'>) => {
    const photoUpload: PhotoUpload = {
      ...photo,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    }

    setPendingPhotos((current) => [...current, photoUpload])
    return photoUpload.id
  }

  // Update photo upload status
  const updatePhotoStatus = (photoId: string, status: PhotoUpload['status']) => {
    setPendingPhotos((current) =>
      current.map(photo =>
        photo.id === photoId ? { ...photo, status } : photo
      )
    )
  }

  // Remove photo from pending queue
  const removePendingPhoto = (photoId: string) => {
    setPendingPhotos((current) => current.filter(photo => photo.id !== photoId))
  }

  // Get all pending photos for a property
  const getPendingPhotos = (propertyId: string): PhotoUpload[] => {
    return pendingPhotos.filter(photo => photo.propertyId === propertyId)
  }

  // Update network status
  const updateNetworkStatus = (status: 'online' | 'offline') => {
    setOfflineData((current) => ({
      ...current,
      networkStatus: status,
      lastSync: status === 'online' ? new Date().toISOString() : current.lastSync
    }))
  }

  // Clear all offline data (for testing/reset)
  const clearOfflineData = () => {
    setOfflineData({
      properties: [],
      savedProperties: [],
      photos: {},
      lastSync: new Date().toISOString(),
      networkStatus: 'online'
    })
    setPendingPhotos([])
  }

  return {
    // Data
    offlineData,
    pendingPhotos,
    
    // Property management
    savePropertyOffline,
    removePropertyOffline,
    
    // Saved properties
    saveProperty,
    unsaveProperty,
    isPropertySaved,
    getSavedProperties,
    
    // Photo management
    storePhotoOffline,
    getPhotoOffline,
    addPendingPhoto,
    updatePhotoStatus,
    removePendingPhoto,
    getPendingPhotos,
    
    // System
    updateNetworkStatus,
    clearOfflineData
  }
}

// Utility function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = reject
  })
}

// Utility function to compress image
export const compressImage = (
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL(file.type, quality)
      resolve(compressedDataUrl)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Network status detection
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online')
  
  // Initialize network status detection
  const initNetworkDetection = () => {
    const updateStatus = () => {
      const status = navigator.onLine ? 'online' : 'offline'
      setNetworkStatus(status)
    }
    
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    
    // Initial status
    updateStatus()
    
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }
  
  return {
    isOnline: networkStatus === 'online',
    networkStatus,
    initNetworkDetection
  }
}
