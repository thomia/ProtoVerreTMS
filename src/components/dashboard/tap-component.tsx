"use client"

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TapComponentProps {
  onFlowRateChange?: (rate: number) => void;
  hideDebitLabel?: boolean; // Propriété pour masquer l'étiquette de débit
}

export default function TapComponent({ onFlowRateChange, hideDebitLabel = false }: TapComponentProps) {
  const router = useRouter()
  const [showConstraints, setShowConstraints] = useState(false)
  
  // Facteurs de contrainte (valeurs entre 0 et 100)
  const [constraints, setConstraints] = useState({
    charge: 75, // Charge de travail
    frequence: 60, // Fréquence des mouvements
    posture: 85, // Posture de travail
  })
  
  // Charger les contraintes sauvegardées au démarrage et à chaque changement
  useEffect(() => {
    const loadConstraints = () => {
      const savedConstraints = localStorage.getItem('tapConstraints');
      if (savedConstraints) {
        try {
          const parsed = JSON.parse(savedConstraints);
          setConstraints(parsed);
          
          // Notifier immédiatement le parent du changement de débit
          if (onFlowRateChange) {
            const newFlowRate = calculateFlowRate(parsed);
            onFlowRateChange(newFlowRate);
          }
        } catch (e) {
          console.error("Erreur lors du chargement des contraintes:", e);
        }
      }
    };
    
    // Charger les contraintes au démarrage
    loadConstraints();
    
    // Ajouter un écouteur d'événements pour détecter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tapConstraints') {
        loadConstraints();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les changements dans localStorage
    const intervalId = setInterval(loadConstraints, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [onFlowRateChange]);
  
  // Calculer le débit en fonction des contraintes
  const calculateFlowRate = (constraintsToUse = constraints) => {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') return 0;
    
    // Lire le débit depuis localStorage
    const savedFlowRate = localStorage.getItem('flowRate');
    if (savedFlowRate) {
      const parsedFlowRate = parseInt(savedFlowRate);
      if (!isNaN(parsedFlowRate)) {
        return parsedFlowRate;
      }
    }
    
    // Fallback si pas de débit sauvegardé
    return 0;
  }
  
  const flowRate = calculateFlowRate();
  
  // Notifier le parent du changement de débit
  useEffect(() => {
    if (onFlowRateChange) {
      onFlowRateChange(flowRate);
    }
    
    // Sauvegarder le débit dans localStorage pour que d'autres composants puissent y accéder
    localStorage.setItem('flowRate', flowRate.toString());
  }, [flowRate, onFlowRateChange]);

  const handleClick = () => {
    setShowConstraints(true);
    // Afficher les contraintes pendant 3 secondes, puis rediriger
    setTimeout(() => {
      router.push('/tap-settings')
    }, 3000)
  }
  
  // Obtenir la couleur en fonction du niveau de contrainte
  const getConstraintColor = (value: number) => {
    if (value <= 40) return "text-green-500";
    if (value <= 70) return "text-yellow-500";
    if (value <= 90) return "text-orange-500";
    return "text-red-500";
  }
  
  // Obtenir la largeur du flux d'eau en fonction du débit
  const getFlowWidth = () => {
    // Convertir le débit (20-100) en largeur (2-12)
    return Math.max(2, Math.min(12, Math.floor(flowRate / 10)));
  }
  
  // Obtenir la description du débit
  const getFlowDescription = () => {
    if (flowRate < 40) return "Faible";
    if (flowRate < 60) return "Modéré";
    if (flowRate < 80) return "Élevé";
    return "Critique";
  }

  return (
    <div 
      className="relative"
    >
      <motion.div 
        className="relative h-[160px] w-full max-w-[160px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Poignée en T */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          {/* Barre horizontale de la poignée */}
          <div className="w-36 h-6 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full border-2 border-blue-400/50 shadow-md">
            {/* Extrémités arrondies */}
            <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-300 rounded-full border-2 border-blue-400/50"></div>
            <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-300 rounded-full border-2 border-blue-400/50"></div>
          </div>
          
          {/* Tige verticale de la poignée */}
          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 w-6 h-14 bg-gradient-to-b from-blue-300 to-blue-400 border-2 border-blue-400/50"></div>
        </div>
        
        {/* Corps du robinet */}
        <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-lg border-2 border-blue-500/50 shadow-md">
          {/* Partie supérieure arrondie */}
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-18 h-6 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full border-2 border-blue-400/50"></div>
          
          {/* Anneau décoratif */}
          <div className="absolute top-[8px] left-1/2 transform -translate-x-1/2 w-18 h-3 bg-blue-300 border-t-2 border-b-2 border-blue-400/50"></div>
        </div>
        
        {/* Bec vertical du robinet - ORIENTÉ VERS LE BAS */}
        <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2">
          {/* Base du bec */}
          <div className="w-12 h-18 bg-gradient-to-b from-blue-400 to-blue-600 rounded-b-lg border-2 border-blue-500/50 shadow-md relative">
            {/* Partie verticale du bec */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-40 bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-blue-500/50">
              {/* Embout du robinet */}
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-12 h-10 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full border-2 border-blue-400/50">
                {/* Ouverture */}
                <div className="absolute bottom-[2px] left-1/2 transform -translate-x-1/2 w-6 h-3 bg-blue-200 rounded-b-lg border border-blue-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicateur de débit - Visible en permanence sauf si hideDebitLabel est true */}
        {!hideDebitLabel && (
          <div className="absolute top-[-30px] right-[-20px] px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full shadow-lg border border-white/20 z-20">
            <span className={cn(
              "text-sm font-bold",
              flowRate >= 80 ? "text-red-500" : 
              flowRate >= 60 ? "text-orange-500" : 
              flowRate >= 40 ? "text-yellow-500" : 
              "text-green-500"
            )}>
              Débit: {getFlowDescription()}
            </span>
          </div>
        )}
        
        {/* Affichage des contraintes au clic */}
        <AnimatePresence>
          {showConstraints && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-md rounded-lg"
              style={{ width: '300px', height: '300px', top: '-70px', left: '-70px' }}
            >
              <div className="text-center p-6 bg-black/80 rounded-xl border border-indigo-500/50 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">Facteurs de contrainte</h3>
                
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Charge:</span>
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.charge))}>
                      {constraints.charge}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Fréquence:</span>
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.frequence))}>
                      {constraints.frequence}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Posture:</span>
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.posture))}>
                      {constraints.posture}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-indigo-500/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Débit résultant:</span>
                    <span className={cn(
                      "text-2xl font-bold",
                      flowRate >= 80 ? "text-red-500" : 
                      flowRate >= 60 ? "text-orange-500" : 
                      flowRate >= 40 ? "text-yellow-500" : 
                      "text-green-500"
                    )}>
                      {flowRate}%
                    </span>
                  </div>
                </div>
                
                <p className="text-indigo-300 mt-3 text-sm">Redirection vers les paramètres...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 