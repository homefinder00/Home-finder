import { useState } from 'react'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from 'sonner'

import './index.css'

function MinimalApp() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Uganda Housing App
          </h1>
          <p className="text-muted-foreground">
            Auth context loaded successfully!
          </p>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  )
}

export default MinimalApp
