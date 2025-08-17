export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'UGX' | 'USD'
  bedrooms: number
  bathrooms: number
  location: {
    address: string
    latitude: number
    longitude: number
    district: string
  }
  images: string[]
  video?: string // URL or path to property video
  amenities: string[]
  landlordId: string
  landlordName: string
  landlordPhone: string
  landlordVerified: boolean
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  content: string
  timestamp: string
  read: boolean
  type: 'text' | 'system'
}

export interface Payment {
  id: string
  tenantId: string
  landlordId: string
  propertyId: string
  amount: number
  currency: 'UGX' | 'USD'
  method: 'MTN' | 'Airtel' | 'Bank'
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
  createdAt: string
}

export interface SavedProperty {
  userId: string
  propertyId: string
  savedAt: string
}

export const DISTRICTS = [
  'Kampala',
  'Wakiso',
  'Mukono',
  'Jinja',
  'Entebbe',
  'Mbarara',
  'Gulu',
  'Fort Portal',
  'Kabale',
  'Soroti'
]

export const AMENITIES = [
  'WiFi',
  'Parking',
  'Security',
  'Water Tank',
  'Generator',
  'Garden',
  'Balcony',
  'Furnished',
  'Air Conditioning',
  'Swimming Pool'
]