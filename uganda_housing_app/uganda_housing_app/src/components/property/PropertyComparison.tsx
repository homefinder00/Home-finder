import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Scales, 
  X, 
  MapPin, 
  Bed, 
  Bathtub as Bath, 
  CurrencyDollar,
  Check,
  Minus,
  Star
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'

interface PropertyComparisonProps {
  properties: Property[]
  isOpen: boolean
  onClose: () => void
  onRemoveProperty: (propertyId: string) => void
  onContactProperty: (propertyId: string) => void
}

export function PropertyComparison({ 
  properties, 
  isOpen, 
  onClose, 
  onRemoveProperty, 
  onContactProperty 
}: PropertyComparisonProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UGX',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getUniqueAmenities = () => {
    const allAmenities = properties.flatMap(p => p.amenities)
    return [...new Set(allAmenities)]
  }

  const hasAmenity = (property: Property, amenity: string) => {
    return property.amenities.includes(amenity)
  }

  const getBestValue = () => {
    if (properties.length === 0) return null
    return properties.reduce((best, current) => 
      current.price < best.price ? current : best
    )
  }

  const bestValue = getBestValue()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scales className="h-5 w-5" />
            Property Comparison ({properties.length}/3)
          </DialogTitle>
          <DialogDescription>
            Compare up to 3 properties side by side to make the best choice
          </DialogDescription>
        </DialogHeader>

        {properties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No properties selected for comparison</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click the compare button on property cards to add them here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[800px]">
              {properties.map((property) => (
                <Card key={property.id} className="relative">
                  {bestValue?.id === property.id && (
                    <Badge className="absolute -top-2 left-4 bg-green-500 text-white z-10">
                      <Star className="h-3 w-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
                    onClick={() => onRemoveProperty(property.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="pb-3">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-3">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Price</h4>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Location</h4>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location.address}
                      </p>
                      <p className="text-xs text-muted-foreground">{property.location.district}</p>
                    </div>

                    {/* Room Details */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Room Details</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span className="text-sm">{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span className="text-sm">{property.bathrooms}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Amenities</h4>
                      <div className="space-y-1">
                        {getUniqueAmenities().map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2">
                            {hasAmenity(property, amenity) ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Minus className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={`text-xs ${
                              hasAmenity(property, amenity) 
                                ? 'text-foreground' 
                                : 'text-muted-foreground line-through'
                            }`}>
                              {amenity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Landlord */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Landlord</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{property.landlordName}</span>
                        {property.landlordVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => onContactProperty(property.id)}
                    >
                      Contact Landlord
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Comparison state hook
export function usePropertyComparison() {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const addToComparison = (property: Property) => {
    if (comparisonProperties.length >= 3) {
      return false // Max 3 properties
    }
    
    if (comparisonProperties.find(p => p.id === property.id)) {
      return false // Already added
    }

    setComparisonProperties(prev => [...prev, property])
    return true
  }

  const removeFromComparison = (propertyId: string) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId))
  }

  const clearComparison = () => {
    setComparisonProperties([])
    setShowComparison(false)
  }

  const isInComparison = (propertyId: string) => {
    return comparisonProperties.some(p => p.id === propertyId)
  }

  return {
    comparisonProperties,
    showComparison,
    setShowComparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore: comparisonProperties.length < 3
  }
}
