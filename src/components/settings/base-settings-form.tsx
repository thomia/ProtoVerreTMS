"use client"

import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Props pour le composant InfoTooltip
interface InfoTooltipProps {
  content: string
}

// Composant InfoTooltip réutilisable
export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="inline-block w-4 h-4 ml-2 text-gray-400 hover:text-gray-300 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Fonction utilitaire pour obtenir la classe de couleur en fonction de la valeur
export function getColorClass(value: number): string {
  if (value < 40) return "text-red-500"
  if (value < 60) return "text-yellow-500"
  if (value < 80) return "text-green-400"
  return "text-green-300"
}

// Props pour le composant BaseSettingsForm
export interface BaseSettingsFormProps {
  title: string
  description: string
  currentValue: number
  getValueDescription: (score: number) => string
  onSubmit: () => void
  children: React.ReactNode
  scoreType: 'glass' | 'tap' | 'straw' | 'bubble'
}

// Configurations des couleurs pour chaque type de score
const scoreConfigs = {
  glass: {
    title: "Capacité d'absorption",
    colors: {
      text: (value: number) => ({
        color: value === 0 ? 'rgb(107, 114, 128)' :  // gray-500
               value < 33 ? 'rgb(156, 163, 175)' :   // gray-400
               value < 66 ? 'rgb(209, 213, 219)' :   // gray-300
               'rgb(255, 255, 255)'                  // white
      }),
      gradient: (value: number) => `linear-gradient(to right, 
        ${value === 0 ? 'rgb(107, 114, 128), rgb(156, 163, 175)' :
          value < 33 ? 'rgb(156, 163, 175), rgb(209, 213, 219)' :
          value < 66 ? 'rgb(209, 213, 219), rgb(229, 231, 235)' :
          'rgb(229, 231, 235), rgb(255, 255, 255)'
        })`
    }
  },
  tap: {
    title: "Débit",
    colors: {
      text: (value: number) => ({
        color: value < 25 ? 'rgb(186, 230, 253)' :  // bleu très clair
               value < 50 ? 'rgb(56, 189, 248)' :   // bleu clair
               value < 75 ? 'rgb(14, 165, 233)' :   // bleu moyen
               'rgb(3, 105, 161)'                   // bleu foncé
      }),
      gradient: (value: number) => `linear-gradient(to right, 
        ${value < 25 ? 'rgb(186, 230, 253), rgb(125, 211, 252)' :
          value < 50 ? 'rgb(56, 189, 248), rgb(14, 165, 233)' :
          value < 75 ? 'rgb(14, 165, 233), rgb(2, 132, 199)' :
          'rgb(2, 132, 199), rgb(3, 105, 161)'
        })`
    }
  },
  straw: {
    title: "Récupération",
    colors: {
      text: (value: number) => ({
        color: value < 25 ? 'rgb(187, 247, 208)' :  // vert très clair
               value < 50 ? 'rgb(74, 222, 128)' :   // vert clair
               value < 75 ? 'rgb(34, 197, 94)' :    // vert moyen
               'rgb(22, 163, 74)'                   // vert foncé
      }),
      gradient: (value: number) => `linear-gradient(to right, 
        ${value < 25 ? 'rgb(187, 247, 208), rgb(134, 239, 172)' :
          value < 50 ? 'rgb(74, 222, 128), rgb(34, 197, 94)' :
          value < 75 ? 'rgb(34, 197, 94), rgb(22, 163, 74)' :
          'rgb(22, 163, 74), rgb(21, 128, 61)'
        })`
    }
  },
  bubble: {
    title: "Influence environnementale",
    colors: {
      text: (value: number) => ({
        color: value < 25 ? 'rgb(216, 180, 254)' :  // violet très clair
               value < 50 ? 'rgb(192, 132, 252)' :   // violet clair
               value < 75 ? 'rgb(168, 85, 247)' :    // violet moyen
               'rgb(147, 51, 234)'                   // violet foncé
      }),
      gradient: (value: number) => `linear-gradient(to right, 
        ${value < 25 ? 'rgb(216, 180, 254), rgb(192, 132, 252)' :
          value < 50 ? 'rgb(192, 132, 252), rgb(168, 85, 247)' :
          value < 75 ? 'rgb(168, 85, 247), rgb(147, 51, 234)' :
          'rgb(147, 51, 234), rgb(126, 34, 206)'
        })`
    }
  }
}

// Composant BaseSettingsForm
export default function BaseSettingsForm({
  title,
  description,
  currentValue,
  getValueDescription,
  onSubmit,
  children,
  scoreType
}: BaseSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const config = scoreConfigs[scoreType]

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await onSubmit();
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* En-tête avec titre et description côte à côte */}
        <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white text-center">
              {title}
            </h2>
            <p className="text-xl text-gray-300 mt-12 text-center">
              {description}
            </p>
          </div>

          {/* Score final - Section améliorée */}
          <div className="relative flex flex-col items-center p-6 rounded-xl bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-gray-700/50 min-w-[280px] backdrop-blur-sm shadow-xl transition-all duration-500 group">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Effet de bordure animée */}
            <div className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500 group-hover:duration-200"
              style={{
                background: config.colors.gradient(currentValue)
              }}
            />
            
            <div className="relative flex flex-col items-center space-y-4">
              <h3 className="text-xl font-medium text-gray-300">{config.title}</h3>
              <div className="text-6xl font-bold" style={config.colors.text(currentValue)}>
                {currentValue}%
              </div>
              <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${currentValue}%`,
                    background: config.colors.gradient(currentValue)
                  }}
                />
              </div>
              <div className="text-sm font-medium" style={config.colors.text(currentValue)}>
                {getValueDescription(currentValue)}
              </div>
            </div>
          </div>
        </div>

        {children}

        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`relative px-12 py-6 text-xl font-medium transition-all duration-300 save-button min-w-[200px]
              ${isSubmitting ? 'bg-emerald-600 cursor-wait' : ''}
              ${showSaveSuccess ? 'bg-emerald-500' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                Enregistrement...
              </span>
            ) : showSaveSuccess ? (
              <span className="flex items-center justify-center gap-2">
                Enregistré ✓
              </span>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 