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
  rightLabel: string | React.ReactNode
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
              {rightLabel}
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
        <div className="flex items-center justify-center ml-4 pl-4 border-l border-gray-700/30 flex-grow">
          <div className="w-[100px] flex items-center justify-center">
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
      description="Représente la récupération (étirements, échauffements, pauses, relaxation, sommeil)."
      value={absorptionRate}
      maxValue={80}
      icon={<RectangleHorizontal className="w-5 h-5 text-green-400 transform rotate-90 scale-y-[0.3]" />}
      color="bg-green-400"
      borderColor="border-green-900/60"
      bgColor="bg-green-950/20"
      textColor="text-green-400"
      onSettingsClick={onSettingsClick}
      rightLabel={
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Activée</span>
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-green-500 h-4 w-7"
          />
        </div>
      }
    >
      <div className="flex items-center justify-center h-full w-full">
        <VerticalProgress
          value={absorptionRate}
          max={80}
          colorType="straw"
          height={80}
          width={16}
          showValue={true}
          showLabel={true}
          label="Absorption"
          className={cn(isEnabled ? "opacity-100" : "opacity-50")}
        />
      </div>
    </Section>
  )
}

interface TapSectionProps {
  flowRate: number
  environmentImpact?: number
  onSettingsClick: () => void
}

export function TapSectionV2({
  flowRate,
  environmentImpact,
  onSettingsClick
}: TapSectionProps) {
  return (
    <Section
      title="Robinet"
      description="Représente le flux de travail, la cadence et la charge de travail."
      value={flowRate}
      icon={<Droplet className="w-5 h-5 text-blue-400" />}
      color="bg-blue-400"
      borderColor="border-blue-900/60"
      bgColor="bg-blue-950/20"
      textColor="text-blue-400"
      onSettingsClick={onSettingsClick}
      rightLabel={environmentImpact ? (
        <div className="px-2 py-0.5 rounded bg-purple-900/50 border border-purple-500/30 text-xs text-purple-400">
          +{environmentImpact}% impact Bulle
        </div>
      ) : ""}
    >
      <div className="flex items-center justify-center h-full w-full">
        <VerticalProgress
          value={flowRate}
          colorType="tap"
          height={80}
          width={16}
          showValue={true}
          showLabel={true}
          label="Débit"
          labelClassName="whitespace-nowrap"
        />
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
      borderColor="border-gray-700/60"
      bgColor="bg-gray-950/20"
      textColor="text-gray-300"
      onSettingsClick={onSettingsClick}
      rightLabel=""
    >
      <div className="flex items-center justify-center h-full w-full">
        <VerticalProgress
          value={capacity}
          colorType="glass"
          height={80}
          width={16}
          showValue={true}
          showLabel={true}
          label="Capacité"
        />
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
      icon={<Wind className="w-5 h-5 text-[#D4A017]" />}
      color="bg-[#D4A017]"
      borderColor="border-[#D4A017]/60"
      bgColor="bg-[#D4A017]/10"
      textColor="text-[#D4A017]"
      onSettingsClick={onSettingsClick}
      rightLabel=""
    >
      <div className="flex items-center justify-center h-full w-full">
        <VerticalProgress
          value={intensity}
          colorType="storm"
          height={80}
          width={16}
          showValue={true}
          showLabel={true}
          label="Intensité"
        />
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
      rightLabel=""
    >
      <div className="flex items-center justify-center h-full w-full">
        <VerticalProgress
          value={environmentScore}
          colorType="bubble"
          height={80}
          width={16}
          showValue={true}
          showLabel={true}
          label="Agitation"
        />
      </div>
    </Section>
  )
}
