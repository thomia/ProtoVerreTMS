"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'

interface StormComponentProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  hideIntensityLabel?: boolean;
}

export default function StormComponent({ intensity, onIntensityChange, hideIntensityLabel = false }: StormComponentProps) {
  const [showDetails, setShowDetails] = useState(false)
  const intensityRef = useRef(0)
  
  // Obtenir la classe de couleur en fonction du niveau d'intensité
  const getIntensityColor = (value: number) => {
    if (value >= 80) return "text-red-500";
    if (value >= 60) return "text-amber-500";
    if (value >= 40) return "text-yellow-500";
    return "text-green-500";
  }
  
  // Charger l'intensité depuis localStorage
  useEffect(() => {
    // Fonction pour mettre à jour l'intensité à partir des événements
    const handleIntensityUpdate = (e: CustomEvent<{ intensity: number }>) => {
      if (e.detail && typeof e.detail.intensity === 'number' && onIntensityChange) {
        onIntensityChange(e.detail.intensity);
      }
    };

    // Écouter les événements personnalisés
    window.addEventListener('stormIntensityUpdated', handleIntensityUpdate as EventListener);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('stormIntensityUpdated', handleIntensityUpdate as EventListener);
    };
  }, [onIntensityChange]);

  // Gérer le changement d'intensité
  useEffect(() => {
    // Lire l'intensité depuis localStorage lors du premier montage
    if (intensityRef.current === 0) {
      const savedIntensity = getLocalStorage('stormIntensity');
      if (savedIntensity && onIntensityChange) {
        const parsedIntensity = parseInt(savedIntensity);
        if (!isNaN(parsedIntensity)) {
          onIntensityChange(Math.round(parsedIntensity));
        }
      }
    }

    // Mettre à jour la référence de l'intensité actuelle
    intensityRef.current = Math.round(intensity);
    
    // Sauvegarder l'intensité dans localStorage pour que d'autres composants puissent y accéder
    setLocalStorage('stormIntensity', Math.round(intensity).toString());
    
    // Émettre un événement de stockage pour notifier les autres composants
    emitStorageEvent();
  }, [intensity, onIntensityChange]);
  
  const handleClick = () => {
    setShowDetails(!showDetails)
  }
  
  // Obtenir la description de l'intensité
  const getIntensityDescription = () => {
    if (intensity < 40) return "Faible";
    if (intensity < 60) return "Modérée";
    if (intensity < 80) return "Élevée";
    return "Critique";
  }

  // Calculer le nombre de gouttes en fonction de l'intensité
  const getDropsCount = () => {
    if (intensity < 10) return 0;
    if (intensity < 30) return 3;
    if (intensity < 50) return 6;
    if (intensity < 70) return 10;
    if (intensity < 90) return 15;
    return 20;
  }

  return (
    <div className="relative">
      <motion.div 
        className="relative h-[100px] w-full max-w-[160px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onClick={handleClick}
      >
        {/* Nuage d'orage - décalé vers la gauche */}
        <motion.div 
          className={`relative w-[80px] h-[40px] rounded-[50px] bg-gray-600/80 border-2 border-[#D4A017] shadow-lg ml-[-40px]`}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            opacity: intensity < 10 ? 0 : 1
          }}
          transition={{ 
            scale: { 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut" 
            },
            opacity: { duration: 0.5 }
          }}
        >
          {/* Forme du nuage */}
          <div className="absolute top-[-10px] left-[15px] w-[20px] h-[20px] rounded-full bg-gray-600/80 border-t-2 border-l-2 border-r-2 border-[#D4A017]"></div>
          <div className="absolute top-[-15px] left-[40px] w-[25px] h-[25px] rounded-full bg-gray-600/80 border-2 border-[#D4A017]"></div>
          <div className="absolute top-[-8px] left-[30px] w-[15px] h-[15px] rounded-full bg-gray-600/80 border-t-2 border-l-2 border-r-2 border-[#D4A017]"></div>
          
          {/* Éclairs */}
          {intensity > 30 && (
            <motion.div
              className="absolute bottom-[-5px] left-[20px] w-[2px] h-[15px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.5, 1.5 - (intensity * 0.01)),
                delay: 0.5,
                repeatDelay: Math.max(0.5, 3 - (intensity * 0.025))
              }}
            />
          )}
          
          {intensity > 50 && (
            <motion.div
              className="absolute bottom-[-8px] left-[45px] w-[3px] h-[18px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.4, 1.2 - (intensity * 0.01)),
                delay: 1.2,
                repeatDelay: Math.max(0.4, 3 - (intensity * 0.025))
              }}
            />
          )}
          
          {/* Éclair supplémentaire pour intensité élevée */}
          {intensity > 70 && (
            <motion.div
              className="absolute bottom-[-7px] left-[30px] w-[2.5px] h-[20px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.3, 1.0 - (intensity * 0.01)),
                delay: 0.8,
                repeatDelay: Math.max(0.3, 2.5 - (intensity * 0.025))
              }}
            />
          )}
          
          {/* Éclair supplémentaire pour intensité critique */}
          {intensity > 90 && (
            <motion.div
              className="absolute bottom-[-6px] left-[10px] w-[2px] h-[16px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.2, 0.8 - (intensity * 0.005)),
                delay: 0.3,
                repeatDelay: Math.max(0.2, 2 - (intensity * 0.02))
              }}
            />
          )}
          
          {/* Gouttes de pluie - distribuées sur toute la largeur du nuage */}
          {intensity >= 30 && (
            <>
              {/* Gouttes côté gauche */}
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`raindrop-left-${index}`}
                  className="absolute w-[2px] h-[6px] bg-blue-400/80 rounded-b-full"
                  style={{
                    left: `${5 + (index * 6)}px`,
                    bottom: `-10px`,
                    opacity: 0.8,
                    height: `${Math.min(8, 4 + (intensity * 0.04))}px`
                  }}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ 
                    y: [0, 20, 40],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(0.5, 1.5 - (intensity * 0.01) - (index * 0.05)),
                    delay: index * 0.15,
                    ease: "easeIn"
                  }}
                />
              ))}
              
              {/* Gouttes côté droit */}
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`raindrop-right-${index}`}
                  className="absolute w-[2px] h-[6px] bg-blue-400/80 rounded-b-full"
                  style={{
                    left: `${45 + (index * 6)}px`,
                    bottom: `-10px`,
                    opacity: 0.8,
                    height: `${Math.min(8, 4 + (intensity * 0.04))}px`
                  }}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ 
                    y: [0, 20, 40],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(0.5, 1.5 - (intensity * 0.01) - (index * 0.05)),
                    delay: (index + 6) * 0.15,
                    ease: "easeIn"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        {/* Affichage des détails au clic */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-md rounded-lg"
              style={{ width: '300px', height: '300px', top: '-70px', left: '-70px' }}
            >
              <div className="text-center p-6 bg-black/80 rounded-xl border border-[#D4A017]/50 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">Facteurs d'aléas</h3>
                
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Interruptions:</span>
                    <span className={cn("text-xl font-bold", getIntensityColor(intensity))}>
                      {Math.round(intensity * 0.8)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Changements:</span>
                    <span className={cn("text-xl font-bold", getIntensityColor(intensity))}>
                      {Math.round(intensity * 1.1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Problèmes techniques:</span>
                    <span className={cn("text-xl font-bold", getIntensityColor(intensity))}>
                      {Math.round(intensity * 0.9)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-[#D4A017]/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Intensité résultante:</span>
                    <span className={cn(
                      "text-2xl font-bold",
                      intensity >= 80 ? "text-red-500" : 
                      intensity >= 60 ? "text-orange-500" : 
                      intensity >= 40 ? "text-yellow-500" : 
                      "text-green-500"
                    )}>
                      {Math.round(intensity)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-[#D4A017] mt-3 text-sm">Cliquez pour fermer</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
