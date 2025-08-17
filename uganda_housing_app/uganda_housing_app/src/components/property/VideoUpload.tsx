import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { VideoCamera } from '@phosphor-icons/react'

interface VideoUploadProps {
  video: string | null
  onVideoChange: (video: string) => void
  disabled?: boolean
}

export function VideoUpload({ video, onVideoChange, disabled = false }: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onVideoChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <VideoCamera size={18} />
        <span>{video ? 'Change Video' : 'Upload Video'}</span>
      </Button>
      {video && (
        <video src={video} controls className="w-full max-h-48 rounded mt-2" />
      )}
    </div>
  )
}
