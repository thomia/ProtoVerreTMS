"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface RealTimeScoreProps {
  score: number
  label?: string
  scoreType?: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  getDescription?: (value: number) => string
}

export function RealTimeScore({ 
  score, 
  label = "Score calculé", 
  scoreType = 'tap',
  getDescription
}: RealTimeScoreProps) {
  // Obtenir la couleur du texte en fonction du type de score
  const getTextColor = () => {
    switch (scoreType) {
      case 'tap': return 'text-blue-400'
      case 'glass': return 'text-gray-200'
      case 'straw': return 'text-green-400'
      case 'bubble': return 'text-purple-400'
      case 'storm': return 'text-[#D4A017]'
      default: return 'text-gray-200'
    }
  }

  // Obtenir la couleur de fond en fonction du type de score
  const getBgColor = () => {
    switch (scoreType) {
      case 'tap': return 'bg-blue-900/30'
      case 'glass': return 'bg-gray-800/30'
      case 'straw': return 'bg-green-900/30'
      case 'bubble': return 'bg-purple-900/30'
      case 'storm': return 'bg-amber-900/30'
      default: return 'bg-gray-800/30'
    }
  }

  // Obtenir la couleur de la bordure en fonction du type de score
  const getBorderColor = () => {
    switch (scoreType) {
      case 'tap': return 'border-blue-500/30'
      case 'glass': return 'border-gray-500/30'
      case 'straw': return 'border-green-500/30'
      case 'bubble': return 'border-purple-500/30'
      case 'storm': return 'border-[#D4A017]/30'
      default: return 'border-gray-500/30'
    }
  }

  // Obtenir la description du score
  const getScoreDescription = (value: number) => {
    if (getDescription) {
      return getDescription(value);
    }
    
    if (value < 40) return "Faible"
    if (value < 60) return "Modéré"
    if (value < 80) return "Élevé"
    return "Critique"
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border", 
      getBgColor(),
      getBorderColor()
    )}>
      <div className="flex justify-between items-center mb-2">
        <div className={cn("text-sm font-medium", getTextColor())}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("text-xl font-bold", getTextColor())}>
            {Math.round(score)}%
          </div>
          <div className={cn("text-sm", getTextColor())}>
            ({getScoreDescription(score)})
          </div>
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            scoreType === 'tap' ? "bg-blue-500" :
            scoreType === 'glass' ? "bg-gray-400" :
            scoreType === 'straw' ? "bg-green-500" :
            scoreType === 'bubble' ? "bg-purple-500" :
            scoreType === 'storm' ? "bg-[#D4A017]" :
            "bg-gray-400"
          )}
          style={{ width: `${Math.round(score)}%` }}
        />
      </div>
    </div>
  )
}
