"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { VerticalProgress } from './vertical-progress'
import { Settings } from 'lucide-react'
import { Switch } from './switch'

interface ParameterSectionProps {
  title: string
  description: string
  value: number
  maxValue?: number
  isEnabled?: boolean
  onToggle?: () => void
  onSettingsClick?: () => void
  type: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  className?: string
  children?: React.ReactNode
}

export function ParameterSection({
  title,
  description,
  value,
  maxValue = 100,
  isEnabled = true,
  onToggle,
  onSettingsClick,
  type,
  className,
  children
}: ParameterSectionProps) {
  // Obtenir les couleurs en fonction du type
  const getColors = () => {
    switch (type) {
      case 'tap':
        return {
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-blue-500'
        }
      case 'glass':
        return {
          text: 'text-gray-200',
          border: 'border-gray-500/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-gray-500'
        }
      case 'straw':
        return {
          text: 'text-green-400',
          border: 'border-green-500/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-green-500'
        }
      case 'bubble':
        return {
          text: 'text-purple-400',
          border: 'border-purple-500/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-purple-500'
        }
      case 'storm':
        return {
          text: 'text-[#D4A017]',
          border: 'border-[#D4A017]/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-[#D4A017]'
        }
      default:
        return {
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          bg: 'from-slate-950 to-slate-900',
          switchColor: 'data-[state=checked]:bg-blue-500'
        }
    }
  }

  const colors = getColors()

  return (
    <div className={cn(
      "p-4 rounded-lg bg-gradient-to-b border",
      colors.bg,
      colors.border,
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={cn("text-sm font-medium", colors.text)}>
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {onToggle && (
            <Switch
              checked={isEnabled}
              onCheckedChange={onToggle}
              className={colors.switchColor}
            />
          )}
          
          {onSettingsClick && (
            <button 
              onClick={onSettingsClick}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6 mt-4">
        <VerticalProgress
          value={value}
          max={maxValue}
          colorType={type}
          height={120}
          width={12}
          showValue={true}
          className={cn(isEnabled ? "opacity-100" : "opacity-50")}
        />
        
        {children}
      </div>
    </div>
  )
}
