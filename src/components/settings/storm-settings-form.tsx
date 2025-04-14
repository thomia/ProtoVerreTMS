"use client"

import { useState, useEffect } from "react"
import BaseSettingsForm from "./base-settings-form"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from "@/lib/localStorage"
import { 
  Cloud, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  BarChart3, 
  Repeat,
  Dumbbell,
  Brain,
  Briefcase
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Types pour les paramètres d'aléas
type StormSettings = {
  impact: number;
  duration: number;
  frequency: number;
  type: 'physical' | 'mental' | 'organizational';
}

export default function StormSettingsForm({ hideHeader = false }: { hideHeader?: boolean }) {
  // État pour l'intensité de l'orage (score calculé)
  const [intensity, setIntensity] = useState(0)
  
  // Paramètres d'aléas
  const [impact, setImpact] = useState(5)
  const [duration, setDuration] = useState(15) // en minutes
  const [frequency, setFrequency] = useState(3) // occurrences par jour
  const [aleaType, setAleaType] = useState<'physical' | 'mental' | 'organizational'>('physical')
  
  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const savedStormSettings = getLocalStorage('stormSettings')
    if (savedStormSettings) {
      try {
        const settings = JSON.parse(savedStormSettings) as StormSettings
        setImpact(settings.impact)
        setDuration(settings.duration)
        setFrequency(settings.frequency)
        setAleaType(settings.type)
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de l'orage:", error)
      }
    }
    
    const savedIntensity = getLocalStorage('stormIntensity')
    if (savedIntensity) {
      setIntensity(parseInt(savedIntensity))
    }
  }, [])
  
  // Calculer l'intensité de l'orage
  useEffect(() => {
    // Normaliser les valeurs
    const normalizedImpact = impact / 10 // 1-10 -> 0.1-1
    const normalizedDuration = duration / 60 // 1-60 -> 0.017-1
    const normalizedFrequency = frequency / 10 // 1-10 -> 0.1-1
    
    // Calculer le score brut (sans le facteur de type)
    // Avec cette formule, quand tous les paramètres sont au max, le score sera de 100
    const rawScore = (
      (normalizedImpact * 100 / 3) + 
      (normalizedDuration * 100 / 3) + 
      (normalizedFrequency * 100 / 3)
    )
    
    // Arrondir le score
    const roundedScore = Math.round(rawScore)
    
    // Limiter le score entre 0 et 100
    const finalScore = Math.min(100, Math.max(0, roundedScore))
    
    // Mettre à jour l'intensité
    setIntensity(finalScore)
    
    // Sauvegarder l'intensité
    setLocalStorage('stormIntensity', finalScore.toString())
    
    // Émettre un événement pour notifier les autres composants
    emitStorageEvent()
  }, [impact, duration, frequency, aleaType])
  
  // Fonction de soumission du formulaire
  const handleSubmit = () => {
    // Sauvegarder les valeurs actuelles
    const settings: StormSettings = {
      impact,
      duration,
      frequency,
      type: aleaType
    }
    
    setLocalStorage('stormSettings', JSON.stringify(settings))
    setLocalStorage('stormIntensity', intensity.toString())
    
    // Émettre un événement pour notifier les autres composants
    emitStorageEvent()
  }
  
  // Obtenir la description de l'intensité
  const getIntensityDescription = (value: number) => {
    if (value < 30) return "Faible"
    if (value < 70) return "Modérée"
    return "Élevée"
  }
  
  // Obtenir la couleur en fonction de l'intensité
  const getIntensityColor = (value: number) => {
    if (value < 30) return "text-green-500"
    if (value < 70) return "text-yellow-500"
    return "text-red-500"
  }
  
  // Obtenir la description de la durée
  const getDurationDescription = (value: number) => {
    if (value <= 5) return "Courte durée"
    if (value <= 30) return "Durée moyenne"
    return "Longue durée"
  }
  
  // Obtenir la description de la fréquence
  const getFrequencyDescription = (value: number) => {
    if (value <= 3) return "Basse fréquence"
    if (value <= 7) return "Fréquence moyenne"
    return "Haute fréquence"
  }
  
  return (
    <BaseSettingsForm
      title="Paramètres de l'Orage"
      subtitle="Aléas et imprévus"
      description="Configurez les aléas, les imprévus sur le terrain posant des difficultés supplémentaires pour le travailleur."
      currentValue={intensity}
      getValueDescription={getIntensityDescription}
      onSubmit={handleSubmit}
      scoreType="storm"
      autoSave={true}
    >
      <div className="space-y-8">
        {/* Impact de l'aléa */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Impact de l'aléa</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${getIntensityColor(impact * 10)}`}>{impact}</span>
              <span className="text-sm text-gray-400">/10</span>
            </div>
          </div>
          <Slider
            value={[impact]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setImpact(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Faible</span>
            <span className="text-xs text-gray-400">Fort</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Mesure l'ampleur de la perturbation causée par l'aléa sur le travail.
          </p>
        </div>
        
        {/* Durée de l'aléa */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Durée de l'aléa</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${getIntensityColor(duration * 1.67)}`}>{duration}</span>
              <span className="text-sm text-gray-400">min</span>
            </div>
          </div>
          <Slider
            value={[duration]}
            min={1}
            max={60}
            step={1}
            onValueChange={(value) => setDuration(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Court</span>
            <span className="text-xs text-gray-400">Long</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {getDurationDescription(duration)} - Temps pendant lequel le travailleur est affecté par l'aléa.
          </p>
        </div>
        
        {/* Fréquence des aléas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-[#D4A017]" />
              <span className="text-sm font-medium text-[#D4A017]">Fréquence des aléas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${getIntensityColor(frequency * 10)}`}>{frequency}</span>
              <span className="text-sm text-gray-400">fois/jour</span>
            </div>
          </div>
          <Slider
            value={[frequency]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setFrequency(value[0])}
            className="[&>.slider-track]:bg-[#D4A017]/20 [&>.slider-range]:bg-[#D4A017] [&>.slider-thumb]:border-[#D4A017]"
          />
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Rare</span>
            <span className="text-xs text-gray-400">Fréquent</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {getFrequencyDescription(frequency)} - Nombre d'occurrences des aléas par journée de travail.
          </p>
        </div>
        
        {/* Type d'aléa */}
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm font-medium text-[#D4A017]">Type d'aléa</span>
          </div>
          <RadioGroup 
            value={aleaType} 
            onValueChange={(value) => setAleaType(value as 'physical' | 'mental' | 'organizational')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical" id="physical" className="border-[#D4A017]" />
              <Label htmlFor="physical" className="text-sm text-gray-300">Physique</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mental" id="mental" className="border-[#D4A017]" />
              <Label htmlFor="mental" className="text-sm text-gray-300">Mental</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organizational" id="organizational" className="border-[#D4A017]" />
              <Label htmlFor="organizational" className="text-sm text-gray-300">Organisationnel</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-gray-400 mt-1">
            Nature de la perturbation qui affecte le travailleur.
          </p>
        </div>
        
      </div>
    </BaseSettingsForm>
  )
}
