"use client"

import React, { useState, Suspense } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { GlassWater, Droplet, RectangleHorizontal, Cloud, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Charger les composants dynamiquement pour éviter les rendus inutiles
const GlassSettingsForm = React.lazy(() => import('@/components/settings/glass-settings-form'))
const StrawSettingsForm = React.lazy(() => import('@/components/settings/straw-settings-form'))
const TapSettingsForm = React.lazy(() => import('@/components/settings/tap-settings-form'))
const BubbleSettingsForm = React.lazy(() => import('@/components/settings/bubble-settings-form'))

// Composant de chargement pour Suspense
const FormLoader = () => (
  <div className="flex items-center justify-center w-full py-20">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <span className="ml-3 text-lg text-gray-400">Chargement du formulaire...</span>
  </div>
)

interface ParameterModalsProps {
  activeModal: 'tap' | 'glass' | 'straw' | 'bubble' | null
  onClose: () => void
}

// Composant de contenu de dialogue animé
const AnimatedDialogContent = ({ children, ...props }: any) => (
  <DialogContent {...props} className="max-w-[90vw] w-[1800px] max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gray-950 border border-gray-800 rounded-lg shadow-xl p-6"
    >
      {children}
    </motion.div>
  </DialogContent>
);

export default function ParameterModals({
  activeModal,
  onClose
}: ParameterModalsProps) {
  return (
    <>
      <Dialog open={activeModal === 'tap'} onOpenChange={() => onClose()}>
        <AnimatedDialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Paramètres du Robinet
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {activeModal === 'tap' && (
              <Suspense fallback={<FormLoader />}>
                <TapSettingsForm />
              </Suspense>
            )}
          </div>
        </AnimatedDialogContent>
      </Dialog>

      <Dialog open={activeModal === 'glass'} onOpenChange={() => onClose()}>
        <AnimatedDialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GlassWater className="h-5 w-5 text-gray-200" />
              Paramètres du Verre
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {activeModal === 'glass' && (
              <Suspense fallback={<FormLoader />}>
                <GlassSettingsForm />
              </Suspense>
            )}
          </div>
        </AnimatedDialogContent>
      </Dialog>

      <Dialog open={activeModal === 'straw'} onOpenChange={() => onClose()}>
        <AnimatedDialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RectangleHorizontal className="h-5 w-5 text-green-500 transform rotate-90 scale-y-[0.3]" />
              Paramètres de la Paille
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {activeModal === 'straw' && (
              <Suspense fallback={<FormLoader />}>
                <StrawSettingsForm />
              </Suspense>
            )}
          </div>
        </AnimatedDialogContent>
      </Dialog>

      <Dialog open={activeModal === 'bubble'} onOpenChange={() => onClose()}>
        <AnimatedDialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-purple-500" />
              Paramètres de la Bulle
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {activeModal === 'bubble' && (
              <Suspense fallback={<FormLoader />}>
                <BubbleSettingsForm />
              </Suspense>
            )}
          </div>
        </AnimatedDialogContent>
      </Dialog>
    </>
  )
} 