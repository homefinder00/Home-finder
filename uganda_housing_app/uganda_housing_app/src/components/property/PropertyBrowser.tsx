import { useState, useEffect } from 'react'
import { apiFetch, contactLandlord } from '@/lib/api'
import { useAuth, useIsLoggedIn, useUser } from '@/lib/auth'
import { AuthModal } from '@/components/auth/AuthModal'
import { PropertyGrid } from '@/components/property/PropertyCard'
import { PropertyDetails } from '@/components/property/PropertyDetails'
import { SavedProperties } from '@/components/property/SavedProperties'
import { SearchBar } from '@/components/search/SearchBar'
// import { RecentSearches, saveRecentSearch } from '@/components/search/RecentSearches'
// import { PropertyComparison, usePropertyComparison } from '@/components/property/PropertyComparison'
// import { PropertyTourScheduler } from '@/components/property/PropertyTourScheduler'
import { PropertiesMap } from '@/components/map/PropertiesMap'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { 
  House, 
  MagnifyingGlass, 
  Phone,
  UserPlus,
  Buildings,
  Heart,
  WifiHigh,
  WifiNone,
  SignOut,
  User
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { useOfflineStorage, useNetworkStatus } from '@/lib/offlineStorage'
// import { useInitializeSampleData } from '@/lib/sampleData'
import { toast } from 'sonner'

// Global flag to prevent multiple fetches
let globalPropertiesLoaded = false;
let globalProperties: Property[] = [];

// Clear cache on startup to ensure fresh data
globalPropertiesLoaded = false;
globalProperties = [];

type BrowserTab = 'home' | 'search' | 'details' | 'saved'

interface PropertyBrowserProps {
  onLandlordSignup?: () => void
}

export function PropertyBrowser({ onLandlordSignup }: PropertyBrowserProps) {
  const [activeTab, setActiveTab] = useState<BrowserTab>('home')
  const [previousTab, setPreviousTab] = useState<BrowserTab>('home')
  // const { properties, setProperties } = useInitializeSampleData()
  const [properties, setProperties] = useState<Property[]>(globalProperties) // Initialize with global properties
  const [contactDialog, setContactDialog] = useState<string | null>(null)
  const [userPhone, setUserPhone] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapView, setIsMapView] = useState(false)
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([])
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

  // Authentication hooks
  const { login: authLogin, logout: authLogout } = useAuth()
  const isLoggedIn = useIsLoggedIn()
  const user = useUser()
  const userId = user?.id.toString() || `guest-${Date.now()}`

  // Load comparison properties from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('propertyComparison') || '[]')
    setComparisonProperties(saved)
  }, [])

  // Fetch properties from backend - only once with global state management
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProperties() {
      // Check global state first
      if (globalPropertiesLoaded && globalProperties.length > 0) {
        console.log('Using global properties cache');
        setProperties(globalProperties);
        return;
      }
      
      if (properties.length > 0) {
        console.log('Properties already loaded in component, skipping fetch');
        return; // Don't fetch if we already have data
      }
      
      try {
        console.log('Fetching properties from API...');
        setIsLoading(true);
        const data = await apiFetch('/properties');
        if (isMounted && Array.isArray(data)) {
          console.log(`Loaded ${data.length} properties`);
          setProperties(data);
          // Update global state
          globalProperties = data;
          globalPropertiesLoaded = true;
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch properties:', error);
          toast.error('Failed to fetch properties from backend');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    // Only fetch once on component mount
    fetchProperties();
    
    return () => {
      isMounted = false;
    };
  }, []) // Empty dependency array ensures this only runs once

  // Authentication handlers
  const handleAuthSuccess = (userData: any) => {
    authLogin(userData)
    toast.success(`Welcome ${userData.name}!`)
  }

  const handleLogout = async () => {
    await authLogout()
    toast.success('Logged out successfully')
  }

  const handleLandlordSignup = () => {
    if (onLandlordSignup) {
      onLandlordSignup()
    } else {
      setAuthModalTab('register')
      setAuthModalOpen(true)
    }
  }

  // Property comparison functionality - commented out temporarily
  // const {
  //   comparisonProperties,
  //   showComparison,
  //   setShowComparison,
  //   addToComparison,
  //   removeFromComparison,
  //   isInComparison,
  //   canAddMore
  // } = usePropertyComparison()

  const { 
    saveProperty, 
    unsaveProperty, 
    isPropertySaved, 
    getSavedProperties,
    savePropertyOffline 
  } = useOfflineStorage()
  
  const { isOnline, initNetworkDetection } = useNetworkStatus()

  // Initialize network detection
  useEffect(() => {
    const cleanup = initNetworkDetection()
    return cleanup
  }, [initNetworkDetection])

  // Cache all properties for offline access - only when properties array changes
  useEffect(() => {
    if (properties.length > 0) {
      properties.forEach(property => {
        savePropertyOffline(property)
      })
    }
  }, [properties, savePropertyOffline])

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

  const handleContactLandlord = (propertyId: string) => {
    setContactDialog(propertyId)
  }

  const handleViewDetails = (propertyId: string) => {
    setPreviousTab(activeTab)
    setSelectedPropertyId(propertyId)
    setActiveTab('details')
  }

  const handleBackFromDetails = () => {
    setActiveTab(previousTab)
    setSelectedPropertyId(null)
  }

  const handleSendContact = async () => {
    if (!userPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    if (!isLoggedIn) {
      toast.error('Please login to contact landlord')
      setAuthModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      await contactLandlord(contactDialog!, userPhone)
      toast.success('Contact details sent to landlord! They will call you soon.')
      setContactDialog(null)
      setUserPhone('')
    } catch (error) {
      toast.error('Failed to send contact details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPreviousTab(activeTab)
    setActiveTab('search')
    setIsMapView(false) // Reset to list view when starting new search
  }

  const handleSaveProperty = (propertyId: string) => {
    if (isPropertySaved(userId, propertyId)) {
      unsaveProperty(userId, propertyId)
      toast.success('Property removed from saved list')
    } else {
      saveProperty(userId, propertyId)
      toast.success('Property saved for later')
    }
  }

  // New feature handlers - commented out temporarily
  const handleScheduleTour = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      toast.success(`Tour scheduled for ${property.title}! Landlord will be contacted.`)
      // Here you could open a tour scheduler modal
    }
  }

  const handleAddToComparison = (property: Property) => {
    // Simple comparison logic - store in localStorage for now
    const existingComparison = JSON.parse(localStorage.getItem('propertyComparison') || '[]')
    
    if (existingComparison.some((p: Property) => p.id === property.id)) {
      toast.info(`${property.title} is already in comparison`)
      return
    }
    
    if (existingComparison.length >= 3) {
      toast.error('Maximum 3 properties can be compared at once')
      return
    }
    
    const updatedComparison = [...existingComparison, property]
    localStorage.setItem('propertyComparison', JSON.stringify(updatedComparison))
    setComparisonProperties(updatedComparison) // Update state
    toast.success(`${property.title} added to comparison (${updatedComparison.length}/3)`)
  }

  const handleShare = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      if (navigator.share) {
        navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location.district} - ${property.currency} ${property.price.toLocaleString()}/month`,
          url: window.location.href + `?property=${propertyId}`
        })
      } else {
        // Fallback: copy to clipboard
        const shareText = `Check out this property: ${property.title} in ${property.location.district} - ${property.currency} ${property.price.toLocaleString()}/month`
        navigator.clipboard.writeText(shareText)
        toast.success('Property details copied to clipboard!')
      }
    }
  }

  // const handleRecentSearchSelect = (search: any) => {
  //   setSearchFilters({
  //     ...searchFilters,
  //     ...search.filters,
  //     query: search.query
  //   })
  //   setActiveTab('search')
  // }

  // const handleSearchSubmit = () => {
  //   // Save the current search to recent searches
  //   saveRecentSearch({
  //     query: searchFilters.query,
  //     filters: {
  //       district: searchFilters.district,
  //       bedrooms: searchFilters.bedrooms,
  //       minPrice: searchFilters.minPrice,
  //       maxPrice: searchFilters.maxPrice
  //     },
  //     resultCount: filteredProperties.length
  //   })
  // }

  const savedPropertiesCount = getSavedProperties(userId).length

  const selectedProperty = contactDialog ? properties.find(p => p.id === contactDialog) : null
  const selectedPropertyForDetails = selectedPropertyId ? properties.find(p => p.id === selectedPropertyId) : null

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                Find Your Perfect Home in Uganda
              </h1>
              <p className="text-muted-foreground">
                Browse thousands of rental properties across Uganda
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
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setPreviousTab(activeTab)
                      setActiveTab('search')
                      setIsMapView(true)
                    }}
                    className="text-xs"
                  >
                    🗺️ Map View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setPreviousTab(activeTab)
                      setActiveTab('search')
                    }}
                  >
                    View All
                  </Button>
                </div>
              </div>
              
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <div className="text-4xl mb-2">🏠</div>
                    <p className="text-lg font-medium">No properties available</p>
                    <p className="text-sm">Check back later for new listings</p>
                  </div>
                </div>
              ) : (
                <PropertyGrid
                  properties={properties.slice(0, 6)}
                  onContact={handleContactLandlord}
                  onView={handleViewDetails}
                  onSave={handleSaveProperty}
                  onScheduleTour={handleScheduleTour}
                  onAddToComparison={handleAddToComparison}
                  onShare={handleShare}
                  savedProperties={getSavedProperties(userId).map(p => p.id)}
                  comparisonProperties={comparisonProperties}
                  canAddToComparison={comparisonProperties.length < 3}
                  guestMode={!isLoggedIn}
                />
              )}
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
              showMapToggle={true}
              isMapView={isMapView}
              onMapToggle={() => setIsMapView(!isMapView)}
            />

            {isMapView ? (
              filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-lg font-medium">No properties found in this area</p>
                    <p className="text-sm">Try adjusting your search filters</p>
                  </div>
                </div>
              ) : (
                <PropertiesMap
                  properties={filteredProperties}
                  height="500px"
                  onPropertyView={handleViewDetails}
                  onPropertyContact={handleContactLandlord}
                />
              )
            ) : (
              <PropertyGrid
                properties={filteredProperties}
                onContact={handleContactLandlord}
                onView={handleViewDetails}
                onSave={handleSaveProperty}
                onScheduleTour={handleScheduleTour}
                onAddToComparison={handleAddToComparison}
                onShare={handleShare}
                savedProperties={getSavedProperties(userId).map(p => p.id)}
                comparisonProperties={comparisonProperties}
                canAddToComparison={comparisonProperties.length < 3}
                guestMode={!isLoggedIn}
              />
            )}
          </div>
        )

      case 'details':
        if (!selectedPropertyForDetails) {
          return (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Property not found</p>
              <Button 
                variant="outline" 
                onClick={handleBackFromDetails}
                className="mt-4"
              >
                Back to Home
              </Button>
            </div>
          )
        }
        
        return (
          <PropertyDetails
            property={selectedPropertyForDetails}
            onBack={handleBackFromDetails}
            onContact={handleContactLandlord}
            onSave={handleSaveProperty}
            isSaved={isPropertySaved(userId, selectedPropertyForDetails.id)}
            guestMode={!isLoggedIn}
          />
        )

      case 'saved':
        return (
          <SavedProperties
            userId={userId}
            onBack={() => setActiveTab('home')}
            onContact={handleContactLandlord}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with authentication */}
  <div className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Buildings size={24} className="text-primary" />
            <h1 className="font-bold text-lg">Uganda Housing</h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Network Status */}
            <Badge variant={isOnline ? "secondary" : "outline"} className="text-xs">
              {isOnline ? (
                <><WifiHigh size={12} className="mr-1" />Online</>
              ) : (
                <><WifiNone size={12} className="mr-1" />Offline</>
              )}
            </Badge>
            
            {/* Authentication Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <User size={12} className="mr-1" />
                  {user?.name}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <SignOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setAuthModalTab('login')
                    setAuthModalOpen(true)
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLandlordSignup}
                  className="flex items-center space-x-1"
                >
                  <UserPlus size={16} />
                  <span>List Property</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab !== 'details' && (
          <div className="p-4">
            {renderContent()}
          </div>
        )}
        {activeTab === 'details' && renderContent()}
      </div>

      {/* Bottom Navigation - Hide on details view */}
      {activeTab !== 'details' && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setPreviousTab(activeTab)
                setActiveTab('home')
              }}
              className="flex-col h-auto py-2"
            >
              <House size={20} className="mb-1" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant={activeTab === 'search' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setPreviousTab(activeTab)
                setActiveTab('search')
              }}
              className="flex-col h-auto py-2"
            >
              <MagnifyingGlass size={20} className="mb-1" />
              <span className="text-xs">Search</span>
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setPreviousTab(activeTab)
                setActiveTab('saved')
              }}
              className="flex-col h-auto py-2 relative"
            >
              <Heart size={20} className="mb-1" />
              <span className="text-xs">Saved</span>
              {savedPropertiesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center">
                  {savedPropertiesCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Contact Dialog */}
      <Dialog open={!!contactDialog} onOpenChange={() => setContactDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Landlord</DialogTitle>
            <DialogDescription>
              Interested in {selectedProperty?.title}? Provide your phone number and the landlord will contact you directly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{selectedProperty?.title}</p>
              <p className="text-sm text-muted-foreground">
                UGX {selectedProperty?.price.toLocaleString()}/month
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedProperty?.location.address}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Phone Number</label>
              <Input
                placeholder="e.g. +256 700 123456"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                type="tel"
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setContactDialog(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendContact}
                className="flex-1"
                disabled={isLoading}
              >
                <Phone size={16} className="mr-2" />
                {isLoading ? 'Sending...' : 'Send Contact Info'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom spacing - only when bottom navigation is visible */}
      {activeTab !== 'details' && <div className="h-20" />}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
      />
    </div>
  )
}
