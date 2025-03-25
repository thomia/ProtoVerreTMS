"use client"

import { useState, useEffect, useCallback } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

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
interface BaseSettingsFormProps {
  title: string
  subtitle?: string
  description?: string
  currentValue?: number
  getValueDescription?: (value: number) => string
  onSubmit: () => void
  children: React.ReactNode
  scoreType?: 'tap' | 'glass' | 'straw'
  showSaveMessage?: boolean
  autoSave?: boolean
  onAutoSaveChange?: (value: boolean) => void
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
  subtitle,
  description,
  currentValue,
  getValueDescription,
  onSubmit,
  children,
  scoreType = 'tap',
  showSaveMessage = false,
  autoSave = false,
  onAutoSaveChange
}: BaseSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const config = scoreConfigs[scoreType]

  // Gérer la soumission du formulaire
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Éviter les doubles soumissions
    
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
  }, [isSubmitting, onSubmit]);

  // Mettre à jour la valeur d'autosave avec un délai pour éviter les boucles
  const handleAutoSaveChange = useCallback((checked: boolean) => {
    if (onAutoSaveChange) {
      // Utiliser un délai pour éviter les mises à jour trop fréquentes
      setTimeout(() => {
        onAutoSaveChange(checked);
      }, 0);
    }
  }, [onAutoSaveChange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-gray-400/80">{subtitle}</p>
        )}
        {description && (
          <p className="text-gray-400/80">{description}</p>
        )}
      </div>

      {currentValue !== undefined && getValueDescription && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-400">Score calculé</span>
            <span className={`text-lg font-medium ${
              currentValue >= 80 ? "text-red-400" : 
              currentValue >= 60 ? "text-orange-400" : 
              currentValue >= 40 ? "text-yellow-400" : 
              "text-green-400"
            }`}>{currentValue}%</span>
          </div>
          
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full left-0 top-0 rounded-full transition-all duration-300 ${
                currentValue >= 80 ? "bg-gradient-to-r from-red-500 to-red-400" : 
                currentValue >= 60 ? "bg-gradient-to-r from-orange-500 to-orange-400" : 
                currentValue >= 40 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : 
                "bg-gradient-to-r from-green-500 to-green-400"
              }`}
              style={{ width: `${currentValue}%` }}
            />
          </div>
          
          <p className="mt-2 text-sm text-gray-500">{getValueDescription(currentValue)}</p>
        </div>
      )}

      <div className="rounded-lg border-2 border-gray-800/50 p-6">
        {children}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {onAutoSaveChange && (
            <>
              <Switch 
                id="auto-save" 
                checked={autoSave} 
                onCheckedChange={handleAutoSaveChange}
              />
              <label 
                htmlFor="auto-save" 
                className="text-sm font-medium text-gray-400 cursor-pointer"
              >
                Sauvegarde automatique
              </label>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {showSaveSuccess && (
            <span className="flex items-center text-sm text-green-400">
              <Check className="mr-1 h-4 w-4" />
              Paramètres sauvegardés
            </span>
          )}
          
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
} 