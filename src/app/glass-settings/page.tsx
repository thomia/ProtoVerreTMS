'use client'

import Link from 'next/link'
import GlassSettingsForm from '@/components/settings/glass-settings-form'

export default function GlassSettingsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Paramètres du Verre</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retour
          </Link>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Configurez les paramètres du verre pour contrôler son comportement sur le tableau de bord.
        </p>
        
        <GlassSettingsForm />
      </div>
    </main>
  )
} 