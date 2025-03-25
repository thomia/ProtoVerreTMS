"use client"

import * as React from 'react'
import BaseSettingsForm from './base-settings-form'
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { cn } from '@/lib/utils'

// Définitions des facteurs individuels
const individualFactorsDefinitions = {
  age: "L'âge influence la capacité d'absorption et de récupération du corps face aux contraintes physiques",
  physicalActivity: "La pratique régulière d'activité sportive permet de mieux résister aux contraintes et de récupérer plus rapidement",
  nutrition: "Une alimentation équilibrée renforce la résistance aux contraintes",
  sleep: "Un sommeil suffisant est essentiel pour la récupération et la prévention des TMS"
}

// Pathologies possibles avec leurs descriptions
const pathologies = [
  { 
    id: 'neckProblems', 
    label: 'Problèmes de cou',
    description: 'Antécédents de douleurs ou tensions cervicales'
  },
  { 
    id: 'backProblems', 
    label: 'Problèmes de dos',
    description: 'Antécédents de lombalgies ou autres troubles du dos'
  },
  { 
    id: 'shoulderProblems', 
    label: 'Problèmes d\'épaule',
    description: 'Antécédents de tendinites ou douleurs à l\'épaule'
  },
  { 
    id: 'wristProblems', 
    label: 'Problèmes de poignet',
    description: 'Antécédents de syndrome du canal carpien ou tendinites'
  },
  { 
    id: 'kneeProblems', 
    label: 'Problèmes de genou',
    description: 'Antécédents de troubles articulaires du genou'
  },
  { 
    id: 'previousTMS', 
    label: 'Autres antécédents de TMS',
    description: 'Autres troubles musculo-squelettiques non listés'
  }
]

interface MedicalHistory {
  neckProblems: boolean;
  backProblems: boolean;
  shoulderProblems: boolean;
  wristProblems: boolean;
  kneeProblems: boolean;
  previousTMS: boolean;
}

type MedicalHistoryKey = keyof MedicalHistory;

interface IndividualParams {
  age: number;
  physicalActivity: number;
  nutrition: number;
  sleepDuration: number;
}

export default function GlassSettingsForm() {
  // États pour les paramètres individuels
  const [age, setAge] = useState(30)
  const [physicalActivity, setPhysicalActivity] = useState(50)
  const [nutrition, setNutrition] = useState(50)
  const [sleepDuration, setSleepDuration] = useState(7)
  const [stress, setStress] = useState(50)
  const [absorptionCapacity, setAbsorptionCapacity] = useState(50)
  const [isSaved, setIsSaved] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  })

  // Définir l'état de sauvegarde automatique
  const [autoSave, setAutoSave] = useState(true)

  // Chargement des valeurs depuis localStorage au montage du composant
  useEffect(() => {
    // Récupérer les paramètres sauvegardés
    const savedSettings = getLocalStorage('glassSettings')
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        
        // Paramètres individuels
        if (settings.age) setAge(settings.age)
        if (settings.physicalActivity) setPhysicalActivity(settings.physicalActivity)
        if (settings.nutrition) setNutrition(settings.nutrition)
        if (settings.sleepDuration) setSleepDuration(settings.sleepDuration)
        if (settings.stress) setStress(settings.stress)
        
        // Antécédents médicaux
        if (settings.medicalHistory) {
          setMedicalHistory(settings.medicalHistory)
        }
        
        // Si la capacité d'absorption est déjà définie, l'utiliser
        if (settings.absorptionCapacity) {
          setAbsorptionCapacity(settings.absorptionCapacity)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error)
      }
    }
  }, [])

  // Calcul de la capacité d'absorption en fonction des paramètres individuels
  useEffect(() => {
    // Ne calculer et mettre à jour que lorsque formSubmitted est true (après la première soumission)
    // ou lorsque autoSave est activé
    if (!formSubmitted && !autoSave) return;
    
    calculateAndSaveCapacity();
  }, [age, physicalActivity, nutrition, sleepDuration, stress, medicalHistory, formSubmitted, autoSave]);

  // Fonction pour calculer et sauvegarder la capacité
  const calculateAndSaveCapacity = () => {
    // Calculer la capacité d'absorption en fonction des paramètres
    const baseCapacity = 50;
    
    // Facteur d'âge (diminue avec l'âge)
    const ageFactor = age <= 30 ? 20 : 
                      age <= 40 ? 15 :
                      age <= 50 ? 10 :
                      age <= 60 ? 5 : 0;
    
    // Facteur d'activité physique (0-100%)
    const activityFactor = physicalActivity * 0.1;
    
    // Facteur de nutrition (0-100%)
    const nutritionFactor = nutrition * 0.1;
    
    // Facteur de sommeil (optimal = 7-8h)
    const sleepFactor = sleepDuration >= 7 && sleepDuration <= 8 ? 10 :
                       sleepDuration >= 6 && sleepDuration <= 9 ? 5 : 0;
    
    // Facteur de stress (négatif)
    const stressFactor = -stress * 0.1;
    
    // Facteur d'antécédents médicaux (négatif)
    let medicalFactor = 0;
    Object.values(medicalHistory).forEach(condition => {
      if (condition) medicalFactor -= 5;
    });
    
    // Calculer la capacité totale
    let capacity = baseCapacity + ageFactor + activityFactor + nutritionFactor + sleepFactor + stressFactor + medicalFactor;
    
    // Limiter la capacité entre 10% et 100%
    capacity = Math.max(10, Math.min(100, capacity));
    
    // Mettre à jour l'état
    setAbsorptionCapacity(capacity);
    
    // Sauvegarder les paramètres
    const settings = {
      age,
      physicalActivity,
      nutrition,
      sleepDuration,
      stress,
      medicalHistory,
      absorptionCapacity: capacity
    };
    
    // Sauvegarder dans localStorage
    setLocalStorage('glassSettings', JSON.stringify(settings));
    setLocalStorage('glassCapacity', capacity.toString());
    
    // Émettre un événement pour notifier les autres composants
    const event = new CustomEvent('glassCapacityUpdated', {
      detail: { capacity }
    });
    window.dispatchEvent(event);
    
    // Émettre un événement storage
    emitStorageEvent();

    return capacity;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    setFormSubmitted(true);
    const capacity = calculateAndSaveCapacity();
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleMedicalHistoryChange = (key: keyof typeof medicalHistory, checked: boolean) => {
    setMedicalHistory(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <BaseSettingsForm
      title="Paramètres du verre"
      subtitle="Configurez les facteurs individuels qui influencent la capacité d'absorption des contraintes."
      onSubmit={handleSubmit}
      showSaveMessage={isSaved}
      autoSave={autoSave}
      onAutoSaveChange={setAutoSave}
    >
      <div className="space-y-8">
        <div className="p-6 rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">Capacité d'absorption calculée</h3>
          
          <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute h-full left-0 top-0 rounded-full transition-all duration-500",
                absorptionCapacity >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                absorptionCapacity >= 60 ? "bg-gradient-to-r from-sky-500 to-sky-400" :
                absorptionCapacity >= 40 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                "bg-gradient-to-r from-rose-500 to-rose-400"
              )}
              style={{ width: `${absorptionCapacity}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-sm font-medium text-white">{absorptionCapacity}%</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 mt-2">
            Cette valeur représente la capacité du corps à absorber les contraintes. Une capacité plus élevée rend le verre plus large.
          </p>
        </div>
        
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Facteurs individuels</h3>
            
            <div className="space-y-4">
              {/* Âge */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Âge</label>
                  <span className="text-sm text-slate-400">{age} ans</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>20</span>
                  <span>45</span>
                  <span>70</span>
                </div>
              </div>
              
              {/* Activité physique */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Activité physique</label>
                  <span className="text-sm text-slate-400">{physicalActivity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={physicalActivity}
                  onChange={(e) => setPhysicalActivity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Sédentaire</span>
                  <span>Modérée</span>
                  <span>Intense</span>
                </div>
              </div>
              
              {/* Nutrition */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Nutrition</label>
                  <span className="text-sm text-slate-400">{nutrition}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={nutrition}
                  onChange={(e) => setNutrition(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Déséquilibrée</span>
                  <span>Correcte</span>
                  <span>Optimale</span>
                </div>
              </div>
              
              {/* Durée de sommeil */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Durée de sommeil</label>
                  <span className="text-sm text-slate-400">{sleepDuration} heures</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>4h</span>
                  <span>7h</span>
                  <span>10h</span>
                </div>
              </div>
              
              {/* Niveau de stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Niveau de stress</label>
                  <span className="text-sm text-slate-400">{stress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Faible</span>
                  <span>Modéré</span>
                  <span>Élevé</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Antécédents médicaux</h3>
            <p className="text-sm text-slate-400 mb-4">
              Cochez les options qui correspondent à votre situation médicale actuelle ou passée.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="neckProblems" 
                  checked={medicalHistory.neckProblems}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('neckProblems', checked === true)}
                />
                <label htmlFor="neckProblems" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Problèmes cervicaux
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backProblems" 
                  checked={medicalHistory.backProblems}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('backProblems', checked === true)}
                />
                <label htmlFor="backProblems" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Problèmes dorsaux ou lombaires
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shoulderProblems" 
                  checked={medicalHistory.shoulderProblems}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('shoulderProblems', checked === true)}
                />
                <label htmlFor="shoulderProblems" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Problèmes d'épaule
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wristProblems" 
                  checked={medicalHistory.wristProblems}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('wristProblems', checked === true)}
                />
                <label htmlFor="wristProblems" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Problèmes de poignet
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kneeProblems" 
                  checked={medicalHistory.kneeProblems}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('kneeProblems', checked === true)}
                />
                <label htmlFor="kneeProblems" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Problèmes de genou
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousTMS" 
                  checked={medicalHistory.previousTMS}
                  onCheckedChange={(checked) => handleMedicalHistoryChange('previousTMS', checked === true)}
                />
                <label htmlFor="previousTMS" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Antécédents de TMS
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSettingsForm>
  )
} 