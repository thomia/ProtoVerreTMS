"use client"

import { useState, useEffect } from 'react'
import BaseSettingsForm, { InfoTooltip, getColorClass } from './base-settings-form'
import { Check, Dumbbell, Activity, Moon, Stars, Clock, Sparkles } from 'lucide-react'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'

// Définitions des facteurs de récupération
const recoveryFactorsDefinitions = {
  activeBreaks: "En plus des pauses légales de travail, les pauses actives permettent de relâcher les tissus en utilisant ce temps pour organiser son travail (ranger son poste, préparation de la tâche suivante, faire une remontée d'informations..)",
  stretching: "Exercices d'étirement pour détendre les muscles",
  relaxation: "Techniques de relaxation pour réduire le stress",
  sleepQuality: "Qualité du sommeil pour la récupération"
}

export default function StrawSettingsForm() {
  // État pour les pauses actives
  const [activeBreaks, setActiveBreaks] = useState({
    frequency: 3, // fois par jour
    duration: 10, // minutes
    isActive: false
  })

  // État pour les étirements
  const [stretching, setStretching] = useState({
    morning: false,
    isActive: false
  })

  // État pour la relaxation
  const [relaxation, setRelaxation] = useState({
    isActive: false
  })

  // État pour le sommeil
  const [sleep, setSleep] = useState({
    duration: 7, // heures
    quality: 7 // 1-10
  })

  // État pour la capacité de récupération calculée
  const [recoveryCapacity, setRecoveryCapacity] = useState(0)

  // Calculer la capacité de récupération
  const calculateRecoveryCapacity = () => {
    // Normalisation des pauses actives (0-100)
    const breaksScore = (
      (activeBreaks.isActive ? 100 : 0) * 0.4 +
      (activeBreaks.duration / 20) * 100 * 0.6
    )
    
    // Normalisation des étirements (0-100)
    const stretchingScore = (
      (stretching.morning ? 50 : 0) +
      (stretching.isActive ? 50 : 0)
    )
    
    // Normalisation de la relaxation (0-100)
    const relaxationScore = relaxation.isActive ? 100 : 0
    
    // Normalisation du sommeil (0-100)
    const sleepScore = (
      ((sleep.duration - 4) / 4) * 100 * 0.6 +
      ((sleep.quality - 1) / 9) * 100 * 0.4
    )
    
    return Math.round(
      (breaksScore * 0.3) +
      (stretchingScore * 0.3) +
      (relaxationScore * 0.2) +
      (sleepScore * 0.2)
    )
  }

  // Mettre à jour la capacité de récupération lorsque les paramètres changent
  useEffect(() => {
    const capacity = calculateRecoveryCapacity();
    setRecoveryCapacity(capacity);
  }, [activeBreaks, stretching, relaxation, sleep]);

  // Description de la capacité de récupération
  const getRecoveryDescription = (value: number) => {
    if (value < 40) return "Faible"
    if (value < 60) return "Modérée"
    if (value < 80) return "Bonne"
    return "Excellente"
  }

  // Fonction de sauvegarde
  const handleSave = () => {
    // Sauvegarder les paramètres
    const recoveryCapacity = calculateRecoveryCapacity()
    
    setLocalStorage('recoveryCapacity', recoveryCapacity.toString())
    setLocalStorage('strawActiveBreaks', JSON.stringify(activeBreaks))
    setLocalStorage('strawStretching', JSON.stringify(stretching))
    setLocalStorage('strawRelaxation', JSON.stringify(relaxation))
    setLocalStorage('strawSleep', JSON.stringify(sleep))
    
    // Émettre un événement de stockage pour notifier les autres composants
    emitStorageEvent()
    
    // Émettre un événement personnalisé pour la mise à jour du composant paille
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('strawUpdateEvent', {
        detail: { recoveryCapacity }
      })
      window.dispatchEvent(event)
    }
  }

  // Charger les paramètres sauvegardés
  useEffect(() => {
    // Récupérer les pauses actives
    const savedActiveBreaks = getLocalStorage('strawActiveBreaks')
    if (savedActiveBreaks) {
      try {
        setActiveBreaks(JSON.parse(savedActiveBreaks))
      } catch (e) {
        console.error("Erreur lors du chargement des pauses actives:", e)
      }
    }

    // Récupérer les étirements
    const savedStretching = getLocalStorage('strawStretching')
    if (savedStretching) {
      try {
        setStretching(JSON.parse(savedStretching))
      } catch (e) {
        console.error("Erreur lors du chargement des étirements:", e)
      }
    }

    // Récupérer la relaxation
    const savedRelaxation = getLocalStorage('strawRelaxation')
    if (savedRelaxation) {
      try {
        setRelaxation(JSON.parse(savedRelaxation))
      } catch (e) {
        console.error("Erreur lors du chargement de la relaxation:", e)
      }
    }

    // Récupérer le sommeil
    const savedSleep = getLocalStorage('strawSleep')
    if (savedSleep) {
      try {
        setSleep(JSON.parse(savedSleep))
      } catch (e) {
        console.error("Erreur lors du chargement du sommeil:", e)
      }
    }
  }, [])

  return (
    <BaseSettingsForm
      title="Paramètres de la Paille"
      description="La récupération joue un rôle clé, elle permet aux tissus (tendons, muscles, articulations) d'éliminer progressivement les contraintes subies."
      currentValue={calculateRecoveryCapacity()}
      getValueDescription={getRecoveryDescription}
      onSubmit={handleSave}
      scoreType="straw"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pauses actives */}
        <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/50">
          <div className="flex flex-col mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Pauses actives</h3>
            <p className="text-sm text-gray-300">
              En plus des pauses légales de travail, les pauses actives permettent de relâcher les tissus en utilisant ce temps pour organiser son travail (ranger son poste, préparation de la tâche suivante, faire une remontée d'informations..)
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Activation des pauses */}
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setActiveBreaks({
                  ...activeBreaks,
                  isActive: !activeBreaks.isActive
                })}
                className={`
                  relative flex items-center justify-center p-4 rounded-xl w-full
                  border-2 transition-all duration-200
                  ${activeBreaks.isActive 
                    ? 'border-green-500' 
                    : 'border-gray-700 hover:border-green-500/50'
                  }
                `}
              >
                <div className={`
                  w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors mr-3
                  ${activeBreaks.isActive 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-600'
                  }
                `}>
                  {activeBreaks.isActive && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-lg font-medium ${activeBreaks.isActive ? 'text-green-400' : 'text-white'}`}>Pauses actives</span>
              </button>
            </div>

            {/* Durée */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-400" />
                <label className="text-base font-medium text-white">
                  Durée des pauses
                </label>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={5}
                value={activeBreaks.duration}
                onChange={(e) => setActiveBreaks({
                  ...activeBreaks,
                  duration: Number(e.target.value)
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">5min</span>
                <span className="font-semibold text-green-400">{activeBreaks.duration}min</span>
                <span className="text-gray-400">20min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercices de récupération */}
        <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/50">
          <h3 className="text-lg font-semibold text-white mb-3">
            Exercices de récupération
            <InfoTooltip content={recoveryFactorsDefinitions.stretching} />
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Échauffement matinal */}
            <button
              type="button"
              onClick={() => setStretching({
                ...stretching,
                morning: !stretching.morning
              })}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl
                border-2 transition-all duration-200 min-h-[140px]
                ${stretching.morning 
                  ? 'border-green-500' 
                  : 'border-gray-700 hover:border-green-500/50'
                }
              `}
            >
              <div className="absolute top-2 right-2">
                <div className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                  ${stretching.morning 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-600'
                  }
                `}>
                  {stretching.morning && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <Dumbbell className={`w-6 h-6 mb-3 ${stretching.morning ? 'text-green-400' : 'text-gray-400'}`} />
              <h4 className={`text-lg font-semibold ${stretching.morning ? 'text-green-400' : 'text-white'} text-center mb-1`}>Échauffement</h4>
              <p className="text-xs text-center text-gray-400">Le matin avant de commencer<br/>ou juste avant la tâche physique</p>
            </button>

            {/* Étirements */}
            <button
              type="button"
              onClick={() => setStretching({
                ...stretching,
                isActive: !stretching.isActive
              })}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl
                border-2 transition-all duration-200 min-h-[140px]
                ${stretching.isActive 
                  ? 'border-green-500' 
                  : 'border-gray-700 hover:border-green-500/50'
                }
              `}
            >
              <div className="absolute top-2 right-2">
                <div className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                  ${stretching.isActive 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-600'
                  }
                `}>
                  {stretching.isActive && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <Activity className={`w-6 h-6 mb-3 ${stretching.isActive ? 'text-green-400' : 'text-gray-400'}`} />
              <h4 className={`text-lg font-semibold ${stretching.isActive ? 'text-green-400' : 'text-white'} text-center mb-1`}>Étirements</h4>
              <p className="text-xs text-center text-gray-400">Pendant la journée</p>
            </button>
          </div>
        </div>

        {/* Relaxation */}
        <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/50">
          <div className="flex flex-col mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Relaxation</h3>
            <p className="text-sm text-gray-300">
              Les exercices de relaxation permettent de réduire le stress et d'améliorer la récupération mentale et physique.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setRelaxation({
              ...relaxation,
              isActive: !relaxation.isActive
            })}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl w-full
              border-2 transition-all duration-200
              ${relaxation.isActive 
                ? 'border-green-500' 
                : 'border-gray-700 hover:border-green-500/50'
              }
            `}
          >
            <Sparkles className={`w-6 h-6 mb-2 ${relaxation.isActive ? 'text-green-400' : 'text-gray-400'}`} />
            <h4 className={`text-lg font-semibold ${relaxation.isActive ? 'text-green-400' : 'text-white'} text-center`}>Exercices de relaxation</h4>
          </button>
        </div>

        {/* Sommeil */}
        <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/50">
          <h3 className="text-lg font-semibold text-white mb-3">
            Sommeil
            <InfoTooltip content={recoveryFactorsDefinitions.sleepQuality} />
          </h3>

          <div className="space-y-4">
            {/* Durée moyenne de sommeil */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-green-400" />
                <label className="text-base font-medium text-white">
                  Durée moyenne de sommeil
                </label>
              </div>
              <input
                type="range"
                min={4}
                max={10}
                step={0.5}
                value={sleep.duration}
                onChange={(e) => setSleep({
                  ...sleep,
                  duration: Number(e.target.value)
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">4h</span>
                <span className="font-semibold text-green-400">{sleep.duration}h/nuit</span>
                <span className="text-gray-400">10h</span>
              </div>
            </div>

            {/* Qualité du sommeil */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stars className="w-5 h-5 text-green-400" />
                <label className="text-base font-medium text-white">
                  Qualité du sommeil
                </label>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={sleep.quality}
                onChange={(e) => setSleep({
                  ...sleep,
                  quality: Number(e.target.value)
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Mauvaise</span>
                <span className="font-semibold text-green-400">{sleep.quality}/10</span>
                <span className="text-gray-400">Excellente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSettingsForm>
  )
} 