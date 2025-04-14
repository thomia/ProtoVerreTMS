"use client"

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'

interface TapComponentProps {
  flowRate: number;
  onFlowRateChange: (rate: number) => void;
  hideDebitLabel?: boolean; // Propriété pour masquer l'étiquette de débit
}

export default function TapComponent({ flowRate, onFlowRateChange, hideDebitLabel = false }: TapComponentProps) {
  const router = useRouter()
  const [showConstraints, setShowConstraints] = useState(false)
  
  // Facteurs de contrainte (valeurs entre 0 et 100)
  const [constraints, setConstraints] = useState({
    postureScores: {
      head: 0,
      back: 0,
      shoulder: 0,
      elbow: 0,
      wrist: 0
    },
    postureAdjustments: false
  })
  
  const flowRateRef = useRef(0)
  
  // Obtenir la classe de couleur en fonction du niveau de contrainte
  const getConstraintColor = (value: number) => {
    if (value >= 80) return "text-red-500";
    if (value >= 60) return "text-amber-500";
    if (value >= 40) return "text-yellow-500";
    return "text-green-500";
  }
  
  // Charger les contraintes depuis localStorage
  useEffect(() => {
    const savedConstraints = getLocalStorage('tapConstraints');
    if (savedConstraints) {
      try {
        setConstraints(JSON.parse(savedConstraints));
      } catch (e) {
        console.error("Erreur lors du chargement des contraintes:", e);
      }
    }

    // Fonction pour mettre à jour le débit à partir des événements
    const handleFlowRateUpdate = (e: CustomEvent<{ flowRate: number }>) => {
      if (e.detail && typeof e.detail.flowRate === 'number' && onFlowRateChange) {
        onFlowRateChange(e.detail.flowRate);
      }
    };

    // Écouter les événements personnalisés
    window.addEventListener('tapFlowUpdated', handleFlowRateUpdate as EventListener);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('tapFlowUpdated', handleFlowRateUpdate as EventListener);
    };
  }, [onFlowRateChange]);

  // Gérer le changement de débit
  useEffect(() => {
    // Lire le débit depuis localStorage lors du premier montage
    if (flowRateRef.current === 0) {
      const savedFlowRate = getLocalStorage('flowRate');
      if (savedFlowRate && onFlowRateChange) {
        const parsedRate = parseInt(savedFlowRate);
        if (!isNaN(parsedRate)) {
          onFlowRateChange(parsedRate);
        }
      }
    }

    // Mettre à jour la référence du débit actuel
    flowRateRef.current = flowRate;
    
    // Sauvegarder le débit dans localStorage pour que d'autres composants puissent y accéder
    setLocalStorage('flowRate', flowRate.toString());
    
    // Émettre un événement de stockage pour notifier les autres composants
    emitStorageEvent();
  }, [flowRate, onFlowRateChange]);
  
  const handleClick = () => {
    setShowConstraints(!showConstraints)
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
        
        {/* Filet d'eau qui tombe */}
        <div 
          className="absolute top-[120px] left-1/2 transform -translate-x-1/2 bg-blue-200"
          style={{
            width: `${getFlowWidth()}px`,
            height: '60px',
            opacity: flowRate > 0 ? 0.8 : 0
          }}
        ></div>
        
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
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.postureScores.head))}>
                      {constraints.postureScores.head}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Fréquence:</span>
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.postureScores.back))}>
                      {constraints.postureScores.back}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white">Posture:</span>
                    <span className={cn("text-xl font-bold", getConstraintColor(constraints.postureScores.shoulder))}>
                      {constraints.postureScores.shoulder}%
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