"use client"

import { useState, useEffect } from "react"
import BaseSettingsForm from "./base-settings-form"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from "@/lib/localStorage"
import { Cloud, AlertTriangle, RefreshCw } from "lucide-react"

export default function StormSettingsForm({ hideHeader = false }: { hideHeader?: boolean }) {
  // État pour l'intensité de l'orage
  const [intensity, setIntensity] = useState(0)
  
  // Facteurs d'aléas
  const [interruptions, setInterruptions] = useState(0)
  const [changes, setChanges] = useState(0)
  const [technicalIssues, setTechnicalIssues] = useState(0)
  
  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const savedIntensity = getLocalStorage('stormIntensity')
    if (savedIntensity) {
      setIntensity(parseInt(savedIntensity))
    }
    
    const savedInterruptions = getLocalStorage('stormInterruptions')
    if (savedInterruptions) {
      setInterruptions(parseInt(savedInterruptions))
    } else {
      setInterruptions(Math.floor(Math.random() * 100))
    }
    
    const savedChanges = getLocalStorage('stormChanges')
    if (savedChanges) {
      setChanges(parseInt(savedChanges))
    } else {
      setChanges(Math.floor(Math.random() * 100))
    }
    
    const savedTechnicalIssues = getLocalStorage('stormTechnicalIssues')
    if (savedTechnicalIssues) {
      setTechnicalIssues(parseInt(savedTechnicalIssues))
    } else {
      setTechnicalIssues(Math.floor(Math.random() * 100))
    }
  }, [])
  
  // Mettre à jour l'intensité lorsque les facteurs changent
  useEffect(() => {
    // Calculer l'intensité en fonction des facteurs (moyenne pondérée)
    const calculatedIntensity = Math.round(
      (interruptions * 0.4) + (changes * 0.3) + (technicalIssues * 0.3)
    )
    
    setIntensity(calculatedIntensity)
    
    // Sauvegarder dans localStorage
    setLocalStorage('stormIntensity', calculatedIntensity.toString())
    setLocalStorage('stormInterruptions', interruptions.toString())
    setLocalStorage('stormChanges', changes.toString())
    setLocalStorage('stormTechnicalIssues', technicalIssues.toString())
    
    // Émettre un événement personnalisé pour notifier les autres composants
    const event = new CustomEvent('stormIntensityUpdated', { 
      detail: { intensity: calculatedIntensity } 
    })
    window.dispatchEvent(event)
    
    // Émettre un événement de stockage pour notifier les autres composants
    emitStorageEvent()
  }, [interruptions, changes, technicalIssues])
  
  // Fonction pour réinitialiser les paramètres
  const handleReset = () => {
    setInterruptions(0)
    setChanges(0)
    setTechnicalIssues(0)
  }
  
  // Fonction pour générer des valeurs aléatoires
  const handleRandomize = () => {
    setInterruptions(Math.floor(Math.random() * 100))
    setChanges(Math.floor(Math.random() * 100))
    setTechnicalIssues(Math.floor(Math.random() * 100))
  }
  
  // Obtenir la description de l'intensité
  const getIntensityDescription = (value: number) => {
    if (value < 40) return "Faible"
    if (value < 60) return "Modérée"
    if (value < 80) return "Élevée"
    return "Critique"
  }
  
  // Obtenir la couleur en fonction de l'intensité
  const getIntensityColor = () => {
    if (intensity >= 80) return "text-red-500"
    if (intensity >= 60) return "text-orange-500"
    if (intensity >= 40) return "text-yellow-500"
    return "text-green-500"
  }
  
  // Fonction de soumission du formulaire
  const handleSubmit = () => {
    // Sauvegarder les valeurs actuelles
    setLocalStorage('stormIntensity', intensity.toString())
    setLocalStorage('stormInterruptions', interruptions.toString())
    setLocalStorage('stormChanges', changes.toString())
    setLocalStorage('stormTechnicalIssues', technicalIssues.toString())
    
    // Émettre un événement pour notifier les autres composants
    emitStorageEvent()
  }
  
  return (
    <BaseSettingsForm
      title="Paramètres de l'Orage"
      subtitle="Aléas et imprévus"
      description="Configurez les aléas, les imprévus sur le terrain posant des difficultés supplémentaires pour le travailleur."
      currentValue={intensity}
      getValueDescription={getIntensityDescription}
      onSubmit={handleSubmit}
      scoreType="bubble"
      autoSave={true}
    >
      <div className="space-y-8">
        {/* Facteur d'interruptions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Interruptions</span>
            </div>
            <span className={`text-sm font-bold ${getIntensityColor()}`}>{interruptions}%</span>
          </div>
          <Slider
            value={[interruptions]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setInterruptions(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <p className="text-xs text-gray-400">
            Fréquence des interruptions de travail (appels, demandes, etc.)
          </p>
        </div>
        
        {/* Facteur de changements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Changements</span>
            </div>
            <span className={`text-sm font-bold ${getIntensityColor()}`}>{changes}%</span>
          </div>
          <Slider
            value={[changes]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setChanges(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <p className="text-xs text-gray-400">
            Fréquence des changements de priorités ou de tâches en cours de journée
          </p>
        </div>
        
        {/* Facteur de problèmes techniques */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Problèmes techniques</span>
            </div>
            <span className={`text-sm font-bold ${getIntensityColor()}`}>{technicalIssues}%</span>
          </div>
          <Slider
            value={[technicalIssues]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setTechnicalIssues(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <p className="text-xs text-gray-400">
            Fréquence des problèmes techniques ou pannes d'équipement
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            Réinitialiser
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRandomize}
            className="flex-1 border-[#D4A017]/50 text-[#D4A017] hover:bg-[#D4A017]/10"
          >
            Valeurs aléatoires
          </Button>
        </div>
        
        {/* Résumé */}
        <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800">
          <h3 className="text-sm font-medium text-[#D4A017] mb-2">Impact sur le modèle</h3>
          <p className="text-xs text-gray-400">
            L'intensité de l'Orage représente les aléas et imprévus qui viennent perturber le travail.
            Plus l'intensité est élevée, plus le travailleur doit faire face à des interruptions et des changements,
            ce qui augmente la charge mentale et peut affecter sa capacité à gérer le flux de travail.
          </p>
        </div>
      </div>
    </BaseSettingsForm>
  )
}
