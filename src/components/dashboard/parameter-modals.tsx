"use client"

import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoaderCircle } from "lucide-react"

// Chargement paresseux des composants de formulaire
const TapSettingsForm = lazy(() => import('@/components/settings/tap-settings-form'));
const GlassSettingsForm = lazy(() => import('@/components/settings/glass-settings-form'));
const StrawSettingsForm = lazy(() => import('@/components/settings/straw-settings-form'));
const BubbleSettingsForm = lazy(() => import('@/components/settings/bubble-settings-form'));

// Composant de chargement
const LoadingForm = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
    <LoaderCircle className="h-12 w-12 animate-spin text-blue-500 mb-4" />
    <p className="text-gray-400 text-lg">Chargement du formulaire...</p>
  </div>
);

export function ParameterModals({ 
  activeModal, 
  onCloseModal 
}: { 
  activeModal: string | null, 
  onCloseModal: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Gérer l'ouverture/fermeture du dialog
  useEffect(() => {
    if (activeModal) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [activeModal]);
  
  // Fonction pour fermer la modal
  const handleClose = () => {
    setIsOpen(false);
    onCloseModal();
  };
  
  // Gérer le contenu en fonction du modal actif
  const renderContent = () => {
    // Ajouter un log pour déboguer
    console.log('Rendering modal content:', activeModal);
    
    try {
      switch (activeModal) {
        case 'tap':
          return (
            <Suspense fallback={<LoadingForm />}>
              <TapSettingsForm />
            </Suspense>
          );
        case 'glass':
          return (
            <Suspense fallback={<LoadingForm />}>
              <GlassSettingsForm />
            </Suspense>
          );
        case 'straw':
          return (
            <Suspense fallback={<LoadingForm />}>
              <StrawSettingsForm />
            </Suspense>
          );
        case 'bubble':
          return (
            <Suspense fallback={<LoadingForm />}>
              <BubbleSettingsForm />
            </Suspense>
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering modal content:', error);
      return (
        <div className="p-6 text-red-500">
          Une erreur s'est produite lors du chargement du formulaire. 
          Erreur: {error instanceof Error ? error.message : String(error)}
        </div>
      );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 