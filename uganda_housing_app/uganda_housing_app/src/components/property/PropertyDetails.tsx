import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PropertyMap } from '@/components/map/PropertyMap'
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Bed, 
  Bathtub as Bath, 
  WifiHigh as Wifi, 
  Car, 
  Shield,
  Heart,
  Share,
  Calendar
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { toast } from 'sonner'

interface PropertyDetailsProps {
  property: Property
  onBack: () => void
  onContact?: (propertyId: string) => void
  onSave?: (propertyId: string) => void
  isSaved?: boolean
  showSaveButton?: boolean
  additionalActions?: React.ReactNode
  guestMode?: boolean
}

export function PropertyDetails({ 
  property, 
  onBack, 
  onContact, 
  onSave,
  isSaved = false,
  showSaveButton = true,
  additionalActions,
  guestMode = false 
}: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showCalendarDialog, setShowCalendarDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Security': Shield,
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} - ${property.currency} ${property.price.toLocaleString()}/month`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(window.location.href)
      toast.success('Property link copied to clipboard!')
    }
    setShowShareDialog(false)
  }

  const handleBookViewing = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time for your viewing')
      return
    }
    
    toast.success('Viewing request sent! The landlord will confirm your appointment.')
    setShowCalendarDialog(false)
    setSelectedDate('')
    setSelectedTime('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            {showSaveButton && onSave && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSave(property.id)}
              >
                <Heart 
                  size={16} 
                  className={isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
                />
              </Button>
            )}
            {additionalActions}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Property Video */}
        {property.video && (
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] bg-black flex items-center justify-center">
              <video controls className="w-full h-full object-contain">
                <source src={property.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Card>
        )}
        {/* Image Gallery */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="aspect-[16/10] bg-muted overflow-hidden">
              {property.images.length > 0 ? (
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-lg">No image available</span>
                </div>
              )}
            </div>
            {property.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {currentImageIndex + 1} / {property.images.length}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Property Info */}
        <div className="space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <Badge variant="secondary" className="text-lg font-semibold">
                {property.currency} {property.price.toLocaleString()}/month
              </Badge>
            </div>
            
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin size={16} className="mr-1" />
              {property.location.address}, {property.location.district}
            </div>

            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Bed size={18} />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath size={18} />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity]
                    return (
                      <div key={amenity} className="flex items-center space-x-2">
                        {Icon && <Icon size={16} className="text-primary" />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Landlord Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Landlord</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{property.landlordName}</span>
                  {property.landlordVerified && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <Shield size={10} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{property.location.address}, {property.location.district}</span>
                </div>
                <PropertyMap 
                  property={property} 
                  height="250px"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Actions */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => onContact?.(property.id)}
              disabled={!onContact}
            >
              <Phone size={18} className="mr-2" />
              Contact Landlord
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => setShowCalendarDialog(true)}
            >
              <Calendar size={18} className="mr-2" />
              Book a Viewing
            </Button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Property</DialogTitle>
            <DialogDescription>
              Share this property with friends and family
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{property.title}</p>
              <p className="text-sm text-muted-foreground">
                {property.currency} {property.price.toLocaleString()}/month
              </p>
            </div>

            <Button onClick={handleShare} className="w-full">
              <Share size={16} className="mr-2" />
              Share Property
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Viewing Dialog */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Viewing</DialogTitle>
            <DialogDescription>
              Schedule a time to view {property.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{property.title}</p>
              <p className="text-sm text-muted-foreground">
                {property.location.address}, {property.location.district}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Time</label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCalendarDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookViewing}
                className="flex-1"
              >
                <Calendar size={16} className="mr-2" />
                Book Viewing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-20" />
    </div>
  )
}
