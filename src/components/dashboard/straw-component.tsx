"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { cn } from '@/lib/utils'
import { Switch } from "@/components/ui/switch"
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage'

interface StrawComponentProps {
  absorptionRate: number;
  setAbsorptionRate: (rate: number) => void;
  isInsideGlass?: boolean; // Indique si la paille est à l'intérieur du verre
}

export default function StrawComponent({ 
  absorptionRate, 
  setAbsorptionRate, 
  isInsideGlass = false 
}: StrawComponentProps) {
  const [isEnabled, setIsEnabled] = useState(true)

  // Charger les valeurs initiales de localStorage
  useEffect(() => {
    // Charger le taux d'absorption
    const savedRate = getLocalStorage('absorptionRate')
    if (savedRate) {
      const rate = parseInt(savedRate)
      if (!isNaN(rate)) {
        setAbsorptionRate(rate)
      }
    }

    // Écouter les événements personnalisés
    const handleStrawUpdate = (e: CustomEvent<{recoveryCapacity: number}>) => {
      if (e.detail && typeof e.detail.recoveryCapacity === 'number') {
        setAbsorptionRate(e.detail.recoveryCapacity)
        setLocalStorage('absorptionRate', e.detail.recoveryCapacity.toString())
      }
    }

    // Vérifier si la paille est activée
    const savedEnabled = getLocalStorage('strawEnabled')
    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true')
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener('strawUpdateEvent', handleStrawUpdate as EventListener)
    
    // Nettoyage
    return () => {
      window.removeEventListener('strawUpdateEvent', handleStrawUpdate as EventListener)
    }
  }, [setAbsorptionRate])

  // Gérer le changement d'état
  const handleToggle = () => {
    const newState = !isInsideGlass
    setIsEnabled(newState)
    setLocalStorage('strawEnabled', newState.toString())
  }
  
  // Obtenir la couleur en fonction du taux d'absorption
  const getAbsorptionColor = () => {
    if (!isEnabled) return "text-gray-500";
    if (absorptionRate >= 60) return "text-green-500";
    if (absorptionRate >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Obtenir la description du taux d'absorption
  const getAbsorptionDescription = () => {
    if (!isEnabled) return "Désactivée";
    if (absorptionRate >= 60) return "Optimale";
    if (absorptionRate >= 40) return "Modérée";
    return "Faible";
  };

  return (
    <div className="relative">
      {/* Paille */}
      <div className={cn(
        "relative w-[40px]",
        isInsideGlass ? "h-[250px]" : "h-[200px]",
        "flex items-center justify-center",
        !isEnabled && "opacity-50"
      )}>
        {/* Paille principale */}
        <div className="relative">
          {isInsideGlass ? (
            // Version de la paille à l'intérieur du verre avec le bout à l'extérieur
            <>
              {/* Partie horizontale de la paille (à l'extérieur du verre) */}
              <div className="absolute top-[30px] right-[-40px] w-[40px] h-6 bg-gradient-to-r from-green-500 to-green-600 border-t border-b border-green-700 z-10"></div>
              
              {/* Embout de la paille (à l'extérieur) */}
              <div className="absolute top-[27px] right-[-46px] w-6 h-12 bg-gradient-to-b from-green-500 to-green-700 rounded-full border border-green-800 z-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-green-300/30 rounded-full"></div>
              </div>
              
              {/* Partie courbée de la paille */}
              <div className="absolute top-[30px] right-0 w-6 h-6 bg-gradient-to-l from-green-500 to-green-600 rounded-bl-full border-l border-b border-green-700 z-10"></div>
              
              {/* Partie verticale de la paille (dans le verre) */}
              <div className="absolute top-[36px] right-[3px] w-6 h-[220px] bg-gradient-to-b from-green-400 to-green-600 border-x border-green-700 z-0">
                {/* Rayures décoratives */}
                <div className="absolute top-[20px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[50px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[80px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[110px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[140px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[170px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[200px] w-full h-2 bg-green-700/30"></div>
                
                {/* Partie intérieure de la paille */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-green-300/30"></div>
                
                {/* Embout inférieur de la paille (à l'intérieur du verre) */}
                <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border border-green-700"></div>
              </div>
              
              {/* Animation de l'absorption */}
              {isEnabled && (
                <motion.div
                  className="absolute top-[36px] right-[3px] w-2 h-[220px] overflow-hidden z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ right: '10px' }}
                >
                  {/* Particules d'eau montant dans la paille */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        left: '0px',
                        bottom: `-10px`,
                      }}
                      animate={{
                        y: [-10, -220],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </>
          ) : (
            // Version originale de la paille (à l'extérieur du verre)
            <>
              {/* Partie supérieure de la paille (visible) */}
              <div className="relative w-6 h-[120px] bg-gradient-to-b from-green-400 to-green-600 rounded-t-full overflow-hidden border border-green-700">
                {/* Reflet sur la paille */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-white/10"></div>
                
                {/* Rayures décoratives */}
                <div className="absolute top-[10px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[30px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[50px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[70px] w-full h-2 bg-green-700/30"></div>
                <div className="absolute top-[90px] w-full h-2 bg-green-700/30"></div>
                
                {/* Partie intérieure de la paille */}
                <div className="absolute top-[5px] left-1/2 transform -translate-x-1/2 w-2 h-[110px] bg-green-300/30 rounded-t-full"></div>
              </div>
              
              {/* Partie courbée de la paille */}
              <div className="absolute top-[120px] left-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-br-full border-r border-b border-green-700"></div>
              
              {/* Partie horizontale de la paille */}
              <div className="absolute top-[123px] left-[-40px] w-[40px] h-6 bg-gradient-to-r from-green-600 to-green-500 border-t border-green-700"></div>
              
              {/* Embout de la paille */}
              <div className="absolute top-[120px] left-[-46px] w-6 h-12 bg-gradient-to-b from-green-500 to-green-700 rounded-full border border-green-800">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-green-300/30 rounded-full"></div>
              </div>
              
              {/* Animation de l'absorption */}
              {isEnabled && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-[120px] overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Particules d'eau montant dans la paille */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        left: '0px',
                        bottom: `-10px`,
                      }}
                      animate={{
                        y: [-10, -120],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Contrôle du taux d'absorption */}
      {!isInsideGlass && (
        <div className="absolute -right-[120px] top-1/2 transform -translate-y-1/2 w-[100px]">
          <div className="p-2 bg-black/60 backdrop-blur-sm rounded-lg border border-green-500/30">
            <div className="flex flex-col items-center mb-2">
              <span className="text-xs text-gray-300 mb-1">Récupération:</span>
              <span className={cn("text-sm font-bold", getAbsorptionColor())}>
                {getAbsorptionDescription()}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">État:</span>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <Slider
              value={[absorptionRate]}
              min={10}
              max={80}
              step={5}
              onValueChange={(values: number[]) => setAbsorptionRate(values[0])}
              className="my-2"
              disabled={!isEnabled}
            />
            
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 