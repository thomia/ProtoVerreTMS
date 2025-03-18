"use client"

import { useEffect, useRef } from 'react'

interface GlassComponentProps {
  fillLevel: number
}

export default function GlassComponent({ fillLevel }: GlassComponentProps) {
  const glassRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (glassRef.current) {
      glassRef.current.style.setProperty('--fill-level', `${fillLevel}%`)
    }
  }, [fillLevel])

  return (
    <div className="relative w-32 h-48 border-4 border-blue-200 rounded-b-lg overflow-hidden bg-blue-50/30">
      {/* Cadre du verre */}
      <div className="absolute inset-0 border-2 border-blue-300 rounded-b-lg pointer-events-none" />
      
      {/* Eau dans le verre */}
      <div 
        ref={glassRef}
        className="absolute bottom-0 left-0 right-0 bg-blue-400/70 animate-fill-glass"
        style={{ 
          height: '0%',
          transition: 'height 1s ease-in-out'
        }}
      />
      
      {/* Reflet sur le verre */}
      <div className="absolute top-2 left-2 w-6 h-16 bg-white/20 rounded-full transform rotate-15" />
      
      {/* Étiquette du verre */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold">
        <span className="text-base bg-white/80 px-2 py-1 rounded-md text-blue-800 shadow-sm">Verre</span>
      </div>
    </div>
  )
} 