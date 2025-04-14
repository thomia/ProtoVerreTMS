"use client"

import { cn } from '@/lib/utils'

interface VerticalProgressProps {
  value: number
  max?: number
  height?: number
  width?: number
  showValue?: boolean
  colorType?: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  className?: string
  valueClassName?: string
}

export function VerticalProgress({
  value,
  max = 100,
  height = 120,
  width = 16,
  showValue = true,
  colorType = 'straw',
  className,
  valueClassName
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
        return 'bg-gradient-to-t from-[#B8860B] to-[#FFD700]'
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

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div 
        className="relative bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <div 
          className={cn("absolute bottom-0 w-full rounded-full", getProgressColor())}
          style={{ height: `${percentage}%` }}
        />
      </div>
      
      {showValue && (
        <div 
          className={cn(
            "absolute -right-6 bottom-0 font-medium text-xs", 
            getTextColor(),
            valueClassName
          )}
          style={{ transform: `translateY(${-(percentage * height / 100)}px)` }}
        >
          {value}%
        </div>
      )}
    </div>
  )
}
