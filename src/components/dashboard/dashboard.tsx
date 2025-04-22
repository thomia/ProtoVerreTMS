"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import TapComponent from './tap-component'
import GlassComponent from './glass-component'
import StrawComponent from './straw-component'
import StormComponent from './storm-component'
import React from 'react'
import { ParameterModals } from './parameter-modals'
import { Settings, Droplet, Wind, GlassWater, RectangleHorizontal, Cloud, ActivitySquare, Activity, Lightbulb, AlertTriangle, AlertCircle, HelpCircle, ExternalLink, BookOpen, Scale, FileText, Stethoscope, AlertOctagon, InfoIcon, Clock, RefreshCw, Play, Pause } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { EnvironmentParticles } from './environment-particles'
import { ModelDescription } from '../ui/model-description'
import { AnimatedTitle } from '../ui/animated-title'
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { CostPanel } from "./cost-panel"
import { FastForward } from 'lucide-react'

export default function Dashboard() {
  // État pour garantir que le composant est monté (côté client uniquement)
  const [isMounted, setIsMounted] = useState(false);
  const [flowRate, setFlowRate] = useState(0);
  const [fillLevel, setFillLevel] = useState(0);
  const [absorptionRate, setAbsorptionRate] = useState(0);
  const [glassWidth, setGlassWidth] = useState(20);
  const [glassWidthPx, setGlassWidthPx] = useState(200);
  const [glassCapacity, setGlassCapacity] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [environmentScore, setEnvironmentScore] = useState(0);
  const [accidentRisk, setAccidentRisk] = useState(0);
  const [tmsRisk, setTmsRisk] = useState(0);
  const [tmsExposureLevel, setTmsExposureLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [stormIntensity, setStormIntensity] = useState(0);
  
  // États pour les angles et ajustements de posture
  const [postureScores, setPostureScores] = useState({
    neck: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0,
    trunk: 0,
    legs: 0
  });

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
  });

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  });
  
  // États pour les modales de paramètres
  const [isGlassModalOpen, setGlassModalOpen] = useState(false);
  const [isTapModalOpen, setTapModalOpen] = useState(false);
  const [isStrawModalOpen, setStrawModalOpen] = useState(false);
  const [isStrawEnabled, setIsStrawEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState<'tap' | 'glass' | 'straw' | 'bubble' | 'storm' | null>(null);

  // Référence pour mesurer la largeur réelle du verre
  const glassRef = React.useRef<HTMLDivElement>(null);
  const lastFlowRateRef = React.useRef<number>(0);

  // États pour le chronomètre de travail (8h)
  const [workTime, setWorkTime] = useState(0); // temps écoulé en minutes simulées
  const [workStartTime, setWorkStartTime] = useState(Date.now()); // moment de démarrage du chrono
  const [lastSimulationSpeed, setLastSimulationSpeed] = useState(1); // pour suivre les changements de vitesse

  // Utilisation de useCallback pour éviter les recréations de fonctions à chaque rendu
  const handleOpenModal = useCallback((modalType: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm') => {
    setActiveModal(modalType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);
  
  // Effet pour marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    if (!isMounted) return;
    
    // Charger les paramètres depuis localStorage
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
    
    // Écouter l'événement de mise à jour du score environnemental
    window.addEventListener('environmentScoreUpdated', ((e: CustomEvent<{ score: number }>) => {
      if (e.detail && typeof e.detail.score === 'number') {
        setEnvironmentScore(e.detail.score);
      }
    }) as EventListener);
    
    // Nettoyage des écouteurs d'événements
    return () => {
      window.removeEventListener('environmentScoreUpdated', (() => {}) as EventListener);
    };
  }, [isMounted]);
  
  // Charger les paramètres de posture depuis localStorage
  const loadPostureSettings = () => {
    if (typeof window === 'undefined') return;
    
    // Charger les scores de posture
    Object.keys(postureScores).forEach(key => {
      const savedValue = localStorage.getItem(`posture_${key}`);
      if (savedValue) {
        try {
          setPostureScores(prev => ({
            ...prev,
            [key]: parseInt(savedValue)
          }));
        } catch (e) {
          console.error(`Erreur lors du chargement du score de posture ${key}:`, e);
        }
      }
    });
  };
  
  // Écouter les changements dans localStorage
  const handleStorageChange = () => {
    if (typeof window === 'undefined') return;
    
    const newFlowRate = getLocalStorage('flowRate');
    if (newFlowRate) {
      setFlowRate(Number(newFlowRate));
    }
  };
  
  // Écouter les événements de stockage
  useEffect(() => {
    if (!isMounted) return;
    
    // Charger l'état de la paille
    const savedStrawEnabled = localStorage.getItem('strawEnabled');
    if (savedStrawEnabled) {
      setIsStrawEnabled(savedStrawEnabled === 'true');
    }
    
    // Écouter les changements dans localStorage
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, [isMounted]);
  
  // Écouter les changements dans localStorage pour les paramètres de posture
  useEffect(() => {
    if (!isMounted) return;
    
    // Charger les paramètres de posture
    loadPostureSettings();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      if (typeof window === 'undefined') return;
      
      // Recharger les paramètres de posture
      loadPostureSettings();
      
      // Mettre à jour les autres paramètres si nécessaire
      const newEnvironmentScore = getLocalStorage('environmentScore');
      if (newEnvironmentScore) {
        try {
          setEnvironmentScore(Number(newEnvironmentScore));
        } catch (e) {
          console.error("Erreur lors de la mise à jour du score environnemental:", e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, [isMounted]);
  
  // Charger la largeur du verre depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedGlassWidth = localStorage.getItem('glassWidth');
    if (savedGlassWidth) {
      try {
        const width = parseInt(savedGlassWidth);
        setGlassWidth(width);
        // Convertir la largeur en pixels (20 = 200px, 90 = 900px)
        setGlassWidthPx(width * 10);
      } catch (e) {
        console.error("Erreur lors du chargement de la largeur du verre:", e);
      }
    }
  }, []);
  
  // Écouter les événements personnalisés pour les mises à jour du débit
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleTapUpdate = (e: CustomEvent<{ flowRate: number }>) => {
      if (e.detail && typeof e.detail.flowRate === 'number') {
        setFlowRate(e.detail.flowRate);
        lastFlowRateRef.current = e.detail.flowRate;
      }
    };
    
    window.addEventListener('tapFlowRateUpdated', handleTapUpdate as EventListener);
    
    // Mettre à jour le débit toutes les 100ms pour une animation fluide
    const interval = setInterval(() => {
      if (!isPaused) {
        try {
          const currentFlowRate = lastFlowRateRef.current;
          if (currentFlowRate !== flowRate) {
            setFlowRate(prev => {
              const diff = currentFlowRate - prev;
              return prev + (diff * 0.1);
            });
          }
        } catch (e) {
          console.error("Erreur lors de la mise à jour du débit:", e);
        }
      }
    }, 100);
    
    return () => {
      window.removeEventListener('tapFlowRateUpdated', handleTapUpdate as EventListener);
      clearInterval(interval);
    };
  }, []);
  
  // Mettre à jour la capacité du verre lorsque sa largeur change
  useEffect(() => {
    // Calculer la capacité en fonction de la largeur
    // 20 = 0%, 90 = 100%
    const capacity = Math.round(((glassWidth - 20) / 70) * 100);
    setGlassCapacity(capacity);
    
    // Sauvegarder dans localStorage
    setLocalStorage('glassCapacity', capacity.toString());
    
    // Émettre un événement pour notifier les autres composants
    const event = new CustomEvent('glassCapacityUpdated', { 
      detail: { capacity } 
    });
    window.dispatchEvent(event);
  }, [glassCapacity]);
  
  // Écouter les changements de capacité via les événements personnalisés
  useEffect(() => {
    if (!isMounted) return;
    
    // Fonction pour gérer les changements de capacité
    const handleCapacityChange = () => {
      if (typeof window === 'undefined') return;
      
      const savedCapacity = getLocalStorage('glassCapacity');
      if (savedCapacity) {
        try {
          setGlassCapacity(Number(savedCapacity));
        } catch (e) {
          console.error("Erreur lors de la mise à jour de la capacité:", e);
        }
      }
    };
    
    const handleCapacityUpdate = (e: CustomEvent<{ capacity: number }>) => {
      if (e.detail && typeof e.detail.capacity === 'number') {
        setGlassCapacity(e.detail.capacity);
      }
    };
    
    window.addEventListener('storage', handleCapacityChange);
    window.addEventListener('localStorageUpdated', handleCapacityChange);
    window.addEventListener('glassCapacityUpdated', handleCapacityUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleCapacityChange);
      window.removeEventListener('localStorageUpdated', handleCapacityChange);
      window.removeEventListener('glassCapacityUpdated', handleCapacityUpdate as EventListener);
    };
  }, [isMounted, glassCapacity]);
  
  // Charger l'état de la paille depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedStrawEnabled = localStorage.getItem('strawEnabled');
    if (savedStrawEnabled) {
      try {
        setIsStrawEnabled(savedStrawEnabled === 'true');
      } catch (e) {
        console.error("Erreur lors du chargement de l'état de la paille:", e);
      }
    }
  }, []);
  
  // Gérer le changement d'état de la paille
  const handleStrawToggle = () => {
    const newState = !isStrawEnabled;
    setIsStrawEnabled(newState);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('strawEnabled', newState.toString());
    }
  };

  // Fonctions utilitaires et calculs
  // Réinitialiser la simulation
  const handleReset = () => {
    setFillLevel(0);
    setFlowRate(0);
    setLastUpdateTime(Date.now());
    setWorkTime(0);
    setWorkStartTime(Date.now());
    
    // Sauvegarder dans localStorage
    setLocalStorage('fillLevel', '0');
    setLocalStorage('flowRate', '0');
    
    // Émettre un événement pour notifier les autres composants
    emitStorageEvent();
  };

  // Mettre en pause ou reprendre la simulation
  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    
    if (isPaused) {
      // Si on reprend, mettre à jour le temps de démarrage
      setWorkStartTime(prev => Date.now() - (workTime * 60000 / simulationSpeed));
    }
  };

  // Changer la vitesse de simulation
  const handleSpeedChange = (speed: number) => {
    // Sauvegarder l'ancienne vitesse
    setLastSimulationSpeed(simulationSpeed);
    
    // Mettre à jour la vitesse
    setSimulationSpeed(speed);
    
    // Ajuster le temps de démarrage pour maintenir la cohérence
    if (!isPaused) {
      setWorkStartTime(prev => {
        const elapsedRealTime = Date.now() - prev;
        const simulatedTime = elapsedRealTime * simulationSpeed;
        return Date.now() - (simulatedTime / speed);
      });
    }
  };

  // Fonction pour obtenir la largeur du filet d'eau en fonction du débit
  const getWaterStreamWidth = () => {
    // Largeur min: 2px, max: 12px
    return 2 + (flowRate / 10);
  };

  // Fonction pour obtenir l'opacité du filet d'eau en fonction du débit
  const getWaterStreamOpacity = () => {
    // Opacité min: 0.2, max: 0.9
    return 0.2 + (flowRate / 100) * 0.7;
  };

  // Gérer les changements de débit du robinet
  const handleFlowRateChange = (newFlowRate: number) => {
    setFlowRate(newFlowRate);
    lastFlowRateRef.current = newFlowRate;
    
    // Sauvegarder dans localStorage
    setLocalStorage('flowRate', newFlowRate.toString());
    
    // Émettre un événement pour notifier les autres composants
    const event = new CustomEvent('tapFlowRateUpdated', { 
      detail: { flowRate: newFlowRate } 
    });
    window.dispatchEvent(event);
  };

  // Calculer le risque d'accident en fonction du débit et du score environnemental
  useEffect(() => {
    // Plus le débit est élevé et plus l'environnement est mauvais, plus le risque est élevé
    const calculatedRisk = Math.min(100, Math.round((flowRate * 0.7) + (environmentScore * 0.3)));
    setAccidentRisk(calculatedRisk);
  }, [flowRate, environmentScore]);

  // Calculer le risque de TMS en fonction du débit et du score environnemental
  useEffect(() => {
    // Plus le débit est élevé et plus l'environnement est mauvais, plus le risque est élevé
    const calculatedRisk = Math.min(100, Math.round((flowRate * 0.6) + (environmentScore * 0.4)));
    setTmsRisk(calculatedRisk);
  }, [flowRate, environmentScore]);

  // Mettre à jour le niveau d'exposition aux TMS en fonction du temps de travail
  useEffect(() => {
    // Plus le temps de travail est long, plus l'exposition est élevée
    const calculatedExposure = Math.min(100, Math.round((workTime / 480) * 100));
    setTmsExposureLevel(calculatedExposure);
  }, []);

  // Mettre à jour le score environnemental en fonction du temps
  useEffect(() => {
    // Simuler des variations aléatoires dans l'environnement
    const interval = setInterval(() => {
      if (!isPaused) {
        const variation = Math.random() * 10 - 5; // -5 à +5
        setEnvironmentScore(prev => Math.max(0, Math.min(100, prev + variation)));
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour le chronomètre de travail
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsedRealTime = Date.now() - workStartTime;
        const simulatedMinutes = Math.floor((elapsedRealTime * simulationSpeed) / 60000);
        setWorkTime(simulatedMinutes);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused, workStartTime, simulationSpeed]);

  // Formater le temps de travail (format HH:MM)
  const formattedWorkTime = useCallback(() => {
    const hours = Math.floor(workTime / 60);
    const minutes = workTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, [workTime]);

  // Mettre à jour le niveau de remplissage du verre en fonction du débit et du taux d'absorption
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setLastUpdateTime(Date.now());
      
      setFillLevel(prev => {
        // Calculer le nouveau niveau
        let newLevel = prev;
        
        // Ajouter l'eau qui coule du robinet
        const inflow = (flowRate / 100) * 0.5 * simulationSpeed;
        
        // Soustraire l'eau absorbée par la paille
        const outflow = isStrawEnabled ? (absorptionRate / 100) * 0.3 * simulationSpeed : 0;
        
        // Facteur environnemental (plus l'environnement est mauvais, plus le verre se remplit vite)
        const environmentFactor = 1 + (environmentScore / 200);
        
        // Calculer le changement net
        const netChange = (inflow * environmentFactor) - outflow;
        
        // Appliquer le changement
        newLevel = Math.max(0, Math.min(100, prev + netChange));
        
        // Sauvegarder dans localStorage
        setLocalStorage('fillLevel', newLevel.toString());
        
        return newLevel;
      });
    }, 50); // Mise à jour fréquente pour une animation fluide
    
    return () => clearInterval(interval);
  }, [flowRate, lastUpdateTime, isPaused, glassWidth, absorptionRate, isStrawEnabled, simulationSpeed, environmentScore]);

  // Mettre à jour le chronomètre de travail
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsedRealTime = Date.now() - workStartTime;
        const simulatedMinutes = Math.floor((elapsedRealTime * simulationSpeed) / 60000);
        setWorkTime(simulatedMinutes);
        
        // Journée de travail terminée (8h)
        if (simulatedMinutes >= 480) {
          setIsPaused(true);
          // Afficher un message ou une alerte
        } else {
          // Continuer la simulation
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused, workStartTime, simulationSpeed]);

  // Gérer les changements de vitesse de simulation
  useEffect(() => {
    if (simulationSpeed !== lastSimulationSpeed) {
      if (!isPaused) {
        // Ajuster le temps de démarrage pour maintenir la cohérence du temps simulé
        const elapsedRealTime = Date.now() - workStartTime;
        const simulatedTime = elapsedRealTime * lastSimulationSpeed;
        setWorkStartTime(Date.now() - (simulatedTime / simulationSpeed));
      }
      
      // Mettre à jour la dernière vitesse connue
      setLastSimulationSpeed(simulationSpeed);
    }
  }, [simulationSpeed, isPaused, lastSimulationSpeed, workStartTime]);

  return (
    <div className="relative min-h-screen bg-black w-full">
      {/* En-tête avec description et titre animé */}
      <ModelDescription />

      {/* Dashboard principal */}
      <div className="w-full">
        {/* Conteneur principal avec marges adaptatives */}
        <div className="bg-black/40 backdrop-blur-md border-4 border-gray-800/30 rounded-xl p-4 md:p-8 w-full">
          {/* Contrôles de simulation */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Boutons de contrôle */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={handlePauseToggle}
                  className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
                >
                  {isPaused ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <Pause className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Contrôle de vitesse */}
              <div className="flex items-center gap-2">
                <FastForward className="h-5 w-5 text-gray-400" />
                <div className="flex gap-1">
                  {[1, 2, 5, 10].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium transition-colors",
                        simulationSpeed === speed 
                          ? "bg-blue-600/70 text-white" 
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chronomètre de travail */}
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-md border border-gray-800/50">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="text-lg font-mono text-gray-300">
                {formattedWorkTime()}
              </div>
              <div className="text-xs text-gray-500 ml-1">/ 08:00</div>
            </div>
          </div>
          
          {/* Contenu principal du dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panneau de gauche - Paramètres */}
            <div className="lg:col-span-1 space-y-6">
              {/* Robinet */}
              <div className="space-y-3 p-6 rounded-lg bg-blue-950/20 hover:bg-blue-950/30 transition-colors border-4 border-blue-900/60">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[400px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <Droplet className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-blue-400">Robinet</h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente le flux de travail (cadence, rythme, intensité, charge de travail).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => handleOpenModal('tap')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-blue-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l-2 border-blue-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-blue-400">Débit</span>
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
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-blue-900/50 border-2 border-blue-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${flowRate}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-blue-400">
                            {Math.round(flowRate)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verre */}
              <div className="space-y-3 p-6 rounded-lg bg-gray-950/20 hover:bg-gray-950/30 transition-colors border-4 border-gray-800/60">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[400px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <GlassWater className="w-6 h-6 text-gray-300" />
                      <h3 className="text-xl font-semibold text-gray-300">Verre</h3>
                      
                      {/* Indicateur d'impact environnemental (à côté du titre) */}
                      {environmentScore > 30 && (
                        <div className="ml-auto px-2 py-0.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                          <span className="text-xs text-purple-400 font-medium flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            <span>+{Math.round(environmentScore * 0.3)}% impact Bulle</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente les contraintes imposées aux tissus (charge, fréquence, posture, état émotionnel).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => handleOpenModal('glass')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-gray-300 hover:text-gray-200 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-gray-300 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l-2 border-gray-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-gray-300">Capacité</span>
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
                            "from-gray-200 to-gray-100"
                          )} style={{ height: `${Math.round(((glassWidth - 20) / 70) * 100)}%` }} />
                        </div>
                        
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-gray-900/50 border-2 border-gray-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${Math.round(((glassWidth - 20) / 70) * 100)}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-gray-300">
                            {Math.round(((glassWidth - 20) / 70) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orage */}
              <div className="space-y-3 p-6 rounded-lg bg-orange-950/20 hover:bg-orange-950/30 transition-colors border-4 border-orange-900/60">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[400px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <Wind className="w-6 h-6 text-orange-400" />
                      <h3 className="text-xl font-semibold text-orange-400">Orage</h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente les facteurs environnementaux (tempête, vent, pluie, etc.).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => handleOpenModal('storm')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-orange-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l-2 border-orange-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-orange-400">Intensité</span>
                      </div>
                      
                      {/* Conteneur pour la barre et la valeur */}
                      <div className="relative flex items-center mt-2">
                        {/* Barre de progression centrée */}
                        <div className="relative h-[160px] w-2">
                          <div className={cn(
                            "absolute bottom-0 w-full transition-all duration-300",
                            "bg-gradient-to-t",
                            stormIntensity === 0 ? "from-orange-200 to-orange-300" :
                            stormIntensity < 33 ? "from-orange-300 to-orange-400" :
                            stormIntensity < 66 ? "from-orange-400 to-orange-500" :
                            "from-orange-500 to-orange-600"
                          )} style={{ height: `${stormIntensity}%` }} />
                        </div>
                        
                        {/* Valeur à droite */}
                        <div 
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-orange-900/50 border-2 border-orange-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${stormIntensity}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-orange-400">
                            {stormIntensity}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paille */}
              <div className="space-y-3 p-6 rounded-lg bg-green-950/20 hover:bg-green-950/30 transition-colors border-4 border-green-900/60">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[400px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <RectangleHorizontal className="w-6 h-6 text-green-400 transform rotate-90 scale-y-[0.3]" />
                      <h3 className="text-xl font-semibold text-green-400">Paille</h3>
                      
                      {/* Switch pour activer/désactiver la paille */}
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-sm text-gray-400">Activée</span>
                        <Switch 
                          checked={isStrawEnabled}
                          onCheckedChange={handleStrawToggle}
                          className={cn(
                            isStrawEnabled ? "bg-green-900" : "bg-gray-700",
                            "transition-colors"
                          )}
                        />
                      </div>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente la capacité de récupération (étirements, échauffements, pauses, relaxation, sommeil).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => handleOpenModal('straw')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-green-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l-2 border-green-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-green-400">Absorption</span>
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
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-green-900/50 border-2 border-green-400/10 backdrop-blur-sm transition-all duration-300"
                          style={{
                            bottom: `${absorptionRate}%`,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="text-sm font-medium text-green-400">
                            {absorptionRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulle */}
              <div className="space-y-3 p-6 rounded-lg bg-purple-950/20 hover:bg-purple-950/30 transition-colors border-4 border-purple-900/60">
                <div className="flex h-[200px]">
                  {/* Contenu principal avec largeur fixe */}
                  <div className="w-[400px] flex flex-col">
                    <div className="flex items-center gap-3">
                      <Cloud className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-semibold text-purple-400">Bulle</h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed mt-3">
                      Représente l'environnement de travail (température, bruit, lumière, espace, équipements).
                    </p>
                    <div className="flex-grow" />
                    <button 
                      onClick={() => handleOpenModal('bubble')}
                      className="group relative w-fit mt-4 px-3 py-1.5 text-base text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Configurer les paramètres
                      <span className="absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 bg-purple-400 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </button>
                  </div>
                  
                  {/* Séparateur et barre de progression */}
                  <div className="flex flex-col items-center ml-6 w-[120px] pl-6 border-l-2 border-purple-400/20">
                    <div className="relative h-full w-full flex flex-col items-center">
                      {/* Label supérieur avec espacement fixe */}
                      <div className="h-[40px] flex items-center justify-center -mt-2 pt-0">
                        <span className="text-sm text-purple-400">Score</span>
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
                          className="absolute -right-[60px] min-w-[45px] h-[30px] flex items-center justify-center rounded-md bg-purple-900/50 border-2 border-purple-400/10 backdrop-blur-sm transition-all duration-300"
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
            
            {/* Panneau central - Visualisation */}
            <div className="lg:col-span-1 space-y-6">
              {/* Panneau central - Visualisation avec adaptation mobile */}
              <div className="relative w-full">
                <div className="relative w-full max-w-[1800px] mx-auto transform scale-125">
                  {/* Ensemble unifié bulle + composants */}
                  <div className="relative flex items-center justify-center mt-[50px] md:mt-[100px]">
                    {/* Bulle environnementale */}
                    <div className="absolute inset-0 w-[1200px] h-[1200px] z-0" style={{ left: '50%', transform: 'translateX(-50%) translateY(-30%)' }}>
                      <div 
                        className="relative w-full h-full rounded-full" 
                        style={{
                          aspectRatio: '1',
                          animation: 'bubblePulse 8s ease-in-out infinite',
                          boxShadow: `
                            inset 0 0 40px rgba(168, 85, 247, 0.03),
                            0 0 20px rgba(168, 85, 247, 0.03),
                            inset 0 0 10px rgba(168, 85, 247, 0.05),
                            0 0 10px rgba(168, 85, 247, 0.04)
                          `,
                          // Contour plus épais
                          border: '3px solid rgba(168, 85, 247, 0.4)'
                        }}
                      >
                        <EnvironmentParticles score={environmentScore} isPaused={isPaused} />
                      </div>
                    </div>
                    
                    {/* Ensemble verre-robinet-paille centré dans la bulle */}
                    <div className="relative z-5">
                      {/* Robinet et son filet d'eau */}
                      <div className="flex justify-center mb-10">
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
                              height: '180px',
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
                      
                      {/* Orage - positionné entre le robinet et le verre */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <StormComponent 
                            intensity={stormIntensity} 
                            onIntensityChange={setStormIntensity}
                            hideIntensityLabel={true} 
                          />
                          
                          {/* Bouton de configuration de l'Orage */}
                          <button 
                            onClick={() => handleOpenModal('storm')}
                            className="absolute top-[-10px] right-[-40px] p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-[#D4A017]/30 transition-all duration-300 group"
                          >
                            <Settings className="w-4 h-4 text-[#D4A017] group-hover:text-[#F0C239]" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Verre avec paille */}
                      <div className="flex justify-center">
                        <div ref={glassRef} className="relative">
                          <GlassComponent 
                            fillLevel={fillLevel} 
                            absorptionRate={absorptionRate}
                            width={glassWidth}
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
                      <div className="relative z20 mt-64">
                        <div className="p-3 rounded-lg bg-gray-950/30 border-2 border-gray-800/20 w-full backdrop-blur-[1px]">
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
            
            {/* Panneau de droite - Métriques */}
            <div className="lg:col-span-1 space-y-6">
              {/* Panneau des métriques */}
              <div className="space-y-6 p-6 rounded-lg bg-gray-900/30 border border-gray-800/30">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Métriques de risque</h2>
                
                {/* Niveau de remplissage du verre */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Niveau de remplissage</span>
                    <span className={cn(
                      "font-medium",
                      fillLevel < 60 ? "text-green-400" :
                      fillLevel < 80 ? "text-yellow-400" :
                      fillLevel < 90 ? "text-red-400" :
                      "text-purple-400"
                    )}>{Math.round(fillLevel)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        fillLevel < 60 ? "bg-green-500" :
                        fillLevel < 80 ? "bg-yellow-500" :
                        fillLevel < 90 ? "bg-red-500" :
                        "bg-purple-500"
                      )}
                      style={{ width: `${fillLevel}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Risque d'accident */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Risque d'accident</span>
                    <span className={cn(
                      "font-medium",
                      accidentRisk < 60 ? "text-green-400" :
                      accidentRisk < 80 ? "text-yellow-400" :
                      accidentRisk < 90 ? "text-red-400" :
                      "text-purple-400"
                    )}>{accidentRisk}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        accidentRisk < 60 ? "bg-green-500" :
                        accidentRisk < 80 ? "bg-yellow-500" :
                        accidentRisk < 90 ? "bg-red-500" :
                        "bg-purple-500"
                      )}
                      style={{ width: `${accidentRisk}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Risque de TMS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Risque de TMS</span>
                    <span className={cn(
                      "font-medium",
                      tmsRisk < 60 ? "text-green-400" :
                      tmsRisk < 80 ? "text-yellow-400" :
                      tmsRisk < 90 ? "text-red-400" :
                      "text-purple-400"
                    )}>{tmsRisk}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        tmsRisk < 60 ? "bg-green-500" :
                        tmsRisk < 80 ? "bg-yellow-500" :
                        tmsRisk < 90 ? "bg-red-500" :
                        "bg-purple-500"
                      )}
                      style={{ width: `${tmsRisk}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Exposition aux TMS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Exposition aux TMS</span>
                    <span className={cn(
                      "font-medium",
                      tmsExposureLevel < 60 ? "text-green-400" :
                      tmsExposureLevel < 80 ? "text-yellow-400" :
                      tmsExposureLevel < 90 ? "text-red-400" :
                      "text-purple-400"
                    )}>{tmsExposureLevel}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        tmsExposureLevel < 60 ? "bg-green-500" :
                        tmsExposureLevel < 80 ? "bg-yellow-500" :
                        tmsExposureLevel < 90 ? "bg-red-500" :
                        "bg-purple-500"
                      )}
                      style={{ width: `${tmsExposureLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Panneau des coûts */}
              <CostPanel 
                bodyParts={[
                  { name: "Cou", angle: postureScores.neck, risk: postureScores.neck > 60 ? "high" : postureScores.neck > 30 ? "medium" : "low", hasHistory: medicalHistory.neckProblems },
                  { name: "Épaule", angle: postureScores.shoulder, risk: postureScores.shoulder > 60 ? "high" : postureScores.shoulder > 30 ? "medium" : "low", hasHistory: medicalHistory.shoulderProblems },
                  { name: "Poignet", angle: postureScores.wrist, risk: postureScores.wrist > 60 ? "high" : postureScores.wrist > 30 ? "medium" : "low", hasHistory: medicalHistory.wristProblems },
                  { name: "Dos", angle: postureScores.trunk, risk: postureScores.trunk > 60 ? "high" : postureScores.trunk > 30 ? "medium" : "low", hasHistory: medicalHistory.backProblems }
                ]}
                accidentRisk={accidentRisk}
                tmsRisk={tmsRisk}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modales de paramètres */}
      <ParameterModals 
        activeModal={activeModal}
        onCloseModal={handleCloseModal}
      />
    </div>
  );
}
