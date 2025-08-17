import { Property } from '@/lib/types'
import { useEffect, useState } from 'react'

const SAMPLE_PROPERTIES: Property[] = [
  // Luxury Properties - High End (2M+ UGX)
  {
    id: "1",
    title: "Luxury 4-Bedroom Villa in Kololo",
    description: "Stunning luxury villa with swimming pool, garden, and panoramic city views. Fully furnished with modern amenities and 24/7 security.",
    price: 3500000,
    currency: "UGX",
    bedrooms: 4,
    bathrooms: 3,
    location: {
      address: "Kololo Hill, Kampala",
      latitude: 0.3318,
      longitude: 32.5810,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Swimming Pool", "Garden", "Parking", "Generator", "Water Tank", "Gym"],
    landlordId: "landlord1",
    landlordName: "Sarah Nakamura",
    landlordPhone: "+256 700 123456",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Executive 3-Bedroom Penthouse - Nakasero",
    description: "Modern penthouse with spectacular views of Lake Victoria. Premium finishes, smart home features, and rooftop terrace.",
    price: 4200000,
    currency: "UGX",
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: "Nakasero Hill, Kampala",
      latitude: 0.3136,
      longitude: 32.5811,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Elevator", "Rooftop Terrace", "Smart Home", "Parking", "Generator", "Water Tank"],
    landlordId: "landlord2",
    landlordName: "David Musoke",
    landlordPhone: "+256 701 234567",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Mid-Range Properties (800K - 2M UGX)
  {
    id: "3",
    title: "Modern 2-Bedroom Apartment - Bugolobi",
    description: "Contemporary apartment in a quiet neighborhood. Perfect for young professionals with modern amenities and easy access to the city.",
    price: 1200000,
    currency: "UGX",
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: "Bugolobi, Kampala",
      latitude: 0.3344,
      longitude: 32.6122,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Parking", "Water Tank", "Backup Generator"],
    landlordId: "landlord3",
    landlordName: "Grace Namatovu",
    landlordPhone: "+256 702 345678",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Family Home - Ntinda",
    description: "Spacious 3-bedroom house with compound and garden. Great for families, quiet neighborhood with good schools nearby.",
    price: 1500000,
    currency: "UGX",
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: "Ntinda, Kampala",
      latitude: 0.3773,
      longitude: 32.6283,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Garden", "Parking", "Water Tank", "Compound"],
    landlordId: "landlord4",
    landlordName: "John Kigozi",
    landlordPhone: "+256 703 456789",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "2-Bedroom Apartment - Muyenga",
    description: "Affordable apartment with beautiful views of Kampala. Good transport links and close to shopping centers.",
    price: 900000,
    currency: "UGX",
    bedrooms: 2,
    bathrooms: 1,
    location: {
      address: "Muyenga, Kampala",
      latitude: 0.2675,
      longitude: 32.6147,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Water Tank", "Parking"],
    landlordId: "landlord5",
    landlordName: "Mary Ssali",
    landlordPhone: "+256 704 567890",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Budget-Friendly Properties (Under 800K UGX)
  {
    id: "6",
    title: "1-Bedroom Studio - Wandegeya",
    description: "Compact studio apartment perfect for students and young professionals. Close to Makerere University and affordable.",
    price: 400000,
    currency: "UGX",
    bedrooms: 1,
    bathrooms: 1,
    location: {
      address: "Wandegeya, Kampala",
      latitude: 0.3368,
      longitude: 32.5663,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Water Tank"],
    landlordId: "landlord6",
    landlordName: "Robert Mukasa",
    landlordPhone: "+256 705 678901",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "2-Bedroom House - Kawempe",
    description: "Simple but comfortable house in a growing neighborhood. Great value for money with basic amenities.",
    price: 600000,
    currency: "UGX",
    bedrooms: 2,
    bathrooms: 1,
    location: {
      address: "Kawempe, Kampala",
      latitude: 0.3833,
      longitude: 32.5333,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
    ],
    amenities: ["Security", "Water Tank", "Compound"],
    landlordId: "landlord7",
    landlordName: "Agnes Nambi",
    landlordPhone: "+256 706 789012",
    landlordVerified: false,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Outside Kampala - Other Districts
  {
    id: "8",
    title: "3-Bedroom House - Entebbe",
    description: "Beautiful house near Lake Victoria and Entebbe Airport. Perfect for expats and airline staff. Quiet and serene location.",
    price: 1300000,
    currency: "UGX",
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: "Entebbe, Wakiso",
      latitude: 0.0514,
      longitude: 32.4622,
      district: "Wakiso"
    },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Garden", "Parking", "Water Tank", "Lake View"],
    landlordId: "landlord8",
    landlordName: "Peter Ssemakula",
    landlordPhone: "+256 707 890123",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "9",
    title: "Modern Apartment - Mukono",
    description: "New development in the growing town of Mukono. Great for commuters to Kampala with lower costs.",
    price: 750000,
    currency: "UGX",
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: "Mukono Town, Mukono",
      latitude: 0.3536,
      longitude: 32.7574,
      district: "Mukono"
    },
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Parking", "Water Tank", "Modern Appliances"],
    landlordId: "landlord9",
    landlordName: "Susan Nakigozi",
    landlordPhone: "+256 708 901234",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "10",
    title: "Countryside Villa - Jinja",
    description: "Luxurious villa near the source of the Nile. Perfect for weekend getaways or permanent residence outside the city.",
    price: 2500000,
    currency: "UGX",
    bedrooms: 4,
    bathrooms: 3,
    location: {
      address: "Jinja Town, Jinja",
      latitude: 0.4314,
      longitude: 33.2039,
      district: "Jinja"
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Swimming Pool", "Garden", "River View", "Parking", "Generator"],
    landlordId: "landlord10",
    landlordName: "Michael Wanyama",
    landlordPhone: "+256 709 012345",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Student Housing & Shared Accommodations
  {
    id: "11",
    title: "Student Hostel Room - Makerere",
    description: "Clean, safe hostel room near Makerere University. Shared facilities, study areas, and 24/7 security.",
    price: 250000,
    currency: "UGX",
    bedrooms: 1,
    bathrooms: 1,
    location: {
      address: "Makerere, Kampala",
      latitude: 0.3297,
      longitude: 32.5661,
      district: "Kampala"
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Study Room", "Shared Kitchen", "Laundry"],
    landlordId: "landlord11",
    landlordName: "Elizabeth Nakirya",
    landlordPhone: "+256 710 123456",
    landlordVerified: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "12",
    title: "Shared 3-Bedroom House - Bweyogerere",
    description: "Room available in shared house. Perfect for students and young professionals looking for affordable accommodation.",
    price: 350000,
    currency: "UGX",
    bedrooms: 1,
    bathrooms: 1,
    location: {
      address: "Bweyogerere, Wakiso",
      latitude: 0.3647,
      longitude: 32.6742,
      district: "Wakiso"
    },
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
    ],
    amenities: ["WiFi", "Security", "Shared Kitchen", "Parking", "Water Tank"],
    landlordId: "landlord12",
    landlordName: "James Lubega",
    landlordPhone: "+256 711 234567",
    landlordVerified: false,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function useInitializeSampleData() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)

  return {
    properties,
    setProperties
  }
}
