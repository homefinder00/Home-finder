import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  ChatCircle,
  Check,
  X
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { toast } from 'sonner'

interface TourRequest {
  id: string
  propertyId: string
  propertyTitle: string
  date: Date
  timeSlot: string
  visitorName: string
  visitorPhone: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

interface PropertyTourSchedulerProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

export function PropertyTourScheduler({ property, isOpen, onClose }: PropertyTourSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 // Disable past dates and Sundays
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !visitorName || !visitorPhone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const tourRequest: TourRequest = {
        id: Date.now().toString(),
        propertyId: property.id,
        propertyTitle: property.title,
        date: selectedDate,
        timeSlot: selectedTime,
        visitorName,
        visitorPhone,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      // Save to localStorage for demo purposes
      const existing = JSON.parse(localStorage.getItem('tour_requests') || '[]')
      localStorage.setItem('tour_requests', JSON.stringify([tourRequest, ...existing]))

      toast.success('Tour request submitted! The landlord will contact you to confirm.')
      
      // Reset form
      setSelectedDate(undefined)
      setSelectedTime('')
      setVisitorName('')
      setVisitorPhone('')
      setMessage('')
      onClose()

    } catch (error) {
      toast.error('Failed to submit tour request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule Property Tour
          </DialogTitle>
          <DialogDescription>
            Book a tour for "{property.title}" in {property.location.district}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            {/* Time Slot */}
            <div>
              <Label htmlFor="time" className="text-sm font-medium">
                Select Time <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visitor Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+256 XXX XXX XXX"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                Additional Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Any specific questions or requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Property Info Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {property.location.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Landlord: {property.landlordName}
                  </div>
                  {property.landlordVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Verified Landlord
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !selectedDate || !selectedTime || !visitorName || !visitorPhone}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Schedule Tour'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Component to show user's tour requests
export function MyTourRequests() {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([])

  useState(() => {
    const stored = localStorage.getItem('tour_requests')
    if (stored) {
      setTourRequests(JSON.parse(stored))
    }
  })

  const getStatusColor = (status: TourRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Tour Requests</h3>
      
      {tourRequests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No tour requests yet</p>
          </CardContent>
        </Card>
      ) : (
        tourRequests.map(tour => (
          <Card key={tour.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium">{tour.propertyTitle}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {tour.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tour.timeSlot}
                    </div>
                  </div>
                  {tour.message && (
                    <p className="text-sm text-muted-foreground">{tour.message}</p>
                  )}
                </div>
                <Badge className={getStatusColor(tour.status)}>
                  {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
