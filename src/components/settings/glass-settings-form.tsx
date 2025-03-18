"use client"

import { useState, useEffect } from 'react'
import BaseSettingsForm from '@/components/settings/base-settings-form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

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
  const [individualParams, setIndividualParams] = useState<IndividualParams>({
    age: 30,
    physicalActivity: 3,
    nutrition: 3,
    sleepDuration: 7
  });

  const individualFactors = [
    {
      id: 'age',
      label: 'Âge',
      min: 18,
      max: 65,
      unit: 'ans',
      value: individualParams.age
    },
    {
      id: 'physicalActivity',
      label: 'Activité sportive',
      min: 0,
      max: 7,
      unit: 'fois/semaine',
      value: individualParams.physicalActivity
    },
    {
      id: 'nutrition',
      label: 'Alimentation',
      min: 1,
      max: 5,
      unit: '/5',
      value: individualParams.nutrition
    },
    {
      id: 'sleepDuration',
      label: 'Sommeil',
      min: 5,
      max: 9,
      unit: 'h',
      value: individualParams.sleepDuration
    }
  ];

  // État pour les pathologies
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  })

  // Calculer la capacité d'absorption
  const calculateAbsorptionCapacity = () => {
    // Normalisation de l'âge (18-65 ans -> 0-100)
    const ageScore = Math.max(0, Math.min(100, ((65 - individualParams.age) / 47) * 100))
    
    // Normalisation de la condition physique (0-7 -> 0-100)
    const physicalScore = (individualParams.physicalActivity / 7) * 100
    
    // Normalisation de l'alimentation (1-5 -> 0-100)
    const nutritionScore = ((individualParams.nutrition - 1) / 4) * 100
    
    // Normalisation du sommeil (5-9h -> 0-100)
    const sleepScore = ((individualParams.sleepDuration - 5) / 4) * 100
    
    // Impact des pathologies (chaque pathologie réduit de 10%)
    const pathologyCount = Object.values(medicalHistory).filter(Boolean).length
    const pathologyImpact = Math.max(0, 100 - (pathologyCount * 10))
    
    // Calcul pondéré de la capacité d'absorption
    const weightedScore = (
      (ageScore * 0.25) +          // 25% pour l'âge
      (physicalScore * 0.25) +     // 25% pour l'activité sportive
      (nutritionScore * 0.25) +    // 25% pour l'alimentation
      (sleepScore * 0.25)          // 25% pour le sommeil
    )

    // Application de l'impact des pathologies
    return Math.round(weightedScore * (pathologyImpact / 100))
  }

  // Description de la capacité d'absorption
  const getAbsorptionDescription = (value: number) => {
    if (value < 40) return "Faible capacité d'absorption"
    if (value < 60) return "Capacité d'absorption modérée"
    if (value < 80) return "Bonne capacité d'absorption"
    return "Excellente capacité d'absorption"
  }

  // Fonction de sauvegarde
  const handleSave = () => {
    const absorptionCapacity = calculateAbsorptionCapacity()
    localStorage.setItem('glassSettings', JSON.stringify({
      absorptionCapacity,
      individualParams,
      medicalHistory
    }))
    localStorage.setItem('glassCapacity', absorptionCapacity.toString())
    
    // Émettre un événement personnalisé pour notifier le tableau de bord
    const event = new CustomEvent('glassCapacityUpdated', { 
      detail: { capacity: absorptionCapacity }
    })
    window.dispatchEvent(event)
  }

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const savedSettings = localStorage.getItem('glassSettings')
    if (savedSettings) {
      const { individualParams: savedParams, medicalHistory: savedHistory } = JSON.parse(savedSettings)
      setIndividualParams(savedParams)
      setMedicalHistory(savedHistory)
    }
  }, [])

  const handleMedicalHistoryChange = (key: MedicalHistoryKey) => {
    setMedicalHistory(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <BaseSettingsForm
      title="Paramètres du Verre"
      description="Chaque individu présente des caractéristiques physiques et des habitudes de vie qui lui sont propres. Ces facteurs individuels doivent impérativement être pris en compte lorsqu'il s'agit d'évaluer le risque TMS ou d'anticiper la probabilité d'accident de travail."
      currentValue={calculateAbsorptionCapacity()}
      getValueDescription={getAbsorptionDescription}
      onSubmit={handleSave}
      scoreType="glass"
    >
      <div className="space-y-8">
        {/* Facteurs individuels */}
        <div className="grid grid-cols-2 gap-6">
          {individualFactors.map((factor) => (
            <div 
              key={factor.id} 
              className="bg-gray-800/40 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xl font-medium text-gray-200">{factor.label}</Label>
                <span className="text-lg font-medium text-gray-200 bg-gray-700/50 px-3 py-1.5 rounded-md">
                  {factor.value}{factor.unit}
                </span>
          </div>
              <div className="relative pt-1">
            <input
              type="range"
                  min={factor.min}
                  max={factor.max}
                  value={factor.value}
                  onChange={(e) => setIndividualParams(prev => ({
                    ...prev,
                    [factor.id]: parseInt(e.target.value)
                  }))}
                  className="w-full h-2.5 bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-blue-500
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:bg-white 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:duration-150
                    [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between mt-2 text-base text-gray-400">
                  <span>{factor.min}{factor.unit}</span>
                  <span>{factor.max}{factor.unit}</span>
            </div>
          </div>
        </div>
          ))}
      </div>
      
      {/* Antécédents médicaux */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200 mb-2">Antécédents médicaux</h3>
          <div className="grid grid-cols-2 gap-4">
            {pathologies.map((pathology) => {
              const isSelected = medicalHistory[pathology.id as MedicalHistoryKey];
              return (
                <button
                  key={pathology.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMedicalHistoryChange(pathology.id as MedicalHistoryKey);
                  }}
                  className={`w-full text-left transition-all duration-200 px-4 py-3 rounded-lg group
                    ${isSelected 
                      ? 'bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                      : 'bg-gray-800/40 border-2 border-transparent hover:border-gray-600'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`text-lg font-medium mb-1 ${isSelected ? 'text-blue-400' : 'text-gray-300'}`}>
                        {pathology.label}
                      </p>
                      <p className={`text-base ${isSelected ? 'text-blue-300/80' : 'text-gray-500'}`}>
                        {pathology.description}
                      </p>
            </div>
                    <div className={`ml-3 rounded-full p-1.5 
                      ${isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700/50 text-gray-400'
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