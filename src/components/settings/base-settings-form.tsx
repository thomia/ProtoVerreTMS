"use client"

import { useState, useEffect, useCallback } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { BaseSettingsHeader } from "@/components/ui/base-settings-header"

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
  scoreType?: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  showSaveMessage?: boolean
  autoSave?: boolean
  onAutoSaveChange?: (value: boolean) => void
  hideHeader?: boolean
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
  },
  storm: {
    title: "Tempête",
    colors: {
      text: (value: number) => ({
        color: value < 25 ? 'rgb(255, 215, 0)' :  // jaune très clair
               value < 50 ? 'rgb(245, 158, 11)' :   // jaune clair
               value < 75 ? 'rgb(220, 105, 0)' :    // jaune moyen
               'rgb(184, 63, 39)'                   // jaune foncé
      }),
      gradient: (value: number) => `linear-gradient(to right, 
        ${value < 25 ? 'rgb(255, 215, 0), rgb(245, 158, 11)' :
          value < 50 ? 'rgb(245, 158, 11), rgb(220, 105, 0)' :
          value < 75 ? 'rgb(220, 105, 0), rgb(184, 63, 39)' :
          'rgb(184, 63, 39), rgb(146, 43, 26)'
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
  onAutoSaveChange,
  hideHeader = false
}: BaseSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Fonction pour gérer la soumission du formulaire
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
  
  // Gérer le changement d'état de la sauvegarde automatique
  const handleAutoSaveChange = useCallback((checked: boolean) => {
    if (onAutoSaveChange) {
      onAutoSaveChange(checked);
    }
  }, [onAutoSaveChange]);
  
  // Fonction pour obtenir la description de la valeur
  const getValueDescriptionWithDefault = useCallback((value: number) => {
    if (getValueDescription) {
      return getValueDescription(value);
    }
    
    if (value < 40) return "Faible";
    if (value < 60) return "Modéré";
    if (value < 80) return "Élevé";
    return "Critique";
  }, [getValueDescription]);

  return (
    <div className="space-y-6">
      {!hideHeader && currentValue !== undefined && (
        <BaseSettingsHeader
          title={title}
          description={description}
          currentValue={currentValue}
          getValueDescription={getValueDescriptionWithDefault}
          scoreType={scoreType}
        />
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
                className={`${
                  scoreType === 'bubble' ? "data-[state=checked]:bg-purple-600" :
                  scoreType === 'straw' ? "data-[state=checked]:bg-green-600" :
                  scoreType === 'glass' ? "data-[state=checked]:bg-white" :
                  scoreType === 'storm' ? "data-[state=checked]:bg-[#D4A017]" :
                  "data-[state=checked]:bg-blue-600"
                }`}
              />
              <label 
                htmlFor="auto-save" 
                className={`text-sm font-medium cursor-pointer ${
                  scoreType === 'bubble' ? "text-purple-300" :
                  scoreType === 'straw' ? "text-green-300" :
                  scoreType === 'glass' ? "text-white" :
                  scoreType === 'storm' ? "text-[#D4A017]" :
                  "text-blue-300"
                }`}
              >
                Sauvegarde automatique
              </label>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {showSaveSuccess && (
            <span className={`flex items-center text-sm ${
              scoreType === 'bubble' ? "text-purple-400" :
              scoreType === 'straw' ? "text-green-400" :
              scoreType === 'glass' ? "text-white" :
              scoreType === 'storm' ? "text-[#D4A017]" :
              "text-blue-400"
            }`}>
              <Check className="mr-1 h-4 w-4" />
              Paramètres sauvegardés
            </span>
          )}
          
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`relative px-4 py-2 font-medium text-sm rounded-md shadow-lg transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            } ${
              scoreType === 'bubble' 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border border-purple-500/50"
                : scoreType === 'straw'
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border border-green-500/50"
                  : scoreType === 'glass'
                    ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border border-slate-500/50"
                    : scoreType === 'storm'
                      ? "bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4A017] text-white border border-[#D4A017]/50"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/50"
            }`}
          >
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}