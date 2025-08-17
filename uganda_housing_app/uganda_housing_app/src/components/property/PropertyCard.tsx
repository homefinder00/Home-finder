import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bathtub as Bath, 
  WifiHigh as Wifi, 
  Car, 
  Shield, 
  Phone,
  Calendar,
  Scales,
  Share
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { toast } from 'sonner'

interface PropertyCardProps {
  property: Property
  onContact?: (propertyId: string) => void
  onSave?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  onScheduleTour?: (propertyId: string) => void
  onAddToComparison?: (property: Property) => void
  onShare?: (propertyId: string) => void
  isSaved?: boolean
  isInComparison?: boolean
  canAddToComparison?: boolean
  guestMode?: boolean
}

export function PropertyCard({ 
  property, 
  onContact, 
  onSave, 
  onView, 
  onScheduleTour,
  onAddToComparison,
  onShare,
  isSaved, 
  isInComparison = false,
  canAddToComparison = true,
  guestMode = false 
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Security': Shield,
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNTAgMTUwSDM1MFYyNTBIMjUwVjE1MFoiIGZpbGw9IiNEMUQxRDEiLz4KPHN2ZyB4PSIyNzUiIHk9IjE3NSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOTk5OTk5Ij4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIxMCIvPgo8L3N2Zz4KPC9zdmc+'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex space-x-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
        
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => onSave?.(property.id)}
          >
            <Heart 
              size={16} 
              className={isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
            />
          </Button>
        )}

        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90">
            {property.currency} {property.price.toLocaleString()}/month
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {property.location.address}, {property.location.district}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Bed size={16} />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath size={16} />
              <span>{property.bathrooms} bath</span>
            </div>
          </div>

          {property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity]
                return (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {Icon && <Icon size={12} className="mr-1" />}
                    {amenity}
                  </Badge>
                )
              })}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">by {property.landlordName}</span>
              {property.landlordVerified && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <Shield size={10} className="mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView?.(property.id)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onContact?.(property.id)}
            >
              <Phone size={16} className="mr-1" />
              Contact
            </Button>
          </div>

          {/* Additional Action Buttons */}
          <div className="flex space-x-1 pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onScheduleTour?.(property.id)}
            >
              <Calendar size={14} className="mr-1" />
              Tour
            </Button>
            
            {canAddToComparison && !isInComparison && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => onAddToComparison?.(property)}
              >
                <Scales size={14} className="mr-1" />
                Compare
              </Button>
            )}
            
            {isInComparison && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs text-green-600"
                disabled
              >
                <Scales size={14} className="mr-1" />
                In Compare
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onShare?.(property.id)}
            >
              <Share size={14} className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PropertyGridProps {
  properties: Property[]
  onContact?: (propertyId: string) => void
  onSave?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  onScheduleTour?: (propertyId: string) => void
  onAddToComparison?: (property: Property) => void
  onShare?: (propertyId: string) => void
  savedProperties?: string[]
  comparisonProperties?: Property[]
  canAddToComparison?: boolean
  guestMode?: boolean
}

export function PropertyGrid({ 
  properties, 
  onContact, 
  onSave, 
  onView, 
  onScheduleTour,
  onAddToComparison,
  onShare,
  savedProperties = [],
  comparisonProperties = [],
  canAddToComparison = true,
  guestMode = false
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-2">🏠</div>
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm">Try adjusting your search filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onContact={onContact}
          onSave={onSave}
          onView={onView}
          onScheduleTour={onScheduleTour}
          onAddToComparison={onAddToComparison}
          onShare={onShare}
          isSaved={savedProperties.includes(property.id)}
          isInComparison={comparisonProperties.some(p => p.id === property.id)}
          canAddToComparison={canAddToComparison}
          guestMode={guestMode}
        />
      ))}
    </div>
  )
}
