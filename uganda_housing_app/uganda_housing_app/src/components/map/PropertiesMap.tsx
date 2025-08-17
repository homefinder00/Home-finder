import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Phone } from '@phosphor-icons/react'
import { createCustomMarker, injectMarkerStyles } from './CustomMarker'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom hook to fit map bounds to markers
function MapBounds({ properties }: { properties: Property[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (properties.length === 0) return
    
    if (properties.length === 1) {
      // Center on single property
      const property = properties[0]
      map.setView([property.location.latitude, property.location.longitude], 13)
    } else {
      // Fit bounds to all properties
      const bounds = L.latLngBounds(
        properties.map(p => [p.location.latitude, p.location.longitude])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, properties])
  
  return null
}

interface PropertiesMapProps {
  properties: Property[]
  height?: string
  className?: string
  onPropertyView?: (propertyId: string) => void
  onPropertyContact?: (propertyId: string) => void
}

export function PropertiesMap({ 
  properties, 
  height = '400px', 
  className = '',
  onPropertyView,
  onPropertyContact
}: PropertiesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  
  // Default center on Uganda (Kampala)
  const defaultCenter: [number, number] = [0.3136, 32.5811]

  useEffect(() => {
    injectMarkerStyles()
  }, [])

  return (
    <div className={`rounded-lg overflow-hidden border bg-muted ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds properties={properties} />
        
        {properties.map((property) => (
          <Marker 
            key={property.id}
            position={[property.location.latitude, property.location.longitude]}
            icon={createCustomMarker(property.price, property.currency)}
          >
            <Popup maxWidth={280} minWidth={260}>
              <div className="p-3">
                {/* Property Image */}
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                </div>
                
                {/* Property Details */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm leading-tight flex-1 mr-2">
                      {property.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {property.currency} {property.price.toLocaleString()}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {property.location.address}, {property.location.district}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    {property.bedrooms} bed • {property.bathrooms} bath
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs h-8"
                      onClick={() => onPropertyView?.(property.id)}
                    >
                      <Eye size={12} className="mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => onPropertyContact?.(property.id)}
                    >
                      <Phone size={12} className="mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}