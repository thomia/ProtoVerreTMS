"use client"

import * as React from 'react'
import { useCallback, useEffect, useState, useMemo } from 'react'
import BaseSettingsForm from '@/components/settings/base-settings-form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { Checkbox } from "@/components/ui/checkbox"
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
  const [absorptionCapacity, setAbsorptionCapacity] = useState(50)
  const [isSaved, setIsSaved] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
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
    
    setIsInitialized(true)
  }, [])

  // Fonction pour calculer la capacité d'absorption (mémorisée)
  const calculateCapacity = useCallback(() => {
    // Calculer la capacité d'absorption en fonction des paramètres
    const baseCapacity = 0;
    
    // Facteur d'âge (diminue avec l'âge)
    const ageFactor = age <= 30 ? 20 : 
                      age <= 40 ? 15 :
                      age <= 50 ? 10 :
                      age <= 60 ? 5 : 0;
    
    // Facteur d'activité physique (0-100%)
    const activityFactor = physicalActivity * 2;
    
    // Facteur de nutrition (0-100%)
    const nutritionFactor = nutrition * 2;
    
    // Facteur de sommeil (10% par heure jusqu'à 7h)
    const sleepFactor = Math.min(sleepDuration, 7) * 10;
    
    // Facteur d'antécédents médicaux (négatif)
    let medicalFactor = 0;
    Object.values(medicalHistory).forEach(condition => {
      if (condition) medicalFactor -= 5;
    });
    
    // Calculer la capacité totale
    let capacity = baseCapacity + ageFactor + activityFactor + nutritionFactor + sleepFactor + medicalFactor;
    
    // Limiter la capacité entre 10% et 100%
    capacity = Math.max(10, Math.min(100, capacity));
    
    return Math.round(capacity);
  }, [age, physicalActivity, nutrition, sleepDuration, medicalHistory]);

  // Mémoriser la capacité calculée
  const calculatedCapacity = useMemo(() => calculateCapacity(), [calculateCapacity]);

  // Sauvegarder la capacité calculée
  const saveCapacity = useCallback((capacity: number) => {
    // Mettre à jour l'état
    setAbsorptionCapacity(capacity);
    
    // Sauvegarder les paramètres
    const settings = {
      age,
      physicalActivity,
      nutrition,
      sleepDuration,
      medicalHistory,
      absorptionCapacity: capacity
    };
    
    console.log('Sauvegarde de la capacité:', capacity);
    
    // Sauvegarder dans localStorage
    setLocalStorage('glassSettings', JSON.stringify(settings));
    setLocalStorage('glassCapacity', capacity.toString());
    
    // Émettre un événement pour notifier les autres composants
    try {
      // Émission de l'événement personnalisé
      const event = new CustomEvent('glassCapacityUpdated', {
        detail: { capacity },
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
      window.dispatchEvent(event);
      
      console.log('Événement émis:', event);
    } catch (error) {
      console.error('Erreur lors de l\'émission de l\'événement:', error);
    }
    
    // Émettre un événement storage
    emitStorageEvent();
    
    return capacity;
  }, [age, physicalActivity, nutrition, sleepDuration, medicalHistory]);

  // Calculer et sauvegarder la capacité quand nécessaire
  useEffect(() => {
    if (!isInitialized) return;
    
    // Ne calculer et mettre à jour que lorsque formSubmitted est true (après la première soumission)
    // ou lorsque autoSave est activé
    if (!formSubmitted && !autoSave) return;
    
    // Utiliser un debounce pour éviter les mises à jour trop fréquentes
    const debounceTimer = setTimeout(() => {
      const capacity = calculateCapacity();
      if (capacity !== absorptionCapacity) {
        saveCapacity(capacity);
      }
    }, 300); // 300ms de délai
    
    return () => clearTimeout(debounceTimer);
  }, [calculatedCapacity, formSubmitted, autoSave, isInitialized, calculateCapacity, saveCapacity, absorptionCapacity]);

  // Gérer la soumission du formulaire (mémorisée)
  const handleSubmit = useCallback(() => {
    setFormSubmitted(true);
    const capacity = calculateCapacity();
    saveCapacity(capacity);
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  }, [calculateCapacity, saveCapacity]);

  // Mettre à jour les facteurs individuels
  const updateIndividualFactor = useCallback((factorId: string, value: number) => {
    // Utiliser un setTimeout pour éviter les mises à jour trop fréquentes
    setTimeout(() => {
      if (factorId === 'age') setAge(value);
      else if (factorId === 'physicalActivity') setPhysicalActivity(value);
      else if (factorId === 'nutrition') setNutrition(value);
      else if (factorId === 'sleepDuration') setSleepDuration(value);
    }, 0);
  }, []);

  // Gérer les changements d'antécédents médicaux (mémorisée)
  const handleMedicalHistoryChange = useCallback((key: MedicalHistoryKey, checked: boolean) => {
    // Utiliser un setTimeout pour éviter les mises à jour trop fréquentes
    setTimeout(() => {
      setMedicalHistory(prev => ({
        ...prev,
        [key]: checked
      }));
    }, 0);
  }, []);

  const individualFactors = [
    {
      id: 'age',
      label: 'Âge',
      min: 18,
      max: 65,
      unit: 'ans',
      value: age
    },
    {
      id: 'physicalActivity',
      label: 'Activité sportive',
      min: 0,
      max: 7,
      unit: 'fois/semaine',
      value: physicalActivity
    },
    {
      id: 'nutrition',
      label: 'Alimentation',
      min: 1,
      max: 5,
      unit: '',
      value: nutrition,
      getDisplayValue: (value: number) => {
        if (value === 1) return "Très déséquilibrée";
        if (value === 2) return "Déséquilibrée";
        if (value === 3) return "Moyenne";
        if (value === 4) return "Équilibrée";
        if (value === 5) return "Très équilibrée";
        return "";
      }
    },
    {
      id: 'sleepDuration',
      label: 'Sommeil',
      min: 5,
      max: 9,
      unit: 'h',
      value: sleepDuration
    }
  ];

  // Description de la capacité d'absorption
  const getAbsorptionDescription = (value: number) => {
    if (value < 40) return "Faible capacité d'absorption"
    if (value < 60) return "Capacité d'absorption modérée"
    if (value < 80) return "Bonne capacité d'absorption"
    return "Excellente capacité d'absorption"
  }

  return (
    <BaseSettingsForm
      title="Paramètres du Verre"
      description="Chaque individu présente des caractéristiques physiques et des habitudes de vie qui lui sont propres. Ces facteurs individuels doivent impérativement être pris en compte lorsqu'il s'agit d'évaluer le risque TMS ou d'anticiper la probabilité d'accident de travail."
      currentValue={calculatedCapacity}
      getValueDescription={getAbsorptionDescription}
      onSubmit={handleSubmit}
      scoreType="glass"
    >
      <div className="space-y-8">
        {/* Facteurs individuels */}
        <div className="grid grid-cols-2 gap-6">
          {individualFactors.map((factor) => (
            <div 
              key={factor.id} 
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-slate-700/50 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xl font-medium text-white">{factor.label}</Label>
                <span className="text-lg font-medium text-white bg-blue-900/40 border border-blue-700/30 px-3 py-1.5 rounded-md">
                  {factor.getDisplayValue ? factor.getDisplayValue(factor.value) : `${factor.value}${factor.unit}`}
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min={factor.min}
                  max={factor.max}
                  value={factor.value}
                  onChange={(e) => updateIndividualFactor(factor.id, parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:bg-white 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:duration-150
                    [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between mt-2 text-base text-white/60">
                  <span>{factor.min}{factor.unit}</span>
                  <span>{factor.max}{factor.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Antécédents médicaux */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white mb-2">Antécédents médicaux</h3>
          <div className="grid grid-cols-2 gap-4">
            {pathologies.map((pathology) => {
              const isSelected = medicalHistory[pathology.id as MedicalHistoryKey];
              return (
                <button
                  key={pathology.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMedicalHistoryChange(pathology.id as MedicalHistoryKey, !isSelected);
                  }}
                  className={`w-full text-left transition-all duration-200 px-4 py-3 rounded-lg group
                    ${isSelected 
                      ? 'bg-blue-900/30 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                      : 'bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-2 border-slate-700/50 hover:border-blue-700/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`text-lg font-medium mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {pathology.label}
                      </p>
                      <p className={`text-base ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {pathology.description}
                      </p>
                    </div>
                    <div className={`ml-3 rounded-full p-1.5 
                      ${isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-700 text-gray-400'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`w-5 h-5 transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BaseSettingsForm>
  )
} 