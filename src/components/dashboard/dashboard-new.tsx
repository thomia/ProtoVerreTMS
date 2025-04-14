"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import TapComponent from './tap-component'
import GlassComponent from './glass-component'
import StrawComponent from './straw-component'
import StormComponent from './storm-component'
import React from 'react'
import { ParameterModals } from './parameter-modals'
import { Settings, Droplet, Wind, GlassWater, RectangleHorizontal, Cloud, Clock, RefreshCw, Play, Pause } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { EnvironmentParticles } from './environment-particles'
import { ModelDescription } from '../ui/model-description'
import { AnimatedTitle } from '../ui/animated-title'
import { Slider } from "@/components/ui/slider"
import { FastForward } from 'lucide-react'
import { StrawSectionV2, TapSectionV2, GlassSectionV2, StormSectionV2, BubbleSectionV2 } from './parameter-sections-v2'

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
    <div className="w-full">
      {/* En-tête du dashboard */}
      <div className="mb-8">
        <AnimatedTitle 
          title="ProtoVerreTMS" 
          subtitle="Simulation des Troubles Musculo-Squelettiques" 
          className="text-center"
        />
      </div>
      
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Panneau de contrôle - Occupe 4 colonnes sur grand écran */}
          <div className="lg:col-span-4 space-y-4">
            {/* Contrôles de simulation */}
            <div className="p-4 rounded-lg bg-gray-950/30 border border-gray-800/20 space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Contrôles</h3>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Réinitialiser</span>
                </button>
                
                <button
                  onClick={handlePauseToggle}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Reprendre</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Contrôle de vitesse */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Vitesse de simulation</span>
                  <div className="flex items-center gap-1 text-gray-300 text-sm">
                    <FastForward className="h-4 w-4" />
                    <span>x{simulationSpeed}</span>
                  </div>
                </div>
                
                <Slider
                  value={[simulationSpeed]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(values) => handleSpeedChange(values[0])}
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>x1</span>
                  <span>x10</span>
                </div>
              </div>
              
              {/* Chronomètre de travail */}
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-900/50 border border-gray-800/30">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-300">Temps de travail</span>
                </div>
                <span className="text-lg font-medium text-white">
                  {Math.floor(workTime / 60)}h{workTime % 60 < 10 ? `0${workTime % 60}` : workTime % 60}
                </span>
              </div>
            </div>
            
            {/* Sections de paramètres */}
            <div className="space-y-3">
              <TapSectionV2 
                flowRate={flowRate}
                onSettingsClick={() => handleOpenModal('tap')}
              />
              
              <GlassSectionV2 
                capacity={glassCapacity}
                fillLevel={fillLevel}
                onSettingsClick={() => handleOpenModal('glass')}
              />
              
              <StormSectionV2 
                intensity={stormIntensity}
                onSettingsClick={() => handleOpenModal('storm')}
              />
              
              <StrawSectionV2 
                absorptionRate={absorptionRate}
                isEnabled={isStrawEnabled}
                onToggle={handleStrawToggle}
                onSettingsClick={() => handleOpenModal('straw')}
              />
              
              <BubbleSectionV2 
                environmentScore={environmentScore}
                onSettingsClick={() => handleOpenModal('bubble')}
              />
            </div>
          </div>
          
          {/* Visualisation principale - Occupe 8 colonnes sur grand écran */}
          <div className="lg:col-span-8">
            <div className="p-6 rounded-lg bg-gray-950/30 border border-gray-800/20 h-full">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-medium text-gray-300 mb-6">Simulation TMS</h3>
                
                <div className="relative w-full max-w-[700px] h-[700px] flex flex-col items-center justify-center">
                  {/* Bulle environnementale */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <EnvironmentParticles 
                      score={environmentScore} 
                      isPaused={isPaused}
                    />
                  </div>
                  
                  {/* Robinet */}
                  <div className="relative z-20 mb-6 scale-125">
                    <TapComponent 
                      flowRate={flowRate} 
                      onFlowRateChange={handleFlowRateChange}
                      hideDebitLabel={false}
                    />
                  </div>
                  
                  {/* Flux d'eau initial */}
                  <div 
                    className="relative z-10 mb-4"
                    style={{
                      height: '80px',
                      width: `${getWaterStreamWidth() * 1.25}px`,
                      background: `linear-gradient(180deg, 
                        rgba(59, 130, 246, ${getWaterStreamOpacity()}) 0%,
                        rgba(37, 99, 235, ${getWaterStreamOpacity()}) 100%
                      )`,
                      borderRadius: '0 0 2px 2px',
                      boxShadow: `0 0 8px rgba(59, 130, 246, 0.5)`,
                    }}
                  />
                  
                  {/* Orage - positionné entre le robinet et le verre */}
                  <div className="mb-6 relative z-20 scale-125">
                    <StormComponent 
                      intensity={stormIntensity} 
                      onIntensityChange={setStormIntensity}
                      hideIntensityLabel={false} 
                    />
                  </div>
                  
                  {/* Flux d'eau après l'orage */}
                  <div 
                    className="relative z-10 mb-4"
                    style={{
                      height: '80px',
                      width: `${getWaterStreamWidth() * (1 - stormIntensity/200) * 1.25}px`,
                      background: `linear-gradient(180deg, 
                        rgba(59, 130, 246, ${getWaterStreamOpacity() * (1 - stormIntensity/200)}) 0%,
                        rgba(37, 99, 235, ${getWaterStreamOpacity() * (1 - stormIntensity/200)}) 100%
                      )`,
                      borderRadius: '0 0 2px 2px',
                      boxShadow: `0 0 8px rgba(59, 130, 246, 0.5)`,
                    }}
                  />
                  
                  {/* Verre avec paille */}
                  <div className="scale-125">
                    <div ref={glassRef} className="relative">
                      <GlassComponent 
                        fillLevel={fillLevel} 
                        absorptionRate={absorptionRate}
                        width={glassWidth}
                      />
                      
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
                </div>
              </div>
              
              {/* Légende des couleurs */}
              <div className="mt-6 w-full max-w-[700px] mx-auto">
                <div className="p-3 rounded-lg bg-gray-950/30 border border-gray-800/20">
                  <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Légende des couleurs</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500/80 rounded-full"></div>
                      <span className="text-xs text-gray-400">0-60% (Normal)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500/80 rounded-full"></div>
                      <span className="text-xs text-gray-400">60-80% (Vigilance)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-red-500/80 rounded-full"></div>
                      <span className="text-xs text-gray-400">80-90% (Danger)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-purple-500/80 rounded-full"></div>
                      <span className="text-xs text-gray-400">90-100% (Critique)</span>
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
        onCloseModal={handleCloseModal}
      />
    </div>
  );
}
