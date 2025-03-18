"use client"

import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import BaseSettingsForm from './base-settings-form'

interface BubbleSettings {
  temperature: number // 5-30°C
  nightShift: boolean // true/false
  lighting: number // 0-1000 lux
  noise: number // 40-95 dB
  useProtection: boolean // true/false (EPI/EPC pour le bruit)
  hygiene: number // 0-100%
  space: number // 0-100%
  equipment: number // 0-100%
}

const defaultSettings: BubbleSettings = {
  temperature: 20,
  nightShift: false,
  lighting: 500,
  noise: 70,
  useProtection: false,
  hygiene: 80,
  space: 80,
  equipment: 80,
}

function calculateEnvironmentScore(settings: BubbleSettings): number {
  let score = 0

  // Température (optimal: 20°C ±3°C)
  const tempDiff = Math.abs(settings.temperature - 20)
  const tempScore = tempDiff <= 3 ? 0 : (tempDiff - 3) * 5
  score += tempScore

  // Éclairage - score basé sur l'écart par rapport aux recommandations
  const lightingDiff = Math.abs(settings.lighting - 500)
  const lightScore = (lightingDiff / 100) * 10 // 10 points max pour l'éclairage
  score += lightScore

  // Bruit - prise en compte des protections
  let effectiveNoise = settings.noise
  if (settings.noise >= 85 && settings.useProtection) {
    effectiveNoise = 70
  }
  // 0 points jusqu'à 80dB, puis augmentation progressive
  const noiseScore = effectiveNoise <= 80 ? 0 : (effectiveNoise - 80) * 4
  score += noiseScore

  // Hygiène (0-100%) - 100% est optimal (environnement propre et salubre)
  score += settings.hygiene * 0.2 // 20 points max pour l'hygiène

  // Espace (0-100%) - 100% est optimal (espace aisé)
  score += settings.space * 0.2 // 20 points max pour l'espace

  // Équipement (0-100%) - 100% est optimal (pas d'équipement contraignant)
  score += settings.equipment * 0.2 // 20 points max pour l'équipement

  // Bonus pour le travail de nuit (+20%)
  if (settings.nightShift) {
    score *= 1.2
  }

  return Math.min(100, Math.round(score))
}

export default function BubbleSettingsForm() {
  const [settings, setSettings] = useState<BubbleSettings>(defaultSettings)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('bubbleSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSubmit = () => {
    localStorage.setItem('bubbleSettings', JSON.stringify(settings))
    const score = calculateEnvironmentScore(settings)
    localStorage.setItem('environmentScore', score.toString())
    window.dispatchEvent(new Event('environmentScoreUpdated'))
  }

  const score = calculateEnvironmentScore(settings)

  function getEnvironmentDescription(score: number): string {
    if (score >= 80) return "Agitation importante"
    if (score >= 60) return "Agitation élevée"
    if (score >= 40) return "Agitation acceptable"
    return "Agitation faible"
  }

  return (
    <BaseSettingsForm
      title="Paramètres de la Bulle"
      description="L'environnement de travail exerce une influence déterminante sur les plans psychologique et physiologique. Il peut ainsi accentuer l'exposition des travailleurs aux risques de troubles musculo-squelettiques (TMS) et de probabilité d'accident de travail, en amplifiant les contraintes objectives et perçues."
      currentValue={score}
      getValueDescription={getEnvironmentDescription}
      onSubmit={handleSubmit}
      scoreType="bubble"
    >
      <div className="grid gap-8">
        <div className="space-y-6 p-6 rounded-lg bg-gray-950/50 border border-gray-800">
          <h3 className="text-lg font-semibold text-white">Facteurs environnementaux</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {/* Température */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Température</Label>
                  <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.temperature}°C</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="h-2 w-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent" style={{ clipPath: 'inset(0 ${100 - ((23/25) * 100)}% 0 ${(17/25) * 100}%)' }} />
                  </div>
                  <Slider
                    min={5}
                    max={30}
                    step={0.5}
                    value={[settings.temperature]}
                    onValueChange={([value]) =>
                      setSettings({ ...settings, temperature: value })
                    }
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:to-gray-400 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">5°C</span>
                    <span className="text-gray-400 font-medium mt-1">Très froid</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-100 font-semibold">20°C ±3°</span>
                    <span className="text-green-400 font-medium mt-1">Optimal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">30°C</span>
                    <span className="text-gray-400 font-medium mt-1">Très chaud</span>
                  </div>
                </div>
              </div>

              {/* Éclairage */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Éclairage</Label>
                  <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.lighting} lux</span>
                </div>
                <Slider
                  min={0}
                  max={1000}
                  step={50}
                  value={[settings.lighting]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, lighting: value })
                  }
                  className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:to-gray-400 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">0 lux</span>
                    <span className="text-gray-400 font-medium mt-1">Noir total</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-100 font-semibold">500 lux</span>
                    <span className="text-gray-300 font-medium mt-1">Standard</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">1000 lux</span>
                    <span className="text-gray-400 font-medium mt-1">Précision</span>
                  </div>
                </div>
              </div>

              {/* Niveau sonore */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Niveau sonore</Label>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">
                      {settings.noise} dB
                      {settings.noise >= 85 && !settings.useProtection && (
                        <span className="ml-2 text-red-400">⚠️</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="h-2 w-full bg-gradient-to-r from-gray-300 via-yellow-300 to-red-500" />
                  </div>
                  <Slider
                    min={40}
                    max={95}
                    step={1}
                    value={[settings.noise]}
                    onValueChange={([value]) => {
                      setSettings(prev => ({ ...prev, noise: Math.round(value) }))
                    }}
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:via-yellow-400 [&_.range]:to-red-500 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                  />
                </div>
                <div className="flex justify-between items-center text-sm relative h-12">
                  <div className="flex flex-col items-center absolute left-[2%]">
                    <span className="text-gray-300 font-medium">40 dB</span>
                    <span className="text-gray-400 font-medium mt-1">Calme</span>
                  </div>
                  <div className="flex flex-col items-center absolute left-[35%]">
                    <span className="text-yellow-300 font-medium">80 dB</span>
                    <span className="text-yellow-400/70 font-medium mt-1">Information</span>
                  </div>
                  <div className="flex flex-col items-center absolute left-[78%]">
                    <span className="text-orange-300 font-medium">85 dB</span>
                    <span className="text-orange-400/70 font-medium mt-1">Protection</span>
                  </div>
                  <div className="flex flex-col items-center absolute right-[2%]">
                    <span className="text-red-300 font-medium">95 dB</span>
                    <span className="text-red-400/70 font-medium mt-1">Critique</span>
                  </div>
                </div>
                {settings.noise >= 85 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className="space-y-1">
                      <Label className="text-base font-medium text-white">Protection auditive</Label>
                      <div className="text-sm text-gray-400">Protection obligatoire</div>
                    </div>
                    <Switch
                      checked={settings.useProtection}
                      onCheckedChange={(checked) => {
                        setSettings({ ...settings, useProtection: checked });
                        // Empêcher la propagation de l'événement
                        const event = window.event;
                        if (event) {
                          event.stopPropagation();
                          event.preventDefault();
                        }
                      }}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Niveau d'hygiène */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Niveau d'hygiène</Label>
                  <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.hygiene}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.hygiene]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, hygiene: value })
                  }
                  className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:to-gray-400 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">Propre</span>
                    <span className="text-gray-400 font-medium mt-1">et salubre</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-100 font-semibold">Sale</span>
                    <span className="text-gray-300 font-medium mt-1">et insalubre</span>
                  </div>
                </div>
              </div>

              {/* Espace de travail */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Espace de travail</Label>
                  <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.space}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.space]}
                  onValueChange={([value]) => setSettings({ ...settings, space: value })}
                  className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:to-gray-400 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">Aisé</span>
                    <span className="text-gray-400 font-medium mt-1">Mouvement libre</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-100 font-semibold">Contraint</span>
                    <span className="text-gray-300 font-medium mt-1">Très exigu</span>
                  </div>
                </div>
              </div>

              {/* Qualité des équipements */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-white">Équipements contraignants</Label>
                  <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.equipment}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.equipment]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, equipment: value })
                  }
                  className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gradient-to-r [&_.range]:from-gray-300 [&_.range]:to-gray-400 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 font-medium">Non gênant</span>
                    <span className="text-gray-400 font-medium mt-1">Léger</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-100 font-semibold">Gênant</span>
                    <span className="text-gray-300 font-medium mt-1">Lourd</span>
                  </div>
                </div>
              </div>

              {/* Travail de nuit */}
              <div className="flex flex-col space-y-4">
                <Label className="text-xl font-semibold text-white">Travail de nuit</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettings({ ...settings, nightShift: false })}
                    className={cn(
                      "relative px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 overflow-hidden",
                      !settings.nightShift
                        ? "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 text-yellow-100 shadow-lg shadow-orange-900/20 ring-2 ring-yellow-500/50"
                        : "bg-gray-900/80 text-gray-400 hover:bg-gray-800/90 hover:text-gray-300"
                    )}
                  >
                    <span className="relative z-10">☀️ Jour</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, nightShift: true })}
                    className={cn(
                      "relative px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 overflow-hidden",
                      settings.nightShift
                        ? "bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-100 shadow-lg shadow-blue-900/20 ring-2 ring-blue-500/50"
                        : "bg-gray-900/80 text-gray-400 hover:bg-gray-800/90 hover:text-gray-300"
                    )}
                  >
                    <span className="relative z-10">🌙 Nuit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSettingsForm>
  )
} 