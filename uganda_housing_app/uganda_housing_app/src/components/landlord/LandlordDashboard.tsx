import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PhotoUpload } from '@/components/property/PhotoUpload'
import { VideoUpload } from '@/components/property/VideoUpload'
import { 
  House, 
  Plus, 
  ChatCircle, 
  CreditCard, 
  User,
  Camera,
  MapPin,
  SignOut,
  Pencil,
  Eye,
  Trash
} from '@phosphor-icons/react'
import { Property, DISTRICTS, AMENITIES } from '@/lib/types'
import { useOfflineStorage, useNetworkStatus } from '@/lib/offlineStorage'
import { toast } from 'sonner'

type LandlordTab = 'dashboard' | 'properties' | 'add-property' | 'messages' | 'payments' | 'profile'

interface LandlordDashboardProps {
  onLogout: () => void
}

export function LandlordDashboard({ onLogout }: LandlordDashboardProps) {
  const [activeTab, setActiveTab] = useState<LandlordTab>('dashboard')
  const [properties, setProperties] = useState<Property[]>([])
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()

  const myProperties = properties.filter(p => p.landlordId === user?.id?.toString())
  const activeProperties = myProperties.filter(p => p.available)
  const totalViews = myProperties.reduce((sum, p) => sum + (Math.floor(Math.random() * 100) + 10), 0)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview properties={myProperties} />
      
      case 'properties':
        return (
          <PropertiesManager 
            properties={myProperties} 
            onEdit={(id) => console.log('Edit', id)}
            onDelete={(id) => {
              setProperties((current) => current.filter(p => p.id !== id))
              toast.success('Property deleted')
            }}
          />
        )
      
      case 'add-property':
        return (
          <AddPropertyForm 
            onSubmit={(property) => {
              setProperties((current) => [...current, property])
              toast.success('Property listed successfully!')
              setActiveTab('properties')
            }}
          />
        )
      
      case 'messages':
        return <div className="p-8 text-center text-muted-foreground">Messages coming soon</div>
      
      case 'payments':
        return <PaymentsOverview />
      
      case 'profile':
        return (
          <ProfileSettings 
            user={user}
            onLogout={onLogout}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="p-4">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="flex items-center justify-around py-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dashboard')}
            className="flex-col h-auto py-2"
          >
            <House size={20} className="mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant={activeTab === 'properties' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('properties')}
            className="flex-col h-auto py-2"
          >
            <House size={20} className="mb-1" />
            <span className="text-xs">Properties</span>
          </Button>
          <Button
            variant={activeTab === 'add-property' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('add-property')}
            className="flex-col h-auto py-2"
          >
            <Plus size={20} className="mb-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('messages')}
            className="flex-col h-auto py-2"
          >
            <ChatCircle size={20} className="mb-1" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="flex-col h-auto py-2"
          >
            <User size={20} className="mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}

function DashboardOverview({ properties }: { properties: Property[] }) {
  const activeProperties = properties.filter(p => p.available)
  const totalViews = properties.reduce((sum, p) => sum + (Math.floor(Math.random() * 100) + 10), 0)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Landlord Dashboard</h1>
        <p className="text-muted-foreground">Manage your properties and tenant inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{activeProperties.length}</p>
              </div>
              <House size={24} className="text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <Eye size={24} className="text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inquiries</p>
                <p className="text-2xl font-bold">{Math.floor(totalViews * 0.1)}</p>
              </div>
              <ChatCircle size={24} className="text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Properties</h2>
        <div className="space-y-3">
          {properties.slice(0, 3).map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <House size={24} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.location.address}, {property.location.district}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {property.currency} {property.price.toLocaleString()}/month
                    </p>
                  </div>
                  <Badge variant={property.available ? 'default' : 'secondary'}>
                    {property.available ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertiesManager({ 
  properties, 
  onEdit, 
  onDelete 
}: { 
  properties: Property[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">{properties.length} total properties</p>
        </div>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <House size={24} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-muted-foreground flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {property.location.address}, {property.location.district}
                      </p>
                      <p className="text-primary font-medium mt-2">
                        {property.currency} {property.price.toLocaleString()}/month
                      </p>
                    </div>
                    <Badge variant={property.available ? 'default' : 'secondary'}>
                      {property.available ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <Button variant="outline" size="sm" onClick={() => onEdit(property.id)}>
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(property.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


import { apiFetch } from '@/lib/api'

function AddPropertyForm({ onSubmit }: { onSubmit: (property: Property) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'UGX' as 'UGX' | 'USD',
    bedrooms: '',
    bathrooms: '',
    address: '',
    district: '',
    amenities: [] as string[],
    video: '' as string // video URL or base64
  })
  const [propertyPhotos, setPropertyPhotos] = useState<string[]>([])
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setCreating(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        bedrooms: parseInt(formData.bedrooms),
        amenities: formData.amenities,
        address: formData.address,
        district: formData.district,
        landlord_name: user.name,
        landlord_phone: user.phone,
        landlord_verified: !!user.email_verified_at,
        available: true,
      }
      const property = await apiFetch('/properties', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      onSubmit(property)
    } catch (error) {
      // Optionally show error toast
    } finally {
      setCreating(false)
    }
  }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Add New Property</h1>
          <p className="text-muted-foreground">List your property for rent</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Spacious 2 Bedroom Apartment"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Plot 123 Ntinda Road"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={value => setFormData({ ...formData, district: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map(district => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your property..."
                  rows={4}
                ></Textarea>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={value => setFormData({ ...formData, bedrooms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={value => setFormData({ ...formData, bathrooms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={value => setFormData({ ...formData, currency: value as 'UGX' | 'USD' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UGX">UGX</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1000000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              amenities: [...formData.amenities, amenity]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              amenities: formData.amenities.filter(a => a !== amenity)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera size={20} />
                <span>Property Photos</span>
                {!isOnline && (
                  <Badge variant="outline" className="text-xs">
                    Offline Mode
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                propertyId={`temp-${Date.now()}`}
                maxPhotos={10}
                onPhotosChange={setPropertyPhotos}
                initialPhotos={propertyPhotos}
              />
              <div className="mt-6">
                <Label>Property Video (optional)</Label>
                <VideoUpload
                  video={formData.video}
                  onVideoChange={video => setFormData({ ...formData, video })}
                  disabled={!isOnline}
                />
                <p className="text-xs text-muted-foreground mt-1">Upload a video file or paste a video URL. For large files, uploading may take time.</p>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" disabled={creating}>{creating ? 'Listing...' : 'List Property'}</Button>
        </form>
      </div>
  )
}

function PaymentsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">Track your rental income</p>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No payments yet</p>
        <p className="text-sm">Payment tracking will appear here once tenants start paying rent</p>
      </div>
    </div>
  )
}

import { useRef } from 'react'

function ProfileSettings({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [showEdit, setShowEdit] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [photo, setPhoto] = useState(user?.photo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    // Here you would update the user profile in your backend or context
    user.name = name
    user.phone = phone
    user.photo = photo
    setShowEdit(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          {photo ? (
            <img src={photo} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <AvatarFallback className="text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-muted-foreground">{user?.phone}</p>
        <Badge variant="outline" className="mt-2">
          Landlord {user?.verified ? '• Verified' : '• Unverified'}
        </Badge>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => setShowEdit(true)}>
          <User size={16} className="mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <CreditCard size={16} className="mr-2" />
          Payment Settings
        </Button>
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={onLogout}
        >
          <SignOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-2">
                {photo ? (
                  <img src={photo} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Upload Photo
              </Button>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
