"use client"

import React from 'react'
import { ParameterSection } from '@/components/ui/parameter-section'
import { cn } from '@/lib/utils'

interface StrawSectionProps {
  absorptionRate: number
  isEnabled: boolean
  onToggle: () => void
  onSettingsClick: () => void
}

export function StrawSection({
  absorptionRate,
  isEnabled,
  onToggle,
  onSettingsClick
}: StrawSectionProps) {
  // Obtenir la description du taux d'absorption
  const getAbsorptionDescription = () => {
    if (!isEnabled) return "Désactivée";
    if (absorptionRate >= 60) return "Optimale";
    if (absorptionRate >= 40) return "Modérée";
    return "Faible";
  };

  return (
    <ParameterSection
      title="Paille"
      description="Représente la capacité de récupération (étirements, échauffements, pauses, relaxation, sommeil)."
      value={absorptionRate}
      maxValue={80}
      isEnabled={isEnabled}
      onToggle={onToggle}
      onSettingsClick={onSettingsClick}
      type="straw"
      className="w-[280px]"
    >
      <div className="flex flex-col justify-center">
        <span className="text-xs text-gray-400 mb-1">Absorption</span>
        <span className={cn(
          "text-sm font-bold",
          !isEnabled ? "text-gray-500" :
          absorptionRate >= 60 ? "text-green-500" :
          absorptionRate >= 40 ? "text-yellow-500" :
          "text-red-500"
        )}>
          {absorptionRate}%
        </span>
        <span className={cn(
          "text-xs mt-1",
          !isEnabled ? "text-gray-500" :
          absorptionRate >= 60 ? "text-green-400" :
          absorptionRate >= 40 ? "text-yellow-400" :
          "text-red-400"
        )}>
          {getAbsorptionDescription()}
        </span>
      </div>
    </ParameterSection>
  )
}

interface TapSectionProps {
  flowRate: number
  onSettingsClick: () => void
}

export function TapSection({
  flowRate,
  onSettingsClick
}: TapSectionProps) {
  // Obtenir la description du débit
  const getFlowDescription = () => {
    if (flowRate < 40) return "Faible";
    if (flowRate < 60) return "Modéré";
    if (flowRate < 80) return "Élevé";
    return "Critique";
  };

  return (
    <ParameterSection
      title="Robinet"
      description="Représente le débit de travail (charge, fréquence, posture, force)."
      value={flowRate}
      onSettingsClick={onSettingsClick}
      type="tap"
      className="w-[280px]"
    >
      <div className="flex flex-col justify-center">
        <span className="text-xs text-gray-400 mb-1">Débit</span>
        <span className={cn(
          "text-sm font-bold",
          flowRate >= 80 ? "text-red-500" : 
          flowRate >= 60 ? "text-orange-500" : 
          flowRate >= 40 ? "text-yellow-500" : 
          "text-green-500"
        )}>
          {flowRate}%
        </span>
        <span className={cn(
          "text-xs mt-1",
          flowRate >= 80 ? "text-red-400" : 
          flowRate >= 60 ? "text-orange-400" : 
          flowRate >= 40 ? "text-yellow-400" : 
          "text-green-400"
        )}>
          {getFlowDescription()}
        </span>
      </div>
    </ParameterSection>
  )
}

interface GlassSectionProps {
  capacity: number
  fillLevel: number
  onSettingsClick: () => void
}

export function GlassSection({
  capacity,
  fillLevel,
  onSettingsClick
}: GlassSectionProps) {
  // Obtenir la description de la capacité
  const getCapacityDescription = () => {
    if (capacity < 40) return "Limitée";
    if (capacity < 60) return "Modérée";
    if (capacity < 80) return "Bonne";
    return "Excellente";
  };

  return (
    <ParameterSection
      title="Verre"
      description="Représente la capacité d'absorption des tissus (contraintes biomécaniques)."
      value={capacity}
      onSettingsClick={onSettingsClick}
      type="glass"
      className="w-[280px]"
    >
      <div className="flex flex-col justify-center">
        <span className="text-xs text-gray-400 mb-1">Capacité</span>
        <span className="text-sm font-bold text-gray-200">
          {capacity}%
        </span>
        <span className="text-xs mt-1 text-gray-400">
          {getCapacityDescription()}
        </span>
        
        <div className="mt-2">
          <span className="text-xs text-gray-400 mb-1">Niveau</span>
          <span className={cn(
            "text-sm font-bold",
            fillLevel >= 90 ? "text-purple-500" :
            fillLevel >= 80 ? "text-red-500" :
            fillLevel >= 60 ? "text-yellow-500" :
            "text-green-500"
          )}>
            {Math.round(fillLevel)}%
          </span>
        </div>
      </div>
    </ParameterSection>
  )
}

interface StormSectionProps {
  intensity: number
  onSettingsClick: () => void
}

export function StormSection({
  intensity,
  onSettingsClick
}: StormSectionProps) {
  // Obtenir la description de l'intensité
  const getIntensityDescription = () => {
    if (intensity < 40) return "Faible";
    if (intensity < 60) return "Modérée";
    if (intensity < 80) return "Élevée";
    return "Critique";
  };

  return (
    <ParameterSection
      title="Orage"
      description="Représente les aléas et perturbations (interruptions, changements, problèmes techniques)."
      value={intensity}
      onSettingsClick={onSettingsClick}
      type="storm"
      className="w-[280px]"
    >
      <div className="flex flex-col justify-center">
        <span className="text-xs text-gray-400 mb-1">Intensité</span>
        <span className={cn(
          "text-sm font-bold",
          intensity >= 80 ? "text-red-500" : 
          intensity >= 60 ? "text-orange-500" : 
          intensity >= 40 ? "text-yellow-500" : 
          "text-green-500"
        )}>
          {intensity}%
        </span>
        <span className={cn(
          "text-xs mt-1",
          intensity >= 80 ? "text-red-400" : 
          intensity >= 60 ? "text-orange-400" : 
          intensity >= 40 ? "text-yellow-400" : 
          "text-green-400"
        )}>
          {getIntensityDescription()}
        </span>
      </div>
    </ParameterSection>
  )
}

interface BubbleSectionProps {
  environmentScore: number
  onSettingsClick: () => void
}

export function BubbleSection({
  environmentScore,
  onSettingsClick
}: BubbleSectionProps) {
  // Obtenir la description du score environnemental
  const getEnvironmentDescription = () => {
    if (environmentScore < 40) return "Défavorable";
    if (environmentScore < 60) return "Neutre";
    if (environmentScore < 80) return "Favorable";
    return "Optimal";
  };

  return (
    <ParameterSection
      title="Bulle"
      description="Représente l'environnement de travail (ambiance, soutien, reconnaissance, autonomie)."
      value={environmentScore}
      onSettingsClick={onSettingsClick}
      type="bubble"
      className="w-[280px]"
    >
      <div className="flex flex-col justify-center">
        <span className="text-xs text-gray-400 mb-1">Score</span>
        <span className={cn(
          "text-sm font-bold",
          environmentScore >= 80 ? "text-purple-500" : 
          environmentScore >= 60 ? "text-blue-500" : 
          environmentScore >= 40 ? "text-yellow-500" : 
          "text-red-500"
        )}>
          {environmentScore}%
        </span>
        <span className={cn(
          "text-xs mt-1",
          environmentScore >= 80 ? "text-purple-400" : 
          environmentScore >= 60 ? "text-blue-400" : 
          environmentScore >= 40 ? "text-yellow-400" : 
          "text-red-400"
        )}>
          {getEnvironmentDescription()}
        </span>
      </div>
    </ParameterSection>
  )
}
