"use client"

import { cn } from '@/lib/utils'

interface VerticalProgressProps {
  value: number
  max?: number
  height?: number
  width?: number
  showValue?: boolean
  showLabel?: boolean
  label?: string
  colorType?: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  className?: string
  valueClassName?: string
  labelClassName?: string
}

export function VerticalProgress({
  value,
  max = 100,
  height = 100,
  width = 16,
  showValue = true,
  showLabel = false,
  label = "",
  colorType = 'straw',
  className,
  valueClassName,
  labelClassName
}: VerticalProgressProps) {
  // Calculer le pourcentage de remplissage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  // Obtenir la couleur en fonction du type
  const getProgressColor = () => {
    switch (colorType) {
      case 'tap':
        return 'bg-gradient-to-t from-blue-600 to-blue-400'
      case 'glass':
        return 'bg-gradient-to-t from-gray-400 to-gray-200'
      case 'straw':
        return 'bg-gradient-to-t from-green-600 to-green-400'
      case 'bubble':
        return 'bg-gradient-to-t from-purple-600 to-purple-400'
      case 'storm':
        return 'bg-gradient-to-t from-[#B8860B] to-[#D4A017]'
      default:
        return 'bg-gradient-to-t from-green-600 to-green-400'
    }
  }
  
  // Obtenir la couleur du texte en fonction du type
  const getTextColor = () => {
    switch (colorType) {
      case 'tap':
        return 'text-blue-400'
      case 'glass':
        return 'text-gray-200'
      case 'straw':
        return 'text-green-400'
      case 'bubble':
        return 'text-purple-400'
      case 'storm':
        return 'text-[#D4A017]'
      default:
        return 'text-green-400'
    }
  }

  // Obtenir la couleur de la bordure en fonction du type
  const getBorderColor = () => {
    switch (colorType) {
      case 'tap':
        return 'border-blue-400'
      case 'glass':
        return 'border-gray-200'
      case 'straw':
        return 'border-green-400'
      case 'bubble':
        return 'border-purple-400'
      case 'storm':
        return 'border-[#D4A017]'
      default:
        return 'border-green-400'
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* En-tête avec titre et valeur */}
      <div className="w-full text-center mb-2">
        {/* Titre centré */}
        {showLabel && (
          <div className={cn(
            "text-sm font-medium", 
            getTextColor(),
            labelClassName
          )}>
            {label}
          </div>
        )}
        
        {/* Valeur centrée */}
        {showValue && (
          <div className={cn(
            "text-sm font-medium mt-1", 
            getTextColor(),
            valueClassName
          )}>
            {value}%
          </div>
        )}
      </div>
      
      {/* Barre de progression */}
      <div 
        className={cn("relative bg-gray-800/50 rounded-md overflow-hidden border border-gray-700/50", className)}
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <div 
          className={cn("absolute bottom-0 w-full", getProgressColor())}
          style={{ height: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
