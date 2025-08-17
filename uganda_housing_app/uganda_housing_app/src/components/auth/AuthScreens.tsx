import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { House, User, ArrowLeft, Shield } from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface WelcomeScreenProps {
  onNext: (role: 'tenant' | 'landlord') => void
  onBack?: () => void
  landlordOnly?: boolean
}

export function WelcomeScreen({ onNext, onBack, landlordOnly = false }: WelcomeScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | null>(
    landlordOnly ? 'landlord' : null
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {onBack && (
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="mr-auto"
              >
                <ArrowLeft size={16} />
              </Button>
            </div>
          )}
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <House size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {landlordOnly ? 'List Your Property' : 'Uganda Housing Finder'}
          </CardTitle>
          <p className="text-muted-foreground">
            {landlordOnly 
              ? 'Create an account to start listing your properties'
              : 'Find your perfect home or list your property'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {!landlordOnly && (
              <>
                <Label className="text-base font-medium">Choose your role</Label>
                
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRole === 'tenant' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedRole('tenant')}
                >
                  <CardContent className="p-4 flex items-center space-x-3">
                    <User size={24} className="text-primary" />
                    <div className="flex-1">
                      <h3 className="font-medium">I'm looking for a place</h3>
                      <p className="text-sm text-muted-foreground">
                        Search and rent properties
                      </p>
                    </div>
                    {selectedRole === 'tenant' && (
                      <Badge variant="default" className="bg-primary">
                        Selected
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {landlordOnly && (
              <Label className="text-base font-medium">Landlord Account Setup</Label>
            )}

            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === 'landlord' ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedRole('landlord')}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <House size={24} className="text-primary" />
                <div className="flex-1">
                  <h3 className="font-medium">I have properties to rent</h3>
                  <p className="text-sm text-muted-foreground">
                    List and manage properties
                  </p>
                </div>
                {selectedRole === 'landlord' && (
                  <Badge variant="default" className="bg-primary">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedRole}
            onClick={() => selectedRole && onNext(selectedRole)}
          >
            Continue
          </Button>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield size={16} />
            <span>Secure • Verified • Trusted</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SignUpScreenProps {
  role: 'tenant' | 'landlord'
  onBack: () => void
  onNext: (phone: string, name: string) => void
}

export function SignUpScreen({ role, onBack, onNext }: SignUpScreenProps) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !name) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('OTP sent to your phone!')
    onNext(phone, name)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-xl">Create Account</CardTitle>
              <p className="text-sm text-muted-foreground">
                As a {role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+256 700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send you an OTP to verify your number
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!phone || !name || isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface OTPScreenProps {
  phone: string
  name: string
  role: 'tenant' | 'landlord'
  onBack: () => void
  onComplete: () => void
}

export function OTPScreen({ phone, name, role, onBack, onComplete }: OTPScreenProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 4) return

    setIsLoading(true)
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create user account
    const user = {
      id: Date.now().toString(),
      phone,
      name,
      role,
      verified: true
    }
    
    login(user)
    toast.success('Account created successfully!')
    onComplete()
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-xl">Verify Phone</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the 4-digit code sent to {phone}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-center text-2xl tracking-widest"
                maxLength={4}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={otp.length !== 4 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm">
                Resend OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}