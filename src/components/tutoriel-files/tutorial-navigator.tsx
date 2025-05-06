"use client"

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Page1GlassExplanation from './page1-glass-explanation'
import Page2GlassInteractive from './page2-glass-interactive'
import Page3TapExplanation from './page3-tap-explanation'
import Page4TapAndGlassInteractive from './page4-tap-and-glass-interactive'

// Définition des étapes du tutoriel
export enum TutorialStep {
  Page1_GlassExplanation = 'page1-glass-explanation',
  Page2_GlassInteractive = 'page2-glass-interactive',
  Page3_TapExplanation = 'page3-tap-explanation',
  Page4_TapAndGlassInteractive = 'page4-tap-and-glass-interactive'
}

export default function TutorialNavigator() {
  // État pour suivre l'étape actuelle du tutoriel
  const [currentStep, setCurrentStep] = useState<TutorialStep>(TutorialStep.Page1_GlassExplanation)
  const [hasSeenGlassExplanation, setHasSeenGlassExplanation] = useState(false)
  const [hasSeenTapExplanation, setHasSeenTapExplanation] = useState(false)

  // Fonction pour passer à l'étape suivante
  const goToNextStep = useCallback(() => {
    switch (currentStep) {
      case TutorialStep.Page1_GlassExplanation:
        setCurrentStep(TutorialStep.Page2_GlassInteractive)
        setHasSeenGlassExplanation(true)
        break
      case TutorialStep.Page2_GlassInteractive:
        setCurrentStep(TutorialStep.Page3_TapExplanation)
        break
      case TutorialStep.Page3_TapExplanation:
        setCurrentStep(TutorialStep.Page4_TapAndGlassInteractive)
        setHasSeenTapExplanation(true)
        break
      // Vous pouvez ajouter d'autres étapes ici si nécessaire
    }
  }, [currentStep])

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = useCallback(() => {
    switch (currentStep) {
      case TutorialStep.Page2_GlassInteractive:
        setCurrentStep(TutorialStep.Page1_GlassExplanation)
        break
      case TutorialStep.Page3_TapExplanation:
        setCurrentStep(TutorialStep.Page2_GlassInteractive)
        break
      case TutorialStep.Page4_TapAndGlassInteractive:
        setCurrentStep(TutorialStep.Page3_TapExplanation)
        break
      // Vous pouvez ajouter d'autres étapes ici si nécessaire
    }
  }, [currentStep])

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case TutorialStep.Page1_GlassExplanation:
        return (
          <div className="relative">
            <Page1GlassExplanation 
              onComplete={() => {
                setHasSeenGlassExplanation(true)
              }} 
            />
            <div className="flex justify-end mt-8">
              <button
                onClick={goToNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                aria-label="Suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )
      case TutorialStep.Page2_GlassInteractive:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Page2GlassInteractive />
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousStep}
                className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
                aria-label="Précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                aria-label="Suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )
      case TutorialStep.Page3_TapExplanation:
        return (
          <div className="relative">
            <Page3TapExplanation 
              onComplete={() => {
                setHasSeenTapExplanation(true)
              }} 
            />
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousStep}
                className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
                aria-label="Précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                aria-label="Suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )
      case TutorialStep.Page4_TapAndGlassInteractive:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Page4TapAndGlassInteractive />
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousStep}
                className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
                aria-label="Précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {renderStepContent()}
      </div>
    </div>
  )
}
