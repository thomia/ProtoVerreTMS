"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GlassComponentProps {
  width?: number; // Largeur du verre en pourcentage (100% par défaut)
  height?: number; // Hauteur du verre en pixels (300px par défaut)
  fillLevel: number; // Niveau de remplissage (0-100)
  absorptionRate: number; // Taux d'absorption (0-100)
  hideColorLegend?: boolean; // Option pour masquer la légende des couleurs
}

export default function GlassComponent({ 
  width = 100, 
  height = 300,
  fillLevel, 
  absorptionRate,
  hideColorLegend = false
}: GlassComponentProps) {
  // Calculer la largeur réelle du verre en pixels (entre 70px et 260px pour accentuer les différences et augmenter de 1,3x)
  const glassWidthPx = 70 + (width / 100) * 190;
  
  // Obtenir la couleur du niveau de remplissage
  const getFillColor = () => {
    if (fillLevel >= 90) return "from-purple-400/70 to-purple-600/70";
    if (fillLevel >= 80) return "from-red-400/70 to-red-600/70";
    if (fillLevel >= 60) return "from-yellow-400/70 to-yellow-600/70";
    return "from-green-400/70 to-green-600/70";
  };

  // Calculer les dimensions des éléments en fonction de la taille du verre
  const bubbleSize = (size: number) => Math.max(5, (height / 300) * size);
  const fontSize = (size: number) => Math.max(8, (height / 300) * size);

  // Calculer la capacité en pourcentage (20% de largeur = capacité minimale, 90% = capacité maximale)
  const capacityPercentage = Math.round(((width - 20) / 70) * 100);

  // Effet de console pour déboguer
  useEffect(() => {
    console.log("GlassComponent - width:", width, "glassWidthPx:", glassWidthPx, "capacityPercentage:", capacityPercentage);
  }, [width, glassWidthPx, capacityPercentage]);

  return (
    <div className="relative" style={{ 
      // Variables CSS pour les dimensions relatives
      '--glass-height': `${height}px`,
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
            animate={{ height: `${fillLevel}%` }}
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

            {/* Bulles animées */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/40"
                style={{
                  width: `${bubbleSize(Math.random() * 10 + 5)}px`,
                  height: `${bubbleSize(Math.random() * 10 + 5)}px`,
                  left: `${Math.random() * 80 + 10}%`,
                  bottom: `${Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -50 * (height / 300) - Math.random() * 50 * (height / 300)],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
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
        
        {/* Légende des couleurs (conditionnelle) */}
        {!hideColorLegend && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 bg-black/30 p-1 rounded">
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-green-500/70" style={{ width: 'var(--font-size-sm)', height: 'var(--font-size-sm)' }}></div>
              <span className="text-white" style={{ fontSize: 'var(--font-size-sm)' }}>0-60%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-yellow-500/70" style={{ width: 'var(--font-size-sm)', height: 'var(--font-size-sm)' }}></div>
              <span className="text-white" style={{ fontSize: 'var(--font-size-sm)' }}>60-80%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-red-500/70" style={{ width: 'var(--font-size-sm)', height: 'var(--font-size-sm)' }}></div>
              <span className="text-white" style={{ fontSize: 'var(--font-size-sm)' }}>80-90%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-purple-500/70" style={{ width: 'var(--font-size-sm)', height: 'var(--font-size-sm)' }}></div>
              <span className="text-white" style={{ fontSize: 'var(--font-size-sm)' }}>90-100%</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}