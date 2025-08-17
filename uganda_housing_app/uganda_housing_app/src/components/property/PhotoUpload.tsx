/**
 * Photo Upload Component for Property Listings
 * Supports multiple photos, compression, offline storage, and progress tracking
 */

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Camera, 
  X, 
  Upload, 
  Image as ImageIcon,
  Warning,
  CheckCircle,
  Clock
} from '@phosphor-icons/react'
import { fileToBase64, compressImage, useOfflineStorage } from '@/lib/offlineStorage'
import { toast } from 'sonner'

interface PhotoUploadProps {
  propertyId?: string
  maxPhotos?: number
  onPhotosChange: (photos: string[]) => void
  initialPhotos?: string[]
  disabled?: boolean
}

interface UploadedPhoto {
  id: string
  dataUrl: string
  fileName: string
  fileSize: number
  status: 'uploading' | 'success' | 'error' | 'pending'
  progress: number
}

export function PhotoUpload({ 
  propertyId,
  maxPhotos = 10,
  onPhotosChange,
  initialPhotos = [],
  disabled = false
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(() => 
    initialPhotos.map((dataUrl, index) => ({
      id: `initial-${index}`,
      dataUrl,
      fileName: `photo-${index + 1}.jpg`,
      fileSize: 0,
      status: 'success' as const,
      progress: 100
    }))
  )
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addPendingPhoto, storePhotoOffline } = useOfflineStorage()

  const handlePhotosUpdate = useCallback((updatedPhotos: UploadedPhoto[]) => {
    const successfulPhotos = updatedPhotos
      .filter(photo => photo.status === 'success')
      .map(photo => photo.dataUrl)
    onPhotosChange(successfulPhotos)
  }, [onPhotosChange])

  const processFile = async (file: File): Promise<UploadedPhoto> => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Initial photo object
    const photo: UploadedPhoto = {
      id,
      dataUrl: '',
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading',
      progress: 0
    }

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be smaller than 5MB')
      }

      photo.progress = 25

      // Compress image
      const compressedDataUrl = await compressImage(file, 800, 0.8)
      photo.dataUrl = compressedDataUrl
      photo.progress = 75

      // Store offline if property ID is available
      if (propertyId) {
        const photoIndex = photos.length
        storePhotoOffline(propertyId, photoIndex, compressedDataUrl)
        
        // Add to pending upload queue
        addPendingPhoto({
          propertyId,
          base64Data: compressedDataUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        })
      }

      photo.status = 'success'
      photo.progress = 100

      return photo
    } catch (error) {
      photo.status = 'error'
      photo.progress = 0
      toast.error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return photo
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || disabled) return

    const remainingSlots = maxPhotos - photos.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    if (filesToProcess.length < files.length) {
      toast.warning(`Only ${remainingSlots} more photos can be added (max ${maxPhotos})`)
    }

    const newPhotos: UploadedPhoto[] = []

    for (const file of filesToProcess) {
      const processedPhoto = await processFile(file)
      newPhotos.push(processedPhoto)
    }

    const updatedPhotos = [...photos, ...newPhotos]
    setPhotos(updatedPhotos)
    handlePhotosUpdate(updatedPhotos)
  }

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    setPhotos(updatedPhotos)
    handlePhotosUpdate(updatedPhotos)
    toast.success('Photo removed')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input to allow selecting the same file again
    e.target.value = ''
  }

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getStatusIcon = (status: UploadedPhoto['status']) => {
    switch (status) {
      case 'uploading':
        return <Clock size={16} className="text-blue-500" />
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />
      case 'error':
        return <Warning size={16} className="text-red-500" />
      case 'pending':
        return <Upload size={16} className="text-yellow-500" />
      default:
        return null
    }
  }

  const canAddMore = photos.length < maxPhotos && !disabled

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canAddMore && (
        <Card 
          className={`
            border-dashed transition-colors cursor-pointer
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Camera size={24} className="text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Add Property Photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drop photos here or click to browse
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>• Max {maxPhotos} photos</span>
                  <span>• Up to 5MB each</span>
                  <span>• JPG, PNG supported</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={disabled}
                className="pointer-events-none"
              >
                <ImageIcon size={16} className="mr-2" />
                Choose Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">
              Photos ({photos.length}/{maxPhotos})
            </h4>
            {photos.some(p => p.status === 'error') && (
              <Badge variant="destructive" className="text-xs">
                Some uploads failed
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    {/* Photo Preview */}
                    <div className="w-full h-full bg-muted rounded-md overflow-hidden">
                      {photo.dataUrl ? (
                        <img
                          src={photo.dataUrl}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Status Overlay */}
                    {photo.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                        <div className="text-center text-white">
                          <Clock size={24} className="mx-auto mb-2" />
                          <Progress value={photo.progress} className="w-16 h-2" />
                        </div>
                      </div>
                    )}

                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemovePhoto(photo.id)
                      }}
                      disabled={disabled}
                    >
                      <X size={12} />
                    </Button>

                    {/* Status Badge */}
                    <div className="absolute bottom-1 left-1">
                      <div className="flex items-center space-x-1 bg-black/75 text-white px-2 py-1 rounded text-xs">
                        {getStatusIcon(photo.status)}
                        <span className="capitalize">{photo.status}</span>
                      </div>
                    </div>

                    {/* Photo Index */}
                    <div className="absolute top-1 left-1">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={photo.fileName}>
                      {photo.fileName}
                    </p>
                    {photo.fileSize > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {(photo.fileSize / 1024 / 1024).toFixed(1)} MB
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {photos.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              {photos.filter(p => p.status === 'success').length} photos ready
            </span>
            {photos.some(p => p.status === 'pending') && (
              <span className="text-yellow-600">
                Some photos will sync when online
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}