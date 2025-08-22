import { useState } from 'react'
import { PropertyBrowser } from '@/components/property/PropertyBrowser'
import { Toaster } from 'sonner'

import './index.css'

function SimpleApp() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Uganda Housing App</h1>
        <p className="text-gray-600 mb-4">Testing basic functionality...</p>
        <PropertyBrowser />
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default SimpleApp
