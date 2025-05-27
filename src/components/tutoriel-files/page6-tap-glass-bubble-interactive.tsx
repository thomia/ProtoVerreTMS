"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { EnvironmentParticles } from '@/components/dashboard/environment-particles'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'

// Interface pour les paramètres de la bulle
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

export default function TapGlassBubbleInteractive() {
  // États pour les paramètres du verre et du robinet
  const [glassSize, setGlassSize] = useState(70)
  const [flowRate, setFlowRate] = useState(50)
  const [isPaused, setIsPaused] = useState(false)
  
  // Paramètres environnementaux (bulle)
  const [settings, setSettings] = useState<BubbleSettings>({
    temperature: 20,
    lighting: 500,
    noise: 70,
    useProtection: false,
    hygiene: 60,
    space: 50,
    equipment: 40,
    nightShift: false
  })
  
  // État pour le score environnemental
  const [environmentScore, setEnvironmentScore] = useState(60)
  
  // État pour le statut (débordement ou non)
  const [isOverflowing, setIsOverflowing] = useState(false)
  
  // Calculer le score environnemental
  const calculateEnvironmentScore = (settings: BubbleSettings): number => {
    // Facteurs de base
    let tempFactor = Math.abs(settings.temperature - 20) * 1.5; // Optimal à 20°C
    let lightFactor = Math.abs(settings.lighting - 500) / 10; // Optimal à 500 lux
    let noiseFactor = settings.noise;
    
    // Ajustements
    if (settings.noise > 85 && !settings.useProtection) {
      noiseFactor += 15; // Pénalité pour absence de protection à niveau sonore élevé
    }
    
    // Calcul du score final (0-100)
    const rawScore = (
      tempFactor + 
      lightFactor + 
      noiseFactor * 0.5 + 
      settings.hygiene * 0.7 + 
      settings.space * 0.6 + 
      settings.equipment * 0.8 + 
      (settings.nightShift ? 15 : 0)
    ) / 5;
    
    return Math.min(100, Math.max(0, Math.round(rawScore)));
  }
  
  // Mettre à jour le score environnemental lorsque les paramètres changent
  useEffect(() => {
    const score = calculateEnvironmentScore(settings);
    setEnvironmentScore(score);
  }, [settings]);
  
  // Vérifier si le verre déborde
  useEffect(() => {
    setIsOverflowing(flowRate > glassSize);
  }, [flowRate, glassSize]);

  // Fonction pour gérer le changement de débit
  const handleFlowRateChange = (newRate: number) => {
    setFlowRate(newRate);
  }
  
  // Fonction pour mettre à jour un paramètre de la bulle
  const updateSetting = <K extends keyof BubbleSettings>(key: K, value: BubbleSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }
  
  // Description du score environnemental
  function getEnvironmentDescription(score: number): string {
    if (score >= 80) return "Agitation importante";
    if (score >= 60) return "Agitation élevée";
    if (score >= 40) return "Agitation acceptable";
    return "Agitation faible";
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Interaction Verre, Robinet et Bulle</h2>
        
        <div className="flex flex-col gap-6">
          {/* Visualisation principale */}
          <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
            <CardContent className="p-4">
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-semibold text-white mb-1">Simulation</h3>
                <p className="text-sm text-gray-400">Visualisation des interactions</p>
              </div>
              
              <div className="relative w-full h-[650px] flex flex-col items-center justify-center">
                {/* Bulle environnementale */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] z-0" style={{ top: '48%' }}>
                  <EnvironmentParticles 
                    score={environmentScore} 
                    isPaused={isPaused}
                  />
                </div>
                
                {/* Structure avec le robinet et le verre */}
                <div className="flex flex-col items-center justify-center relative" style={{ height: '580px' }}>
                  {/* Robinet */}
                  <div className="relative z-20 mt-[50px]">
                    <TapComponent 
                      flowRate={flowRate} 
                      onFlowRateChange={handleFlowRateChange}
                      hideDebitLabel={true}
                    />
                  </div>
                  
                  {/* Verre */}
                  <div className="relative z-10 mt-[-120px]">
                    <GlassComponent 
                      width={glassSize} 
                      height={300}
                      fillLevel={isOverflowing ? 100 : flowRate}
                      absorptionRate={70}
                      absorptionCapacity={glassSize}
                      hideColorLegend={false}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Paramètres environnementaux */}
          <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
            <CardContent className="p-4">
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-semibold text-purple-400 mb-1">Environnement de travail</h3>
                <p className="text-sm text-gray-400">Facteurs environnementaux</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-purple-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${environmentScore}%` }}
                  />
                </div>
                <p className="text-sm text-purple-400 mt-1">
                  Score: {environmentScore}% - {getEnvironmentDescription(environmentScore)}
                </p>
              </div>
              
              <div className="space-y-6 p-6 rounded-lg bg-gray-950/50 border border-gray-800">
                <h3 className="text-lg font-semibold text-white">Facteurs environnementaux</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Première colonne */}
                  <div className="space-y-4">
                    {/* Température */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-lg font-medium text-white">Température</Label>
                        <span className="px-3 py-1.5 rounded-md bg-gray-800 text-base font-medium text-gray-100 shadow-md">{settings.temperature}°C</span>
                      </div>
                      <Slider
                        min={5}
                        max={30}
                        step={0.5}
                        value={[settings.temperature]}
                        onValueChange={([value]) => updateSetting('temperature', value)}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                      />
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
                        onValueChange={([value]) => updateSetting('lighting', value)}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
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
                      <Slider
                        min={40}
                        max={95}
                        step={1}
                        value={[settings.noise]}
                        onValueChange={([value]) => updateSetting('noise', Math.round(value))}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
                      />
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
                            onCheckedChange={(checked) => updateSetting('useProtection', checked)}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deuxième colonne */}
                  <div className="space-y-4">
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
                        onValueChange={([value]) => updateSetting('hygiene', value)}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
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
                        onValueChange={([value]) => updateSetting('space', value)}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
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
                        onValueChange={([value]) => updateSetting('equipment', value)}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-gray-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-gray-300 [&_[role=slider]]:shadow-md relative [&_.range]:bg-gray-300 [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform"
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

                  </div>
                  
                  {/* Troisième colonne */}
                  <div className="space-y-4">
                    {/* Travail de nuit */}
                    <div className="flex flex-col space-y-4">
                      <Label className="text-xl font-semibold text-white">Travail de nuit</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => updateSetting('nightShift', false)}
                          className={cn(
                            "relative px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 overflow-hidden",
                            !settings.nightShift
                              ? "bg-gray-900/80 text-yellow-100 shadow-lg shadow-orange-900/20 ring-2 ring-yellow-500/50"
                              : "bg-gray-900/80 text-gray-400 hover:bg-gray-800/90 hover:text-gray-300"
                          )}
                        >
                          <span className="relative z-10">☀️ Jour</span>
                        </button>
                        <button
                          onClick={() => updateSetting('nightShift', true)}
                          className={cn(
                            "relative px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 overflow-hidden",
                            settings.nightShift
                              ? "bg-gray-900/80 text-blue-100 shadow-lg shadow-blue-900/20 ring-2 ring-blue-500/50"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
