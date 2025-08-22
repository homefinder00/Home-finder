import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { hasSavedCredentials, getSavedCredentials, clearSavedCredentials } from '@/lib/api'
import { toast } from 'sonner'
import { Shield, Trash2, Clock, Check } from '@phosphor-icons/react'

interface SavedCredentialsManagerProps {
  className?: string
}

export function SavedCredentialsManager({ className }: SavedCredentialsManagerProps) {
  const [hasCredentials, setHasCredentials] = useState(false)
  const [credentialInfo, setCredentialInfo] = useState<{ email: string; lastUsed: string } | null>(null)

  const checkCredentials = () => {
    const hasStored = hasSavedCredentials()
    setHasCredentials(hasStored)
    
    if (hasStored) {
      try {
        const savedData = localStorage.getItem('saved_credentials')
        if (savedData) {
          const parsed = JSON.parse(savedData)
          setCredentialInfo({
            email: parsed.email,
            lastUsed: new Date(parsed.lastUsed).toLocaleDateString()
          })
        }
      } catch (error) {
        console.error('Error parsing saved credentials:', error)
      }
    } else {
      setCredentialInfo(null)
    }
  }

  useEffect(() => {
    checkCredentials()
  }, [])

  const handleClearCredentials = () => {
    clearSavedCredentials()
    toast.success('Saved credentials cleared successfully')
    checkCredentials()
  }

  if (!hasCredentials) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Credential Management
          </CardTitle>
          <CardDescription>
            No saved credentials found. Enable "Remember me" during login to save your credentials securely.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} />
          Saved Credentials
        </CardTitle>
        <CardDescription>
          Your login credentials are securely stored for automatic sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span className="font-medium">Email: {credentialInfo?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>Last used: {credentialInfo?.lastUsed}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </div>
        
        <div className="pt-2 border-t">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClearCredentials}
            className="flex items-center gap-2"
          >
            <Trash2 size={14} />
            Clear Saved Credentials
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will require you to enter your credentials manually on next login.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
