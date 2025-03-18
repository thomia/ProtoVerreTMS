"use client"

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { GlassWater, Droplet, RectangleHorizontal, Cloud } from 'lucide-react'
import GlassSettingsForm from '@/components/settings/glass-settings-form'
import StrawSettingsForm from '@/components/settings/straw-settings-form'
import TapSettingsForm from '@/components/settings/tap-settings-form'
import BubbleSettingsForm from '@/components/settings/bubble-settings-form'
import { motion, AnimatePresence } from 'framer-motion'

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
            <TapSettingsForm />
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
            <GlassSettingsForm />
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
            <StrawSettingsForm />
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
            <BubbleSettingsForm />
          </div>
        </AnimatedDialogContent>
      </Dialog>
    </>
  )
} 