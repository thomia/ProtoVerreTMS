"use client"

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GlassComponentProps {
  width?: number; // Largeur du verre en pourcentage (100% par défaut)
  height?: number; // Hauteur du verre en pixels (300px par défaut)
  fillLevel?: number; // Niveau de remplissage (0-100)
  absorptionRate?: number; // Taux d'absorption (0-100)
  absorptionCapacity?: number; // Capacité d'absorption (0-100)
  hideColorLegend?: boolean; // Option pour masquer la légende des couleurs
}

export default function GlassComponent({ 
  width = 100, 
  height = 300,
  fillLevel = 0, 
  absorptionRate = 0,
  absorptionCapacity = 0,
  hideColorLegend = false
}: GlassComponentProps) {
  // État côté client uniquement
  const [isMounted, setIsMounted] = useState(false);
  
  // Définir les configurations des bulles de manière statique
  const bubbleConfigs = useMemo(() => [
    { size: 12, left: 25, bottom: 30, delay: 0.5, duration: 2.5 },
    { size: 8, left: 45, bottom: 50, delay: 1.2, duration: 3.2 },
    { size: 14, left: 65, bottom: 20, delay: 0.8, duration: 4.0 },
    { size: 10, left: 85, bottom: 60, delay: 2.0, duration: 3.0 },
    { size: 9, left: 15, bottom: 70, delay: 1.5, duration: 2.8 },
    { size: 13, left: 35, bottom: 40, delay: 0.2, duration: 3.5 },
    { size: 7, left: 55, bottom: 10, delay: 1.8, duration: 2.2 },
    { size: 11, left: 75, bottom: 80, delay: 0.7, duration: 3.8 }
  ], []);

  // Indiquer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Validation de sécurité pour les valeurs
  const safeWidth = Math.round(Math.max(0, Math.min(100, width)));
  const safeHeight = Math.round(Math.max(0, Math.min(500, height)));
  const safeFillLevel = Math.round(Math.max(0, Math.min(100, fillLevel)));
  const safeAbsorptionRate = Math.round(Math.max(0, Math.min(100, absorptionRate)));
  const safeAbsorptionCapacity = Math.round(Math.max(0, Math.min(100, absorptionCapacity)));

  // Calculer la largeur réelle du verre en pixels (entre 70px et 260px pour accentuer les différences et augmenter de 1,3x)
  const glassWidthPx = Math.round(70 + (safeWidth / 100) * 190);
  
  // Obtenir la couleur du niveau de remplissage
  const getFillColor = () => {
    if (safeFillLevel >= 90) return "from-purple-400/70 to-purple-600/70";
    if (safeFillLevel >= 80) return "from-red-400/70 to-red-600/70";
    if (safeFillLevel >= 60) return "from-yellow-400/70 to-yellow-600/70";
    return "from-green-400/70 to-green-600/70";
  };

  // Calculer les dimensions des éléments en fonction de la taille du verre
  const bubbleSize = (size: number) => Math.max(5, (safeHeight / 300) * size);
  const fontSize = (size: number) => Math.max(8, (safeHeight / 300) * size);

  // Calculer la capacité en pourcentage (20% de largeur = capacité minimale, 90% = capacité maximale)
  const capacityPercentage = Math.round(((safeWidth - 20) / 70) * 100);

  // Effet de console pour déboguer
  useEffect(() => {
    if (isMounted) {
      console.log("GlassComponent - width:", safeWidth, "glassWidthPx:", glassWidthPx, "capacityPercentage:", capacityPercentage);
    }
  }, [safeWidth, glassWidthPx, capacityPercentage, isMounted]);

  // Rendu conditionnel pour le SSR
  if (!isMounted) {
    // Version simplifiée pour le rendu serveur (sans animations ni valeurs aléatoires)
    return (
      <div className="relative">
        <div 
          className="relative mx-auto bg-blue-900/10 rounded-b-xl border-2 border-blue-400/30 overflow-hidden backdrop-blur-sm"
          style={{ 
            width: `${glassWidthPx}px`, 
            height: `${safeHeight}px`
          }}
        >
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-400/70 to-green-600/70" 
               style={{ height: `${safeFillLevel}%` }}>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ 
      // Variables CSS pour les dimensions relatives
      '--glass-height': `${safeHeight}px`,
      '--glass-width': `${glassWidthPx}px`,
      '--font-size-sm': `${fontSize(8)}px`,
      '--font-size-md': `${fontSize(10)}px`,
    } as React.CSSProperties}>
      {/* Verre */}
      <motion.div 
        className="relative mx-auto bg-blue-900/10 rounded-b-xl border-2 border-blue-400/30 overflow-hidden backdrop-blur-sm"
        style={{ 
          width: `${glassWidthPx}px`, 
          height: 'var(--glass-height)'
        }}
        initial={{ width: glassWidthPx }}
        animate={{ width: glassWidthPx }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Reflets sur le verre */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
        
        {/* Container pour le niveau d'eau et les marqueurs */}
        <div className="absolute inset-0">
          {/* Niveau d'eau */}
          <motion.div 
            className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${getFillColor()}`}
            initial={{ height: '0%' }}
            animate={{ height: `${safeFillLevel}%` }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{
              transformOrigin: 'bottom',
              willChange: 'height'
            }}
          >
            {/* Surface de l'eau avec vagues */}
            <div className="absolute top-0 left-0 w-full h-4 bg-white/20 transform -translate-y-1/2">
              <div className="absolute inset-0 opacity-50">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <motion.path 
                    d="M0,10 Q25,5 50,10 T100,10 V20 H0 Z" 
                    fill="rgba(255,255,255,0.3)"
                    animate={{ 
                      d: [
                        "M0,10 Q25,5 50,10 T100,10 V20 H0 Z",
                        "M0,10 Q25,15 50,10 T100,10 V20 H0 Z",
                        "M0,10 Q25,5 50,10 T100,10 V20 H0 Z"
                      ]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Bulles animées avec valeurs statiques pour éviter les problèmes d'hydratation */}
            {bubbleConfigs.map((config, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/40"
                style={{
                  width: `${bubbleSize(config.size)}px`,
                  height: `${bubbleSize(config.size)}px`,
                  left: `${config.left}%`,
                  bottom: `${config.bottom}%`,
                }}
                animate={{
                  y: [0, -50 * (safeHeight / 300)],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: config.duration,
                  repeat: Infinity,
                  delay: config.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Marqueurs de niveau */}
          <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ height: '100%' }}>
            <div style={{ height: '10%', minHeight: '10%' }} className="relative">
              <div className="absolute bottom-0 w-full border-b-2 border-dashed border-blue-300/50">
                <span className="absolute bottom-1 left-1 font-medium text-blue-300/90" 
                      style={{ fontSize: 'var(--font-size-md)' }}>90%</span>
              </div>
            </div>
            <div style={{ height: '10%', minHeight: '10%' }} className="relative">
              <div className="absolute bottom-0 w-full border-b-2 border-dashed border-blue-300/50">
                <span className="absolute bottom-1 left-1 font-medium text-blue-300/90" 
                      style={{ fontSize: 'var(--font-size-md)' }}>80%</span>
              </div>
            </div>
            <div style={{ height: '20%', minHeight: '20%' }} className="relative">
              <div className="absolute bottom-0 w-full border-b-2 border-dashed border-blue-300/50">
                <span className="absolute bottom-1 left-1 font-medium text-blue-300/90" 
                      style={{ fontSize: 'var(--font-size-md)' }}>60%</span>
              </div>
            </div>
            <div style={{ height: '60%', minHeight: '60%' }} className="relative">
              <div className="absolute bottom-0 w-full">
                <span className="absolute bottom-1 left-1 font-medium text-blue-300/90" 
                      style={{ fontSize: 'var(--font-size-md)' }}>0%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}