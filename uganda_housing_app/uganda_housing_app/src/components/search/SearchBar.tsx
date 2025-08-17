import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, SlidersHorizontal, MapPin, X, MapTrifold as Map, List } from '@phosphor-icons/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { DISTRICTS, AMENITIES } from '@/lib/types'

interface SearchFilters {
  query: string
  district: string
  minPrice: number
  maxPrice: number
  bedrooms: string
  amenities: string[]
}

interface SearchBarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  showMapToggle?: boolean
  isMapView?: boolean
  onMapToggle?: () => void
}

export function SearchBar({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  showMapToggle = false,
  isMapView = false,
  onMapToggle
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      district: '',
      minPrice: 0,
      maxPrice: 10000000,
      bedrooms: '',
      amenities: []
    })
  }

  const activeFiltersCount = [
    filters.district,
    filters.bedrooms,
    filters.minPrice > 0 || filters.maxPrice < 10000000,
    filters.amenities.length > 0
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search by location, property name..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        
        {showMapToggle && (
          <Button 
            variant={isMapView ? "default" : "outline"}
            onClick={onMapToggle}
            className="shrink-0"
          >
            {isMapView ? <List size={16} className="mr-2" /> : <Map size={16} className="mr-2" />}
            {isMapView ? 'List' : 'Map'}
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative shrink-0"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        <Button onClick={onSearch} className="shrink-0">
          Search
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={filters.district} onValueChange={(value) => updateFilter('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 bedroom</SelectItem>
                    <SelectItem value="2">2 bedrooms</SelectItem>
                    <SelectItem value="3">3 bedrooms</SelectItem>
                    <SelectItem value="4">4+ bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Price Range (UGX)</Label>
              <div className="px-3">
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => {
                    updateFilter('minPrice', min)
                    updateFilter('maxPrice', max)
                  }}
                  min={0}
                  max={10000000}
                  step={50000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>UGX {filters.minPrice.toLocaleString()}</span>
                <span>UGX {filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('amenities', [...filters.amenities, amenity])
                        } else {
                          updateFilter('amenities', filters.amenities.filter(a => a !== amenity))
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
      )}
    </div>
  )
}
