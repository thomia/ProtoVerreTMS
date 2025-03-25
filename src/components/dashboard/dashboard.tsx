"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import TapComponent from './tap-component'
import GlassComponent from './glass-component'
import StrawComponent from './straw-component'
import React from 'react'
import ParameterModals from './parameter-modals'
import { Settings, Droplet, Wind, GlassWater, RectangleHorizontal, Cloud, ActivitySquare, Activity, Lightbulb, AlertTriangle, AlertCircle, HelpCircle, ExternalLink, BookOpen, Scale, FileText, Stethoscope, AlertOctagon, InfoIcon, Clock } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { EnvironmentParticles } from './environment-particles'
import { ModelDescription } from '../ui/model-description'
import { AnimatedTitle } from '../ui/animated-title'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { CostPanel } from "./cost-panel"
import { Slider } from "@/components/ui/slider"
import { FastForward } from 'lucide-react'

export default function Dashboard() {
  // État pour garantir que le composant est monté (côté client uniquement)
  const [isMounted, setIsMounted] = useState(false)
  const [flowRate, setFlowRate] = useState(0)
  const [fillLevel, setFillLevel] = useState(0)
  const [absorptionRate, setAbsorptionRate] = useState(0)
  const [glassWidth, setGlassWidth] = useState(20)
  const [glassWidthPx, setGlassWidthPx] = useState(200)
  const [glassCapacity, setGlassCapacity] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const [environmentScore, setEnvironmentScore] = useState(0)
  const [accidentRisk, setAccidentRisk] = useState(0)
  const [tmsRisk, setTmsRisk] = useState(0)
  const [tmsExposureLevel, setTmsExposureLevel] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  
  // États pour les angles et ajustements de posture
  const [postureScores, setPostureScores] = useState({
    neck: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0,
    trunk: 0,
    legs: 0
  })

  const [postureAdjustments, setPostureAdjustments] = useState({
    neckRotation: false,
    neckInclination: false,
    shoulderRaised: false,
    shoulderAbduction: false,
    shoulderSupport: false,
    elbowOpposite: false,
    wristDeviation: false,
    wristPartialRotation: false,
    wristFullRotation: false
  })

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  })
  
  // États pour les modales de paramètres
  const [isGlassModalOpen, setGlassModalOpen] = useState(false)
  const [isTapModalOpen, setTapModalOpen] = useState(false)
  const [isStrawModalOpen, setStrawModalOpen] = useState(false)
  const [isStrawEnabled, setIsStrawEnabled] = useState(true)
  const [activeModal, setActiveModal] = useState<'tap' | 'glass' | 'straw' | 'bubble' | null>(null)

  // Référence pour mesurer la largeur réelle du verre
  const glassRef = React.useRef<HTMLDivElement>(null)
  const lastFlowRateRef = React.useRef<number>(0)

  // États pour le chronomètre de travail (8h)
  const [workTime, setWorkTime] = useState(0) // temps écoulé en minutes simulées
  const [workStartTime, setWorkStartTime] = useState(Date.now()) // moment de démarrage du chrono
  const [lastSimulationSpeed, setLastSimulationSpeed] = useState(1) // pour suivre les changements de vitesse

  // Effet pour marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Charger les paramètres initiaux
  useEffect(() => {
    if (!isMounted) return;

    // Charger les paramètres stockés
    const savedFlowRate = getLocalStorage('flowRate');
    const savedFillLevel = getLocalStorage('fillLevel');
    const savedGlassCapacity = getLocalStorage('glassCapacity');
    const savedEnvironmentScore = getLocalStorage('environmentScore');

    if (savedFlowRate) {
      try {
        setFlowRate(Number(savedFlowRate));
        lastFlowRateRef.current = Number(savedFlowRate);
      } catch (e) {
        console.error("Erreur lors du chargement du débit:", e);
      }
    }

    if (savedFillLevel) {
      try {
        setFillLevel(Number(savedFillLevel));
      } catch (e) {
        console.error("Erreur lors du chargement du niveau de remplissage:", e);
      }
    }

    if (savedGlassCapacity) {
      try {
        setGlassCapacity(Number(savedGlassCapacity));
      } catch (e) {
        console.error("Erreur lors du chargement de la capacité du verre:", e);
      }
    }

    if (savedEnvironmentScore) {
      try {
        setEnvironmentScore(Number(savedEnvironmentScore));
      } catch (e) {
        console.error("Erreur lors du chargement du score environnemental:", e);
      }
    }

    // Écouter l'événement de mise à jour de la capacité du verre
    const handleGlassCapacityUpdate = (e: CustomEvent<{ capacity: number }>) => {
      if (e.detail && typeof e.detail.capacity === 'number') {
        setGlassCapacity(e.detail.capacity);
      }
    };

    window.addEventListener('glassCapacityUpdated', handleGlassCapacityUpdate as EventListener);
    window.addEventListener('environmentScoreUpdated', ((e: CustomEvent<{ score: number }>) => {
      if (e.detail && typeof e.detail.score === 'number') {
        setEnvironmentScore(e.detail.score);
      }
    }) as EventListener);

    return () => {
      window.removeEventListener('glassCapacityUpdated', handleGlassCapacityUpdate as EventListener);
      window.removeEventListener('environmentScoreUpdated', (() => {}) as EventListener);
    };
  }, [isMounted]);

  // Charger les paramètres de posture depuis localStorage
  useEffect(() => {
    if (!isMounted) return;
    
    const loadPostureSettings = () => {
      const savedConstraints = getLocalStorage('tapConstraints')
      if (savedConstraints) {
        try {
          const parsed = JSON.parse(savedConstraints)
          if (parsed.postureScores) setPostureScores(parsed.postureScores)
          if (parsed.postureAdjustments) setPostureAdjustments(parsed.postureAdjustments)
        } catch (e) {
          console.error("Erreur lors du chargement des paramètres de posture:", e)
        }
      }
    }
    
    // Charger au démarrage
    loadPostureSettings()
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      loadPostureSettings()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isMounted])

  // Charger les antécédents médicaux depuis localStorage
  useEffect(() => {
    if (!isMounted) return;
    
    const savedGlassSettings = getLocalStorage('glassSettings')
    if (savedGlassSettings) {
      try {
        const settings = JSON.parse(savedGlassSettings)
        if (settings.medicalHistory) {
          setMedicalHistory(settings.medicalHistory)
        }
      } catch (e) {
        console.error("Erreur lors du chargement des antécédents médicaux:", e)
      }
    }
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      const savedSettings = getLocalStorage('glassSettings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          if (settings.medicalHistory) {
            setMedicalHistory(settings.medicalHistory)
          }
        } catch (e) {
          console.error("Erreur lors de la mise à jour des antécédents médicaux:", e)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isMounted])

  // Charger le niveau de remplissage depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedFillLevel = localStorage.getItem('fillLevel')
    if (savedFillLevel) {
      try {
        setFillLevel(Number(savedFillLevel))
      } catch (e) {
        console.error("Erreur lors du chargement du niveau de remplissage:", e)
      }
    }
  }, [])

  // Charger le débit depuis localStorage et réagir aux changements
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
      const savedFlowRate = localStorage.getItem('flowRate')
      if (savedFlowRate) {
        try {
        setFlowRate(Number(savedFlowRate))
        lastFlowRateRef.current = Number(savedFlowRate)
        } catch (e) {
          console.error("Erreur lors du chargement du débit:", e)
      }
    }
    
    // Écouter l'événement personnalisé pour les mises à jour du débit
    const handleTapUpdate = (e: CustomEvent<{ flowRate: number }>) => {
      const newFlowRate = e.detail.flowRate
      if (!isNaN(newFlowRate)) {
        setFlowRate(newFlowRate)
        lastFlowRateRef.current = newFlowRate
      }
    }
    
    window.addEventListener('tapFlowUpdated', handleTapUpdate as EventListener)
    
    // Vérifier périodiquement les changements dans localStorage
    const intervalId = setInterval(() => {
      const savedFlowRate = localStorage.getItem('flowRate')
      if (savedFlowRate) {
        try {
          const parsedFlowRate = parseInt(savedFlowRate)
          if (!isNaN(parsedFlowRate)) {
            setFlowRate(parsedFlowRate)
            lastFlowRateRef.current = parsedFlowRate
          }
        } catch (e) {
          console.error("Erreur lors du chargement du débit:", e)
        }
      }
    }, 100)
    
    return () => {
      window.removeEventListener('tapFlowUpdated', handleTapUpdate as EventListener)
      clearInterval(intervalId)
    }
  }, [])

  // Charger les facteurs personnels depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCapacity = localStorage.getItem('glassCapacity')
    if (savedCapacity) {
      try {
        const capacity = parseInt(savedCapacity)
        // La largeur du verre est proportionnelle à la capacité d'absorption
        // 10% de capacité = 20% de largeur
        // 100% de capacité = 90% de largeur
        const newWidth = 20 + (capacity / 100) * 70
        console.log("Chargement de la capacité:", {
          capacité: capacity,
          nouvelleLargeur: newWidth,
          ancienneLargeur: glassWidth
        })
        if (newWidth !== glassWidth) {
          setGlassWidth(newWidth)
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la capacité d'absorption:", e)
      }
    }
  }, [glassWidth])

  // Charger l'état d'activation de la paille au démarrage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedEnabled = localStorage.getItem('strawEnabled')
    if (savedEnabled !== null) {
      try {
        setIsStrawEnabled(savedEnabled === 'true')
      } catch (e) {
        console.error("Erreur lors du chargement de l'état d'activation de la paille:", e)
      }
    }
  }, [])

  // Gérer le changement d'état de la paille
  const handleStrawToggle = () => {
    const newState = !isStrawEnabled
    setIsStrawEnabled(newState)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('strawEnabled', newState.toString())
    }
  }

  // Charger la capacité de récupération depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCapacity = localStorage.getItem('recoveryCapacity')
    if (savedCapacity) {
      try {
        setAbsorptionRate(Number(savedCapacity))
      } catch (e) {
        console.error("Erreur lors du chargement de la capacité de récupération:", e)
      }
    }
  }, [])

  // Mettre à jour les variables de simulation
  useEffect(() => {
    if (isPaused) return;
    
    const updateInterval = setInterval(() => {
      const now = Date.now()
      const deltaTime = Math.min(now - lastUpdateTime, 100)
      
      // Calculer le facteur d'agitation en direct
      let agitationFactor = 1.0;
      if (environmentScore > 0) {
        // Augmentation de 3% pour chaque 10% de score d'agitation
        agitationFactor = 1 + (environmentScore * 0.003);
      }
      
      setFillLevel(prevLevel => {
        const capacityFactor = glassWidth / 20
        // Appliquer le facteur d'agitation au débit
        const adjustedFlowRate = flowRate * agitationFactor;
        const netFlow = isStrawEnabled 
          ? (adjustedFlowRate - absorptionRate) / capacityFactor 
          : adjustedFlowRate / capacityFactor
        const newLevel = prevLevel + (netFlow * deltaTime * simulationSpeed / 100000)
        return Math.min(Math.max(newLevel, 0), 100)
      })
      
      setLastUpdateTime(now)
    }, 50)
    
    return () => clearInterval(updateInterval)
  }, [flowRate, lastUpdateTime, isPaused, glassWidth, absorptionRate, isStrawEnabled, simulationSpeed, environmentScore])
  
  // Gérer l'exposition TMS basée sur le niveau de remplissage
  useEffect(() => {
    if (isPaused) return;

    const updateInterval = setInterval(() => {
      if (fillLevel >= 80) {
        setTmsExposureLevel(prev => Math.min(100, prev + 0.1 * simulationSpeed))
      } else {
        setTmsExposureLevel(prev => Math.max(0, prev - 0.05 * simulationSpeed))
      }
    }, 1000)

    return () => clearInterval(updateInterval)
  }, [fillLevel, isPaused, simulationSpeed])

  // Gérer le chronomètre de travail
  useEffect(() => {
    if (isPaused) return;
    
    const updateInterval = setInterval(() => {
      const now = Date.now();
      const elapsedRealSeconds = (now - workStartTime) / 1000;

      // 120 secondes réelles = 8 heures simulées (480 minutes)
      // 1 seconde réelle = 4 minutes simulées
      const simulatedMinutes = elapsedRealSeconds * 4 * simulationSpeed;

      // Limiter à 8h00 maximum (480 minutes)
      setWorkTime(Math.min(simulatedMinutes, 480));
    }, 50); // Mise à jour fréquente pour une animation fluide
  
    return () => clearInterval(updateInterval);
  }, [isPaused, workStartTime, simulationSpeed]);

  // Ajuster le temps de démarrage quand la vitesse change pour éviter les sauts
  useEffect(() => {
    if (isPaused) {
      setLastSimulationSpeed(simulationSpeed);
      return;
    }
    
    // Ne rien faire lors de l'initialisation
    if (lastSimulationSpeed === simulationSpeed) return;
    
    // Calculer le temps écoulé réel actuel
    const now = Date.now();
    const currentElapsedRealSeconds = (now - workStartTime) / 1000;

    // Calculer le temps simulé actuel (avec l'ancienne vitesse)
    const currentSimulatedMinutes = currentElapsedRealSeconds * 4 * lastSimulationSpeed;

    // Ajuster le temps de démarrage pour maintenir le même temps simulé avec la nouvelle vitesse
    const newStartTime = now - (currentSimulatedMinutes / (4 * simulationSpeed)) * 1000;

    setWorkStartTime(newStartTime);
    setLastSimulationSpeed(simulationSpeed);
  }, [simulationSpeed, isPaused]);

  // Fonction pour obtenir la largeur du filet d'eau en fonction du débit
  const getWaterStreamWidth = () => {
    // Calculer le facteur d'agitation
    const agitationFactor = environmentScore > 0 ? 1 + (environmentScore * 0.003) : 1.0;
    // Appliquer au débit
    const adjustedFlowRate = flowRate * agitationFactor;
    return 2 + (adjustedFlowRate / 100) * 8 // Entre 2px et 10px
  }

  // Fonction pour obtenir l'opacité du filet d'eau en fonction du débit
  const getWaterStreamOpacity = () => {
    // Calculer le facteur d'agitation
    const agitationFactor = environmentScore > 0 ? 1 + (environmentScore * 0.003) : 1.0;
    // Appliquer au débit
    const adjustedFlowRate = flowRate * agitationFactor;
    return 0.3 + (adjustedFlowRate / 100) * 0.7 // Entre 0.3 et 1.0
  }

  // Gérer le changement de débit du robinet
  const handleFlowRateChange = (rate: number) => {
    setFlowRate(rate);
    // Sauvegarder le débit dans le localStorage pour persistance
    setLocalStorage('flowRate', rate.toString());
    // Déclencher un événement de stockage pour notifier les autres composants
    emitStorageEvent();
  }

  // Fonction pour réinitialiser le niveau du verre
  const handleReset = () => {
    setFillLevel(0)
    setFlowRate(0)
    setAbsorptionRate(0)
    setWorkTime(0)
    setWorkStartTime(Date.now())
  }

  // Gérer la mise en pause/reprise de la simulation
  const handlePauseToggle = () => {
    if (isPaused) {
      // On reprend, on ajuste le temps de démarrage pour ne pas avoir de saut
      const now = Date.now();
      // Prendre en compte la vitesse de simulation dans le calcul du temps de démarrage
      setWorkStartTime(now - (workTime / (4 * simulationSpeed)) * 1000);
    }
    setIsPaused(!isPaused)
  }
  
  // Fonction pour formater le temps de travail (HH:MM)
  const formatWorkTime = () => {
    const totalMinutes = Math.floor(workTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec description et titre animé */}
      <ModelDescription />

      {/* Dashboard principal */}
      <div className="w-full max-w-[100%] mx-auto">
        {/* Conteneur principal avec padding adaptatif */}
        <div className="bg-black backdrop-blur-md border border-gray-800/50 rounded-xl p-4 md:p-8 mx-0 md:-mx-24">
          {/* Contrôles de simulation avec flex wrap */}
          <div className="flex flex-wrap items-center gap-4 mb-4 ml-0 md:ml-4">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800/30 backdrop-blur-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={handlePauseToggle}
              className={cn(
                "px-3 py-2 rounded-lg border backdrop-blur-sm transition-colors",
                isPaused 
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30" 
                  : "bg-gray-900/50 border-gray-800/30 text-gray-400 hover:text-gray-300"
              )}
            >
              {isPaused ? "Reprendre" : "Pause"}
            </button>
            <div className="inline-flex items-center gap-4 p-3 rounded-lg bg-gray-900/50 border border-gray-800/30 backdrop-blur-sm">
              <FastForward className="w-5 h-5 text-blue-400" />
              <div className="flex items-center gap-4">
                <Slider
                  value={[simulationSpeed]}
                  onValueChange={(value) => setSimulationSpeed(value[0])}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-[120px]"
                />
                <span className="text-sm font-medium text-blue-400 min-w-[40px]">
                  {simulationSpeed.toFixed(1)}x
                </span>
              </div>
            </div>
            
            {/* Chronomètre de travail */}
            <div className="inline-flex items-center gap-3 p-3 rounded-lg bg-amber-900/20 border border-amber-800/30 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-amber-400">Temps de travail</span>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-amber-300">{formatWorkTime()}</span>
                </div>
                <div className="flex text-xs text-amber-400/80 mt-0.5">
                  <span className="mr-[14px]">heures</span>
                  <span className="ml-2">minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section supérieure - Risques unifiés avec adaptation mobile */}
          <div className="flex justify-center md:justify-end mb-8 mr-0 md:mr-[100px]">
            <div className="w-full md:w-[650px] relative">
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900/70 via-gray-900/50 to-gray-900/70 border border-gray-800/50 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-6">
                  {/* Risque d'accident */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                    <div className="relative h-[80px] p-4 rounded-xl backdrop-blur-[2px] overflow-hidden">
                      {/* Bordure de progression */}
                      <div className="absolute inset-0 rounded-xl border-[4px] border-gray-800/50" />
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-xl border-[4px] transition-all duration-500",
                          fillLevel >= 80 ? "border-red-500" :
                          fillLevel >= 60 ? "border-orange-500" :
                          "border-green-500"
                        )}
                        style={{
                          clipPath: `inset(0 ${100 - fillLevel}% 0 0)`
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <h3 className={cn(
                          "text-lg font-bold transition-colors duration-500",
                          fillLevel >= 80 ? "text-red-400" :
                          fillLevel >= 60 ? "text-orange-400" :
                          "text-green-400"
                        )}>
                          Risque d'accident
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Exposition TMS */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                    <div className="relative h-[80px] p-4 rounded-xl backdrop-blur-[2px] overflow-hidden">
                      {/* Bordure de progression */}
                      <div className="absolute inset-0 rounded-xl border-[4px] border-gray-800/50" />
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-xl border-[4px] transition-all duration-500",
                          tmsExposureLevel >= 80 ? "border-red-500" :
                          tmsExposureLevel >= 60 ? "border-orange-500" :
                          "border-green-500"
                        )}
                        style={{
                          clipPath: `inset(0 ${100 - tmsExposureLevel}% 0 0)`
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <h3 className={cn(
                          "text-lg font-bold transition-colors duration-500",
                          tmsExposureLevel >= 80 ? "text-red-400" :
                          tmsExposureLevel >= 60 ? "text-orange-400" :
                          "text-green-400"
                        )}>
                          Exposition TMS
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des recommandations */}
              <div className="absolute top-[calc(100%+1rem)] left-0 right-0 z-30">
                <div className="p-4 rounded-xl bg-black/40 border border-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-medium text-amber-400">Recommandations</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Recommandations pour risque d'accident critique */}
                    {fillLevel >= 80 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                          <Droplet className="w-4 h-4 shrink-0" />
                          <span>Arrêt immédiat : Fermer le robinet pour stopper l'afflux de contraintes</span>
                        </div>
                        {!isStrawEnabled && (
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <RectangleHorizontal className="w-4 h-4 shrink-0" />
                            <span>Activer la paille pour évacuer rapidement les contraintes</span>
                          </div>
                        )}
                        {absorptionRate < 60 && isStrawEnabled && (
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <RectangleHorizontal className="w-4 h-4 shrink-0" />
                            <span>Augmenter la puissance de la paille (min. 60%) pour une meilleure récupération</span>
                          </div>
                        )}
                        {environmentScore >= 60 && (
                          <div className="flex items-center gap-2 text-sm text-purple-400">
                            <Cloud className="w-4 h-4 shrink-0" />
                            <span>Optimiser d'urgence l'environnement de travail qui amplifie les risques</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommandations pour risque d'accident élevé */}
                    {fillLevel >= 60 && fillLevel < 80 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                          <Droplet className="w-4 h-4 shrink-0" />
                          <span>Réduire significativement le débit du robinet (contraintes trop élevées)</span>
                        </div>
                        {!isStrawEnabled && (
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <RectangleHorizontal className="w-4 h-4 shrink-0" />
                            <span>Activer la paille pour favoriser la récupération</span>
                          </div>
                        )}
                        {absorptionRate < 40 && isStrawEnabled && (
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <RectangleHorizontal className="w-4 h-4 shrink-0" />
                            <span>Augmenter la puissance de la paille pour mieux gérer les contraintes</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommandations pour environnement défavorable */}
                    {environmentScore >= 60 && fillLevel < 60 && (
                      <div className="flex items-center gap-2 text-sm text-purple-400">
                        <Cloud className="w-4 h-4 shrink-0" />
                        <span>Améliorer les conditions de l'environnement de travail pour réduire son impact</span>
                      </div>
                    )}

                    {/* Recommandations pour paille inactive ou faible */}
                    {!isStrawEnabled && fillLevel >= 40 && fillLevel < 60 && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <RectangleHorizontal className="w-4 h-4 shrink-0" />
                        <span>Activer la paille pour maintenir un niveau de récupération adéquat</span>
                      </div>
                    )}
                    {isStrawEnabled && absorptionRate < 30 && fillLevel >= 40 && fillLevel < 60 && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <RectangleHorizontal className="w-4 h-4 shrink-0" />
                        <span>Augmenter la puissance de la paille pour une meilleure récupération</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grille principale responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(550px,_600px)_1fr] gap-8 mt-8 md:-mt-32">
          {/* Panneau de gauche - Informations et contrôles */}
            <div className="space-y-8 p-4 md:p-6 rounded-xl bg-gradient-to-br from-gray-900/70 via-gray-900/50 to-gray-900/70 border border-gray-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-gray-400" />
                  <h2 className="text-2xl font-bold text-white">Composants du modèle</h2>
                </div>
              </div>

              {/* Verre */}
              <div className="space-y-3 p-6 rounded-lg bg-gray-900/30 hover:bg-gray-900/40 transition-colors border-2 border-gray-800/40">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[300px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <GlassWater className="w-6 h-6 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-300">Verre</h3>
                  </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente la capacité d'absorption des contraintes (facteurs individuels).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => setActiveModal('glass')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-gray-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l border-gray-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-gray-400">Capacité</span>
                      </div>
                      
                      {/* Conteneur pour la barre et la valeur */}
                      <div className="relative flex items-center mt-2">
                        {/* Barre de progression centrée */}
                        <div className="relative h-[160px] w-2">
                          <div className={cn(
                            "absolute bottom-0 w-full transition-all duration-300",
                            "bg-gradient-to-t",
                            Math.round(((glassWidth - 20) / 70) * 100) === 0 ? "from-gray-500 to-gray-400" :
                            Math.round(((glassWidth - 20) / 70) * 100) < 33 ? "from-gray-400 to-gray-300" :
                            Math.round(((glassWidth - 20) / 70) * 100) < 66 ? "from-gray-300 to-gray-200" :
                            "from-gray-200 to-white"
                          )} style={{ height: `${Math.round(((glassWidth - 20) / 70) * 100)}%` }} />
                </div>
                
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-gray-900/50 border border-gray-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${Math.round(((glassWidth - 20) / 70) * 100)}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-gray-400">
                            {Math.round(((glassWidth - 20) / 70) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Robinet */}
              <div className="space-y-3 p-6 rounded-lg bg-blue-950/20 hover:bg-blue-950/30 transition-colors border-2 border-blue-900/30">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[300px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <Droplet className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-blue-400">Robinet</h3>
                      
                      {/* Indicateur d'impact environnemental (à côté du titre) */}
                      {environmentScore > 0 && (
                        <div className="flex items-center ml-3">
                          <div className="text-x px-2 py-0.5 rounded bg-purple-950/30 border border-purple-800/30 text-purple-400">
                            <span>+{Math.round(environmentScore * 0.3)}% impact Bulle</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente les contraintes imposées aux tissus (charge, fréquence, posture, état émotionnel).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => setActiveModal('tap')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-blue-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l border-blue-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex flex-col items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-blue-400">Débit actuel</span>
                      </div>
                      
                      {/* Conteneur pour la barre et la valeur */}
                      <div className="relative flex items-center mt-2">
                        {/* Barre de progression centrée */}
                        <div className="relative h-[160px] w-2">
                          <div className={cn(
                            "absolute bottom-0 w-full transition-all duration-300",
                            "bg-gradient-to-t",
                            flowRate === 0 ? "from-blue-200 to-blue-300" :
                            flowRate < 33 ? "from-blue-300 to-blue-400" :
                            flowRate < 66 ? "from-blue-400 to-blue-500" :
                            "from-blue-500 to-blue-600"
                          )} style={{ height: `${flowRate}%` }} />
                </div>
                
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-blue-900/50 border border-blue-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${flowRate}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-blue-400">
                            {flowRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paille */}
              <div className="space-y-3 p-6 rounded-lg bg-green-950/20 hover:bg-green-950/30 transition-colors border-2 border-green-900/30">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[300px] flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RectangleHorizontal className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-semibold text-green-400">Paille</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-base font-medium transition-colors",
                          isStrawEnabled 
                            ? "text-green-400" 
                            : "text-gray-500"
                        )}>
                          {isStrawEnabled ? "Activée" : "Désactivée"}
                        </span>
                        <Switch
                          checked={isStrawEnabled}
                          onCheckedChange={handleStrawToggle}
                          className={cn(
                            "transition-all duration-200",
                            isStrawEnabled 
                              ? "bg-green-400/30 hover:bg-green-400/40" 
                              : "bg-gray-800 hover:bg-gray-700"
                          )}
                        />
                      </div>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente la capacité de récupération (étirements, échauffements, pauses, relaxation, sommeil).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => setActiveModal('straw')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-green-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l border-green-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-green-400">Récupération</span>
                      </div>
                      
                      {/* Conteneur pour la barre et la valeur */}
                      <div className="relative flex items-center mt-2">
                        {/* Barre de progression centrée */}
                        <div className="relative h-[160px] w-2">
                          <div className={cn(
                            "absolute bottom-0 w-full transition-all duration-300",
                            "bg-gradient-to-t",
                            absorptionRate === 0 ? "from-green-200 to-green-300" :
                            absorptionRate < 33 ? "from-green-300 to-green-400" :
                            absorptionRate < 66 ? "from-green-400 to-green-500" :
                            "from-green-500 to-green-600"
                          )} style={{ height: `${absorptionRate}%` }} />
                        </div>
                        
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-green-900/50 border border-green-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${absorptionRate}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className={cn(
                            "text-sm font-medium",
                            isStrawEnabled ? "text-green-400" : "text-gray-500"
                          )}>
                            {absorptionRate}%
                          </span>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            
              {/* Bulle */}
              <div className="space-y-3 p-6 rounded-lg bg-purple-950/20 hover:bg-purple-950/30 transition-colors border-2 border-purple-900/30">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[300px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <Cloud className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-semibold text-purple-400">Bulle</h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente l'environnement de travail (température, bruit, lumière, espace, équipements).
                    </p>
                    <div className="flex-grow" />
                    <button
                      onClick={() => setActiveModal('bubble')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-purple-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l border-purple-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-purple-400">Agitation</span>
                      </div>
                      
                      {/* Conteneur pour la barre et la valeur */}
                      <div className="relative flex items-center mt-2">
                        {/* Barre de progression centrée */}
                        <div className="relative h-[160px] w-2">
                          <div className={cn(
                            "absolute bottom-0 w-full transition-all duration-300",
                            "bg-gradient-to-t",
                            environmentScore === 0 ? "from-purple-200 to-purple-300" :
                            environmentScore < 33 ? "from-purple-300 to-purple-400" :
                            environmentScore < 66 ? "from-purple-400 to-purple-500" :
                            "from-purple-500 to-purple-600"
                          )} style={{ height: `${environmentScore}%` }} />
                        </div>
                        
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-purple-900/50 border border-purple-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${environmentScore}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-purple-400">
                            {environmentScore}%
                          </span>
                        </div>
                </div>
                </div>
                </div>
                </div>
              </div>
            </div>
            
            {/* Panneau central - Visualisation avec adaptation mobile */}
            <div className="relative flex items-center justify-center lg:justify-end h-full">
              <div className="relative w-full md:w-[700px] transform scale-90 md:scale-110">
                {/* Ensemble unifié bulle + composants */}
                <div className="relative flex items-center justify-center md:translate-x-16 mt-[100px] md:mt-[200px]">
                  {/* Bulle environnementale */}
                  <div className="absolute inset-[-80px] z-0">
                    <div 
                      className="relative w-[70%] h-full rounded-[50%] bg-gradient-to-br from-purple-500/3 to-purple-700/5 backdrop-blur-[2px] border border-purple-400/10" 
                      style={{
                        aspectRatio: '0.8',
                        transform: 'scale(1.1)',
                        animation: 'bubblePulse 8s ease-in-out infinite',
                        boxShadow: `
                          inset 0 0 40px rgba(168, 85, 247, 0.05),
                          0 0 20px rgba(168, 85, 247, 0.05),
                          inset 0 0 15px rgba(168, 85, 247, 0.1),
                          0 0 8px rgba(168, 85, 247, 0.08)
                        `
                      }}
                    >
                      <EnvironmentParticles score={environmentScore} isPaused={isPaused} />
            </div>
          </div>
          
                  {/* Ensemble verre-robinet-paille centré dans la bulle */}
                  <div className="relative z-10 -translate-x-32">
              {/* Robinet et son filet d'eau */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                <TapComponent 
                  flowRate={flowRate}
                  onFlowRateChange={handleFlowRateChange} 
                  hideDebitLabel={true} 
                />
                {/* Flux d'eau continu */}
                <div 
                          className="absolute top-[60px] left-[-4px] z-10"
                  style={{
                    height: '140px',
                    width: `${getWaterStreamWidth()}px`,
                    background: `linear-gradient(180deg, 
                      rgba(59, 130, 246, ${getWaterStreamOpacity()}) 0%,
                      rgba(37, 99, 235, ${getWaterStreamOpacity()}) 100%
                    )`,
                    borderRadius: '0 0 2px 2px',
                    boxShadow: `0 0 8px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)`,
                    animation: 'waterFlow 2s linear infinite',
                  }}
                >
                  {/* Effet d'eau qui coule */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                        animation: `waterDrop 1.5s linear infinite ${i * 0.3}s`,
                        backgroundSize: '100% 20px',
                      }}
                    />
                  ))}
                </div>
                      </div>
              </div>
              
                    {/* Verre avec paille */}
                    <div className="flex justify-center">
                <div ref={glassRef} className="relative">
                  <GlassComponent 
                    fillLevel={fillLevel} 
                    absorptionRate={absorptionRate}
                          width={glassWidth}
                    hideColorLegend={true}
                  />
                  
                        {/* Affichage de la capacité */}
                        <div className="absolute bottom-[-35px] left-0 right-0 text-center text-xl text-gray-300 font-medium">
                          Capacité: {Math.round(((glassWidth - 20) / 70) * 100)}%
                        </div>
                        
                        {/* Paille positionnée dans le verre */}
                  <div className="absolute top-[-230px] right-[-5px] z-20">
                    <StrawComponent 
                      absorptionRate={absorptionRate} 
                      setAbsorptionRate={setAbsorptionRate} 
                      isInsideGlass={true}
                    />
                  </div>
                </div>
              </div>

                    {/* Légende des couleurs */}
                    <div className="relative z-20 mt-8">
                      <div className="p-3 rounded-lg bg-gray-950/30 border border-gray-800/20 w-full backdrop-blur-[1px]">
                        <h3 className="text-base font-medium text-gray-300 mb-2">Légende des couleurs</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                            <span className="text-sm text-gray-400">0-60% (Normal)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                            <span className="text-sm text-gray-400">60-80% (Vigilance)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                            <span className="text-sm text-gray-400">80-90% (Danger)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500/80 rounded-full"></div>
                            <span className="text-sm text-gray-400">90-100% (Critique)</span>
            </div>
          </div>
              </div>
              </div>
            </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modales de paramètres */}
      <ParameterModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />

      {/* Ajuster l'animation pour un effet plus subtil */}
      <style jsx>{`
        @keyframes waterDrop {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes bubblePulse {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Panneau des coûts repositionné de manière responsive */}
      <div className="relative lg:absolute lg:right-[-600px] lg:top-[600px] w-full lg:w-[400px] mt-8 lg:mt-0">
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl">
          <CostPanel
            bodyParts={[
              { 
                name: "Cou", 
                angle: postureScores.neck, 
                risk: postureScores.neck + (postureAdjustments.neckRotation ? 1 : 0) + (postureAdjustments.neckInclination ? 1 : 0) >= 4 ? "high" : 
                       postureScores.neck + (postureAdjustments.neckRotation ? 1 : 0) + (postureAdjustments.neckInclination ? 1 : 0) >= 2 ? "medium" : "low",
                hasHistory: medicalHistory.neckProblems
              },
              { 
                name: "Épaules", 
                angle: postureScores.shoulder,
                risk: postureScores.shoulder + (postureAdjustments.shoulderRaised ? 1 : 0) + (postureAdjustments.shoulderAbduction ? 1 : 0) - (postureAdjustments.shoulderSupport ? 1 : 0) >= 4 ? "high" :
                       postureScores.shoulder + (postureAdjustments.shoulderRaised ? 1 : 0) + (postureAdjustments.shoulderAbduction ? 1 : 0) - (postureAdjustments.shoulderSupport ? 1 : 0) >= 2 ? "medium" : "low",
                hasHistory: medicalHistory.shoulderProblems
              },
              { 
                name: "Poignets", 
                angle: postureScores.wrist,
                risk: postureScores.wrist + (postureAdjustments.wristDeviation ? 1 : 0) + (postureAdjustments.wristPartialRotation ? 1 : 0) + (postureAdjustments.wristFullRotation ? 2 : 0) >= 4 ? "high" :
                       postureScores.wrist + (postureAdjustments.wristDeviation ? 1 : 0) + (postureAdjustments.wristPartialRotation ? 1 : 0) + (postureAdjustments.wristFullRotation ? 2 : 0) >= 2 ? "medium" : "low",
                hasHistory: medicalHistory.wristProblems
              },
              { 
                name: "Dos", 
                angle: postureScores.trunk,
                risk: postureScores.trunk >= 3 ? "high" : postureScores.trunk >= 2 ? "medium" : "low",
                hasHistory: medicalHistory.backProblems
              }
            ]}
            accidentRisk={accidentRisk}
            tmsRisk={tmsRisk}
          />
        </div>
      </div>
    </div>
  )
} 