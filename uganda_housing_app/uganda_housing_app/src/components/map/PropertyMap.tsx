import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/lib/types'
import { createCustomMarker, injectMarkerStyles } from './CustomMarker'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface PropertyMapProps {
  property: Property
  height?: string
  className?: string
}

export function PropertyMap({ property, height = '300px', className = '' }: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    injectMarkerStyles()
  }, [])

  return (
    <div className={`rounded-lg overflow-hidden border bg-muted ${className}`} style={{ height }}>
      <MapContainer
        center={[property.location.latitude, property.location.longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[property.location.latitude, property.location.longitude]}
          icon={createCustomMarker(property.price, property.currency)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {property.location.address}, {property.location.district}
              </p>
              <p className="text-sm font-medium text-primary">
                {property.currency} {property.price.toLocaleString()}/month
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}