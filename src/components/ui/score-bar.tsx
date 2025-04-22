"use client"

import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  label?: string
  scoreType?: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  getDescription?: (value: number) => string
  className?: string
}

export function ScoreBar({
  score,
  label = "Score calculé",
  scoreType = 'tap',
  getDescription,
  className
}: ScoreBarProps) {
  // Arrondir le score
  const roundedScore = Math.round(score);
  
  // Obtenir la couleur en fonction du type de score
  const getColor = () => {
    switch (scoreType) {
      case 'tap': return 'bg-blue-500'
      case 'glass': return 'bg-gray-400'
      case 'straw': return 'bg-green-500'
      case 'bubble': return 'bg-purple-500'
      case 'storm': return 'bg-[#D4A017]'
      default: return 'bg-gray-400'
    }
  }
  
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
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm text-gray-400">
          {label}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("text-lg font-bold", getTextColor())}>
            {roundedScore}%
          </div>
          <div className="text-sm text-gray-400">
            ({getScoreDescription(roundedScore)})
          </div>
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            getColor()
          )}
          style={{ width: `${roundedScore}%` }}
        />
      </div>
    </div>
  )
}
