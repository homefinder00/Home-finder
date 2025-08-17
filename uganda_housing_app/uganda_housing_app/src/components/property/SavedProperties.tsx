/**
 * Saved Properties Component
 * Manages user's saved properties with offline support
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PropertyGrid } from '@/components/property/PropertyCard'
import { PropertyDetails } from '@/components/property/PropertyDetails'
import { 
  Heart, 
  MagnifyingGlass as Search, 
  SortAscending, 
  MapPin,
  Clock,
  WifiHigh as Wifi,
  WifiSlash,
  Download,
  Trash as Trash2,
  ArrowLeft
} from '@phosphor-icons/react'
import { useOfflineStorage, useNetworkStatus } from '@/lib/offlineStorage'
import { Property } from '@/lib/types'
import { toast } from 'sonner'

type SavedPropertiesTab = 'list' | 'details'
type SortOption = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'title-asc'

interface SavedPropertiesProps {
  userId: string
  onBack?: () => void
  onContact?: (propertyId: string) => void
}

export function SavedProperties({ userId, onBack, onContact }: SavedPropertiesProps) {
  const [activeTab, setActiveTab] = useState<SavedPropertiesTab>('list')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [isLoadingOffline, setIsLoadingOffline] = useState(false)

  const { 
    getSavedProperties, 
    unsaveProperty, 
    offlineData,
    savePropertyOffline,
    removePropertyOffline
  } = useOfflineStorage()
  
  const { isOnline, networkStatus } = useNetworkStatus()

  const savedProperties = getSavedProperties(userId)

  // Filter and sort saved properties
  const filteredAndSortedProperties = savedProperties
    .filter(property => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        property.title.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query) ||
        property.location.district.toLowerCase().includes(query) ||
        property.amenities.some(amenity => amenity.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'title-asc':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleUnsaveProperty = (propertyId: string) => {
    unsaveProperty(userId, propertyId)
    toast.success('Property removed from saved list')
  }

  const handleViewDetails = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setActiveTab('details')
  }

  const handleBackToList = () => {
    setActiveTab('list')
    setSelectedPropertyId(null)
  }

  const handleDownloadForOffline = async (property: Property) => {
    setIsLoadingOffline(true)
    try {
      // Save property data offline
      savePropertyOffline(property)
      
      // Simulate downloading images for offline access
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Property downloaded for offline viewing')
    } catch (error) {
      toast.error('Failed to download property for offline viewing')
    } finally {
      setIsLoadingOffline(false)
    }
  }

  const handleRemoveOffline = (propertyId: string) => {
    removePropertyOffline(propertyId)
    toast.success('Property removed from offline storage')
  }

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'date-desc': return 'Newest First'
      case 'date-asc': return 'Oldest First'
      case 'price-asc': return 'Price: Low to High'
      case 'price-desc': return 'Price: High to Low'
      case 'title-asc': return 'Title: A to Z'
      default: return 'Sort'
    }
  }

  const selectedProperty = selectedPropertyId 
    ? savedProperties.find(p => p.id === selectedPropertyId) 
    : null

  if (activeTab === 'details' && selectedProperty) {
    return (
      <PropertyDetails
        property={selectedProperty}
        onBack={handleBackToList}
        onContact={onContact}
        showSaveButton={false}
        additionalActions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnsaveProperty(selectedProperty.id)}
              className="text-destructive hover:text-destructive"
            >
              <Heart size={16} className="mr-1 fill-current" />
              Unsave
            </Button>
            {!isOnline && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadForOffline(selectedProperty)}
                disabled={isLoadingOffline}
              >
                <Download size={16} className="mr-1" />
                {isLoadingOffline ? 'Downloading...' : 'Offline'}
              </Button>
            )}
          </div>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Heart size={24} className="text-primary" />
              <span>Saved Properties</span>
            </h1>
            <p className="text-muted-foreground">
              {savedProperties.length} saved properties
            </p>
          </div>
        </div>

        {/* Network Status */}
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Wifi size={12} />
              <span>Online</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center space-x-1">
              <WifiSlash size={12} />
              <span>Offline</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Empty State */}
      {savedProperties.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Heart size={32} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">No Saved Properties</h3>
                <p className="text-muted-foreground">
                  Properties you save will appear here for easy access
                </p>
              </div>
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  Browse Properties
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      {savedProperties.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search saved properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <SortAscending size={16} className="text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Title: A to Z</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            {searchQuery && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedProperties.length} of {savedProperties.length} properties match "{searchQuery}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Properties Grid */}
      {filteredAndSortedProperties.length > 0 && (
        <div className="space-y-4">
          {filteredAndSortedProperties.map((property) => {
            const isOfflineAvailable = offlineData.properties.some(p => p.id === property.id)
            
            return (
              <Card key={property.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Property Image */}
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <MapPin size={24} className="text-muted-foreground" />
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {property.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center mb-2">
                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {property.location.address}, {property.location.district}
                            </span>
                          </p>
                          <p className="text-primary font-semibold">
                            {property.currency} {property.price.toLocaleString()}/month
                          </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end space-y-2">
                          {isOfflineAvailable && (
                            <Badge variant="secondary" className="text-xs">
                              <Download size={10} className="mr-1" />
                              Offline
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Clock size={10} className="mr-1" />
                            Saved {new Date(property.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {/* Property Features */}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        {property.amenities.slice(0, 2).map(amenity => (
                          <span key={amenity}>{amenity}</span>
                        ))}
                        {property.amenities.length > 2 && (
                          <span>+{property.amenities.length - 2} more</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewDetails(property.id)}
                        >
                          View Details
                        </Button>
                        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onContact?.(property.id)}
          disabled={!onContact}
        >
          Contact
        </Button>

                        {!isOfflineAvailable && !isOnline && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadForOffline(property)}
                            disabled={isLoadingOffline}
                          >
                            <Download size={14} className="mr-1" />
                            {isLoadingOffline ? 'Downloading...' : 'Offline'}
                          </Button>
                        )}

                        {isOfflineAvailable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveOffline(property.id)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove Offline
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsaveProperty(property.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Heart size={14} className="mr-1 fill-current" />
                          Unsave
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredAndSortedProperties.length === 0 && savedProperties.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">No Properties Found</h3>
                <p className="text-muted-foreground">
                  No saved properties match your search criteria
                </p>
              </div>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Storage Info */}
      {!isOnline && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <WifiSlash size={20} className="text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">Offline Mode</h4>
                <p className="text-sm text-yellow-700">
                  You're viewing cached data. Some features may be limited until you're back online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
