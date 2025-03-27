'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import TapSettingsForm from '@/components/settings/tap-settings-form'

export default function TapSettingsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
        <div className="flex flex-col items-center justify-center h-full">
          <p>Chargement en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-black text-white">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">Paramètres des contraintes</h1>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center"
          >
            ← Retour au tableau de bord
          </Link>
        </div>
        
        <div className="mt-8">
          <TapSettingsForm />
        </div>
      </div>
    </div>
  )
} 