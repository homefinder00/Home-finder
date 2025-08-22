import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { fetchProperties } from '@/lib/api'
import { PropertyGrid } from '@/components/property/PropertyCard'
import { SearchBar } from '@/components/search/SearchBar'
import { MessagesScreen } from '@/components/messaging/MessagesScreen'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  House, 
  MagnifyingGlass, 
  ChatCircle, 
  User, 
  Heart,
  MapPin,
  Plus,
  Bell,
  SignOut
} from '@phosphor-icons/react'
import { Property, SavedProperty } from '@/lib/types'
import { toast } from 'sonner'

type TenantTab = 'home' | 'search' | 'messages' | 'saved' | 'profile'

interface TenantDashboardProps {
  onLogout: () => void
}

export function TenantDashboard({ onLogout }: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState<TenantTab>('home')
  const [properties, setProperties] = useState<Property[]>([])
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load properties from API
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true)
        const response = await fetchProperties()
        if (response.success && response.data) {
          setProperties(response.data)
        }
      } catch (error) {
        console.error('Failed to load properties:', error)
        toast.error('Failed to load properties')
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [])

  // Load saved properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_properties')
    if (saved) {
      setSavedProperties(JSON.parse(saved))
    }
  }, [])

  // Save properties to localStorage when changed
  useEffect(() => {
    localStorage.setItem('saved_properties', JSON.stringify(savedProperties))
  }, [savedProperties])

  const [searchFilters, setSearchFilters] = useState({
    query: '',
    district: '',
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: '',
    amenities: [] as string[]
  })

  const filteredProperties = properties.filter(property => {
    if (!property.available) return false
    
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      if (
        !property.title.toLowerCase().includes(query) &&
        !property.location.address.toLowerCase().includes(query) &&
        !property.location.district.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (searchFilters.district && property.location.district !== searchFilters.district) {
      return false
    }

    if (property.price < searchFilters.minPrice || property.price > searchFilters.maxPrice) {
      return false
    }

    if (searchFilters.bedrooms) {
      const bedrooms = parseInt(searchFilters.bedrooms)
      if (bedrooms === 4 ? property.bedrooms < 4 : property.bedrooms !== bedrooms) {
        return false
      }
    }

    if (searchFilters.amenities.length > 0) {
      if (!searchFilters.amenities.every(amenity => property.amenities.includes(amenity))) {
        return false
      }
    }

    return true
  })

  const userSavedProperties = savedProperties
    .filter(sp => sp.userId === user?.id.toString())
    .map(sp => sp.propertyId)

  const savedPropertyList = properties.filter(p => 
    userSavedProperties.includes(p.id)
  )

  const handleSaveProperty = (propertyId: string) => {
    if (!user) return

    const isAlreadySaved = userSavedProperties.includes(propertyId)
    
    if (isAlreadySaved) {
      setSavedProperties((current) => 
        current.filter(sp => !(sp.userId === user.id.toString() && sp.propertyId === propertyId))
      )
      toast.success('Property removed from saved')
    } else {
      const newSave: SavedProperty = {
        userId: user.id.toString(),
        propertyId,
        savedAt: new Date().toISOString()
      }
      setSavedProperties((current) => [...current, newSave])
      toast.success('Property saved')
    }
  }

  const handleContactLandlord = (propertyId: string) => {
    toast.success('Starting conversation with landlord')
    setActiveTab('messages')
  }

  const handleSearch = () => {
    setActiveTab('search')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground">
                Find your perfect home in Uganda
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                onSearch={handleSearch}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Featured Properties</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('search')}
                >
                  View All
                </Button>
              </div>
              
              <PropertyGrid
                properties={properties.slice(0, 6)}
                onContact={handleContactLandlord}
                onSave={handleSaveProperty}
                savedProperties={userSavedProperties}
              />
            </div>
          </div>
        )

      case 'search':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Search Properties</h1>
              <p className="text-muted-foreground">
                Found {filteredProperties.length} properties
              </p>
            </div>

            <SearchBar
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              onSearch={() => {}}
            />

            <PropertyGrid
              properties={filteredProperties}
              onContact={handleContactLandlord}
              onSave={handleSaveProperty}
              savedProperties={userSavedProperties}
            />
          </div>
        )

      case 'messages':
        return <MessagesScreen />

      case 'saved':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Saved Properties</h1>
              <p className="text-muted-foreground">
                {savedPropertyList.length} saved properties
              </p>
            </div>

            <PropertyGrid
              properties={savedPropertyList}
              onContact={handleContactLandlord}
              onSave={handleSaveProperty}
              savedProperties={userSavedProperties}
            />
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="text-2xl">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.phone}</p>
              <Badge variant="outline" className="mt-2">
                {user?.email_verified_at ? 'Verified Account' : 'Unverified'}
              </Badge>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell size={16} className="mr-2" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart size={16} className="mr-2" />
                Saved Properties ({savedPropertyList.length})
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
          </div>
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
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex-col h-auto py-2"
          >
            <House size={20} className="mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('search')}
            className="flex-col h-auto py-2"
          >
            <MagnifyingGlass size={20} className="mb-1" />
            <span className="text-xs">Search</span>
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
            variant={activeTab === 'saved' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('saved')}
            className="flex-col h-auto py-2"
          >
            <Heart size={20} className="mb-1" />
            <span className="text-xs">Saved</span>
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