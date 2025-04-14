"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface BaseSettingsHeaderProps {
  title: string
  description?: string
  currentValue?: number
  getValueDescription?: (value: number) => string
  scoreType: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
}

export function BaseSettingsHeader({
  title,
  description,
  currentValue = 0,
  getValueDescription = () => '',
  scoreType
}: BaseSettingsHeaderProps) {
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

  // Obtenir la couleur de la barre de progression en fonction du type de score
  const getProgressBarColor = () => {
    switch (scoreType) {
      case 'tap': return 'bg-gradient-to-r from-blue-600 to-blue-500'
      case 'glass': return 'bg-gradient-to-r from-gray-400 to-gray-300'
      case 'straw': return 'bg-gradient-to-r from-green-600 to-green-500'
      case 'bubble': return 'bg-gradient-to-r from-purple-600 to-purple-500'
      case 'storm': return 'bg-gradient-to-r from-[#D4A017] to-[#FFD700]'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-500'
    }
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/50">
      <h2 className={cn("text-xl font-bold mb-1", getTextColor())}>
        {title}
      </h2>
      
      {description && (
        <p className={cn("text-sm mb-3 opacity-80", getTextColor())}>
          {description}
        </p>
      )}
      
      {currentValue !== undefined && (
        <div className="space-y-2">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <p className={cn("text-sm font-medium", getTextColor())}>
                Score calculé
              </p>
              <p className={cn("text-sm font-bold", getTextColor())}>
                {Math.round(currentValue)}%
              </p>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", getProgressBarColor())}
                style={{ width: `${currentValue}%` }}
              />
            </div>
          </div>
          
          <p className={cn("text-sm", getTextColor())}>
            {getValueDescription(currentValue)}
          </p>
        </div>
      )}
    </div>
  )
}
