'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GlassSettingsForm from '@/components/settings/glass-settings-form'

export default function GlassSettingsPage() {
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
    <div className="bg-black text-white">
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-center mb-2">Paramètres de l'individu</h1>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center"
          >
            ← Retour au tableau de bord
          </Link>
        </div>
        
        <div className="mt-8">
          <GlassSettingsForm />
        </div>
      </div>
    </div>
  )
}