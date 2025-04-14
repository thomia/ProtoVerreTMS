"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { VerticalProgress } from '@/components/ui/vertical-progress'
import { Settings, Droplet, GlassWater, RectangleHorizontal, Cloud, Wind } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface SectionProps {
  title: string
  description: string
  value: number
  maxValue?: number
  icon: React.ReactNode
  color: string
  borderColor: string
  bgColor: string
  textColor: string
  onSettingsClick: () => void
  rightLabel: string
  children?: React.ReactNode
}

export function Section({
  title,
  description,
  value,
  maxValue = 100,
  icon,
  color,
  borderColor,
  bgColor,
  textColor,
  onSettingsClick,
  rightLabel,
  children
}: SectionProps) {
  return (
    <div className={cn(
      "space-y-3 p-4 rounded-lg transition-colors border-2",
      bgColor,
      borderColor
    )}>
      <div className="flex h-[120px]">
        {/* Contenu principal avec largeur fixe */}
        <div className="w-[220px] flex flex-col">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className={cn("text-base font-medium", textColor)}>{title}</h3>
            <div className="ml-auto">
              <span className={cn("text-sm", textColor)}>{rightLabel}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-1">
            {description}
          </p>
          <div className="flex-grow" />
          <button 
            onClick={onSettingsClick}
            className={cn(
              "group relative w-fit mt-2 px-2 py-1 text-xs transition-colors flex items-center",
              textColor
            )}
          >
            <Settings className="w-4 h-4 inline-block mr-1" />
            Configurer les paramètres
            <span className={cn(
              "absolute left-0 -bottom-px h-px w-full origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100",
              color
            )} />
          </button>
        </div>
        
        {/* Séparateur et barre de progression */}
        <div className="flex flex-col items-center ml-4 w-[80px] pl-4 border-l border-gray-700/30">
          <div className="relative h-full w-full flex flex-col items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StrawSectionProps {
  absorptionRate: number
  isEnabled: boolean
  onToggle: () => void
  onSettingsClick: () => void
}

export function StrawSectionV2({
  absorptionRate,
  isEnabled,
  onToggle,
  onSettingsClick
}: StrawSectionProps) {
  return (
    <Section
      title="Paille"
      description="Représente la capacité de récupération (étirements, échauffements, pauses, relaxation, sommeil)."
      value={absorptionRate}
      maxValue={80}
      icon={<RectangleHorizontal className="w-5 h-5 text-green-400 transform rotate-90 scale-y-[0.3]" />}
      color="bg-green-400"
      borderColor="border-green-900/60"
      bgColor="bg-green-950/20"
      textColor="text-green-400"
      onSettingsClick={onSettingsClick}
      rightLabel="Activée"
    >
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-xs text-gray-400">Activée</span>
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-green-500 h-4 w-7"
        />
      </div>
      
      <div className="flex flex-col items-center mt-1">
        <span className="text-xs text-gray-400 mb-1">Absorption</span>
        
        <div className="relative flex items-center">
          <VerticalProgress
            value={absorptionRate}
            max={80}
            colorType="straw"
            height={80}
            width={8}
            showValue={false}
            className={cn(isEnabled ? "opacity-100" : "opacity-50")}
          />
          
          <div 
            className="absolute -right-[30px] min-w-[35px] h-[22px] flex items-center justify-center rounded-md bg-black/40 border border-green-500/20 backdrop-blur-sm transition-all duration-300"
            style={{
              bottom: `${(absorptionRate / 80) * 100}%`,
              transform: 'translateY(50%)'
            }}
          >
            <span className="text-xs font-medium text-green-400">
              {absorptionRate}%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface TapSectionProps {
  flowRate: number
  onSettingsClick: () => void
}

export function TapSectionV2({
  flowRate,
  onSettingsClick
}: TapSectionProps) {
  return (
    <Section
      title="Robinet"
      description="Représente le flux de travail (cadence, rythme, intensité, charge de travail)."
      value={flowRate}
      icon={<Droplet className="w-5 h-5 text-blue-400" />}
      color="bg-blue-400"
      borderColor="border-blue-900/60"
      bgColor="bg-blue-950/20"
      textColor="text-blue-400"
      onSettingsClick={onSettingsClick}
      rightLabel="Débit"
    >
      <div className="flex flex-col items-center mt-4">
        <span className="text-xs text-gray-400 mb-1">Débit</span>
        
        <div className="relative flex items-center">
          <VerticalProgress
            value={flowRate}
            colorType="tap"
            height={80}
            width={8}
            showValue={false}
          />
          
          <div 
            className="absolute -right-[30px] min-w-[35px] h-[22px] flex items-center justify-center rounded-md bg-black/40 border border-blue-500/20 backdrop-blur-sm transition-all duration-300"
            style={{
              bottom: `${flowRate}%`,
              transform: 'translateY(50%)'
            }}
          >
            <span className="text-xs font-medium text-blue-400">
              {flowRate}%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface GlassSectionProps {
  capacity: number
  fillLevel: number
  onSettingsClick: () => void
}

export function GlassSectionV2({
  capacity,
  fillLevel,
  onSettingsClick
}: GlassSectionProps) {
  return (
    <Section
      title="Verre"
      description="Représente les contraintes imposées aux tissus (charge, fréquence, posture, état émotionnel)."
      value={capacity}
      icon={<GlassWater className="w-5 h-5 text-gray-300" />}
      color="bg-gray-300"
      borderColor="border-gray-800/60"
      bgColor="bg-gray-950/20"
      textColor="text-gray-300"
      onSettingsClick={onSettingsClick}
      rightLabel="Capacité"
    >
      <div className="flex flex-col items-center mt-4">
        <span className="text-xs text-gray-400 mb-1">Capacité</span>
        
        <div className="relative flex items-center">
          <VerticalProgress
            value={capacity}
            colorType="glass"
            height={80}
            width={8}
            showValue={false}
          />
          
          <div 
            className="absolute -right-[30px] min-w-[35px] h-[22px] flex items-center justify-center rounded-md bg-black/40 border border-gray-500/20 backdrop-blur-sm transition-all duration-300"
            style={{
              bottom: `${capacity}%`,
              transform: 'translateY(50%)'
            }}
          >
            <span className="text-xs font-medium text-gray-300">
              {capacity}%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface StormSectionProps {
  intensity: number
  onSettingsClick: () => void
}

export function StormSectionV2({
  intensity,
  onSettingsClick
}: StormSectionProps) {
  return (
    <Section
      title="Orage"
      description="Représente les facteurs environnementaux (tempête, vent, pluie, etc.)."
      value={intensity}
      icon={<Wind className="w-5 h-5 text-orange-400" />}
      color="bg-orange-400"
      borderColor="border-orange-900/60"
      bgColor="bg-orange-950/20"
      textColor="text-orange-400"
      onSettingsClick={onSettingsClick}
      rightLabel="Intensité"
    >
      <div className="flex flex-col items-center mt-4">
        <span className="text-xs text-gray-400 mb-1">Intensité</span>
        
        <div className="relative flex items-center">
          <VerticalProgress
            value={intensity}
            colorType="storm"
            height={80}
            width={8}
            showValue={false}
          />
          
          <div 
            className="absolute -right-[30px] min-w-[35px] h-[22px] flex items-center justify-center rounded-md bg-black/40 border border-[#D4A017]/20 backdrop-blur-sm transition-all duration-300"
            style={{
              bottom: `${intensity}%`,
              transform: 'translateY(50%)'
            }}
          >
            <span className="text-xs font-medium text-[#D4A017]">
              {intensity}%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface BubbleSectionProps {
  environmentScore: number
  onSettingsClick: () => void
}

export function BubbleSectionV2({
  environmentScore,
  onSettingsClick
}: BubbleSectionProps) {
  return (
    <Section
      title="Bulle"
      description="Représente l'environnement de travail (température, bruit, lumière, espace, équipements)."
      value={environmentScore}
      icon={<Cloud className="w-5 h-5 text-purple-400" />}
      color="bg-purple-400"
      borderColor="border-purple-900/60"
      bgColor="bg-purple-950/20"
      textColor="text-purple-400"
      onSettingsClick={onSettingsClick}
      rightLabel="Score"
    >
      <div className="flex flex-col items-center mt-4">
        <span className="text-xs text-gray-400 mb-1">Score</span>
        
        <div className="relative flex items-center">
          <VerticalProgress
            value={environmentScore}
            colorType="bubble"
            height={80}
            width={8}
            showValue={false}
          />
          
          <div 
            className="absolute -right-[30px] min-w-[35px] h-[22px] flex items-center justify-center rounded-md bg-black/40 border border-purple-500/20 backdrop-blur-sm transition-all duration-300"
            style={{
              bottom: `${environmentScore}%`,
              transform: 'translateY(50%)'
            }}
          >
            <span className="text-xs font-medium text-purple-400">
              {environmentScore}%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
