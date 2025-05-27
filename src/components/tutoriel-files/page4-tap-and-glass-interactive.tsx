"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TypeWriter } from "@/components/ui/typewriter"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import GlassComponent from '../dashboard/glass-component'
import TapComponent from '../dashboard/tap-component'
import { Weight, Timer, Footprints, Brain, Users, Droplets } from 'lucide-react'

// Interface pour les paramètres du robinet
interface TapSettings {
  // Paramètres physiques
  weight: number // Poids manipulé (0-100 kg)
  frequency: number // Fréquence des manipulations (0-100 par heure)
  posture: number // Score de posture (0-100)
  
  // Paramètres psychosociaux
  mentalWorkload: number // Charge mentale (0-100)
  psychosocialRisk: number // Risques psychosociaux (0-100)
}

export default function TapAndGlassInteractive() {
  // État pour le débit du robinet
  const [flowRate, setFlowRate] = useState(50)
  
  // État pour le niveau de remplissage du verre
  const [fillLevel, setFillLevel] = useState(25)
  
  // Paramètres du robinet
  const [tapSettings, setTapSettings] = useState<TapSettings>({
    weight: 30,
    frequency: 40,
    posture: 50,
    mentalWorkload: 60,
    psychosocialRisk: 45
  })
  
  // État pour afficher les détails du calcul
  const [showDetails, setShowDetails] = useState(false)
  
  // États pour suivre la progression de l'animation
  const [firstLineComplete, setFirstLineComplete] = useState(false)
  const [secondLineComplete, setSecondLineComplete] = useState(false)
  const [thirdLineComplete, setThirdLineComplete] = useState(false)

  // Capacité d'absorption du verre (fixe pour la démo)
  const absorptionCapacity = 70
  const glassWidth = 120
  
  // Calculer le débit du robinet en fonction des paramètres
  useEffect(() => {
    // Facteurs de base pour chaque paramètre
    const weightFactor = tapSettings.weight * 0.3 // 0-30
    const frequencyFactor = tapSettings.frequency * 0.2 // 0-20
    const postureFactor = tapSettings.posture * 0.2 // 0-20
    const mentalFactor = tapSettings.mentalWorkload * 0.15 // 0-15
    const psychosocialFactor = tapSettings.psychosocialRisk * 0.15 // 0-15
    
    // Calcul du débit total (0-100)
    let calculatedFlow = (
      weightFactor + 
      frequencyFactor + 
      postureFactor + 
      mentalFactor + 
      psychosocialFactor
    )
    
    // Limiter le débit entre 0 et 100
    calculatedFlow = Math.max(0, Math.min(100, calculatedFlow))
    
    // Mettre à jour le débit avec un léger délai pour l'animation
    const timer = setTimeout(() => {
      setFlowRate(Math.round(calculatedFlow))
    }, 500)
    
    return () => clearTimeout(timer)
  }, [tapSettings])
  
  // Effet pour gérer le remplissage progressif du verre en fonction du débit
  useEffect(() => {
    // Si le débit est supérieur à 0, le verre se remplit progressivement
    if (flowRate > 0) {
      const fillSpeed = flowRate / 200 // Plus le débit est élevé, plus le remplissage est rapide
      const fillInterval = setInterval(() => {
        setFillLevel(currentLevel => {
          // Calcul du nouveau niveau de remplissage
          const newLevel = currentLevel + fillSpeed
          
          // Limiter le niveau de remplissage à 100%
          return newLevel >= 100 ? 100 : newLevel
        })
      }, 100) // Mise à jour toutes les 100ms
      
      return () => clearInterval(fillInterval)
    } else if (flowRate === 0 && fillLevel > 0) {
      // Si le débit est à 0 et que le verre est rempli, on le vide progressivement
      const drainInterval = setInterval(() => {
        setFillLevel(currentLevel => {
          const newLevel = currentLevel - 0.5
          return newLevel <= 0 ? 0 : newLevel
        })
      }, 200)
      
      return () => clearInterval(drainInterval)
    }
  }, [flowRate, fillLevel])
  
  // Fonction pour mettre à jour un paramètre du robinet
  const updateTapSetting = <K extends keyof TapSettings>(key: K, value: TapSettings[K]) => {
    setTapSettings(prev => ({ ...prev, [key]: value }))
  }
  
  // Gérer le changement de débit du robinet
  const handleFlowRateChange = useCallback((newRate: number) => {
    setFlowRate(newRate)
  }, [])
  
  // Fonction pour vider complètement le verre
  const handleEmptyGlass = useCallback(() => {
    setFillLevel(0)
  }, [])
  
  // Obtenir la description du débit
  const getFlowDescription = (rate: number): string => {
    if (rate < 20) return "Faible"
    if (rate < 40) return "Modéré"
    if (rate < 60) return "Élevé"
    if (rate < 80) return "Très élevé"
    return "Extrême"
  }
  
  // Obtenir la couleur du débit
  const getFlowColor = (rate: number): string => {
    if (rate < 20) return "text-green-500"
    if (rate < 40) return "text-blue-500"
    if (rate < 60) return "text-yellow-500"
    if (rate < 80) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-400 text-2xl flex items-center gap-2">
            <Footprints className="h-6 w-6" />
            Le Robinet et le Verre
          </CardTitle>
        </CardHeader>
        
        {/* Partie supérieure: Visualisation */}
        <CardContent>
          <div className="space-y-8">
            {/* Visualisation du robinet et du verre */}
            <div className="flex flex-col items-center justify-center space-y-0 relative">
              <div className="flex justify-center w-full">
                {/* Modèle du robinet - positionné avec un décalage encore plus important vers la droite */}
                <div className="relative" style={{ width: '160px', height: '200px', marginLeft: '90px' }}>
                  <TapComponent 
                    flowRate={flowRate} 
                    onFlowRateChange={handleFlowRateChange}
                    hideDebitLabel={false}
                  />
                </div>
              </div>
              
              {/* Conteneur pour le bouton et le verre */}
              <div className="w-full relative" style={{ marginTop: '-40px', height: '300px' }}>
                {/* Bouton pour vider le verre - placé à l'extrême gauche */}
                {fillLevel > 0 && (
                  <div className="absolute left-0 top-1/3">
                    <Button 
                      onClick={handleEmptyGlass}
                      variant="outline"
                      className="bg-blue-900/80 hover:bg-blue-800 text-blue-100 border-blue-700 flex items-center gap-2 py-2 px-4 rounded-md shadow-md"
                    >
                      <Droplets className="h-5 w-5" />
                      Vider le verre
                    </Button>
                  </div>
                )}
                
                {/* Verre - maintenu au centre */}
                <div className="absolute left-1/2 transform -translate-x-1/2" style={{ width: '160px' }}>
                  <GlassComponent 
                    width={glassWidth} 
                    height={300}
                    absorptionCapacity={absorptionCapacity}
                    fillLevel={fillLevel} // Utilisation du niveau de remplissage progressif
                    absorptionRate={flowRate} // Le débit affecte la vitesse de remplissage
                    hideColorLegend={false}
                  />
                </div>
              </div>
            </div>
            
            {/* Barre de progression horizontale pour le débit */}
            <div className="space-y-2 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-400" />
                  Débit du robinet:
                </span>
                <span className={cn("text-lg font-bold", getFlowColor(flowRate))}>
                  {flowRate}%
                </span>
              </div>
              
              <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${flowRate}%`, 
                    backgroundColor: flowRate < 20 ? '#10b981' : 
                                    flowRate < 40 ? '#3b82f6' : 
                                    flowRate < 60 ? '#eab308' : 
                                    flowRate < 80 ? '#f97316' : 
                                    '#ef4444'
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Faible</span>
                <span>Modéré</span>
                <span>Élevé</span>
                <span>Critique</span>
              </div>
              
              <div className="flex justify-center mt-2">
                <span className={cn("text-sm font-medium px-3 py-1 rounded-full", getFlowColor(flowRate), "bg-slate-800/80")}>
                  {getFlowDescription(flowRate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Partie inférieure: Paramètres */}
      <Card className="bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-400 text-xl">
            Paramètres du Robinet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-300">
              Le robinet représente les contraintes physiques et mentales imposées par le travail.
              Ajustez les paramètres ci-dessous pour voir comment ils influencent le débit.
            </p>
            
            {/* Paramètres physiques */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-400">Facteurs physiques</h3>
              </div>
              
              {/* Poids manipulé */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Weight className="h-4 w-4 text-blue-400" />
                    Poids manipulé
                  </Label>
                  <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.weight} kg</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[tapSettings.weight]}
                  onValueChange={([value]) => updateTapSetting('weight', value)}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Léger</span>
                  <span>Lourd</span>
                </div>
              </div>
              
              {/* Fréquence */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-400" />
                    Fréquence des manipulations
                  </Label>
                  <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.frequency}/heure</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[tapSettings.frequency]}
                  onValueChange={([value]) => updateTapSetting('frequency', value)}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Rare</span>
                  <span>Fréquent</span>
                </div>
              </div>
              
              {/* Score de posture */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-blue-400" />
                    Score de posture
                  </Label>
                  <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.posture}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[tapSettings.posture]}
                  onValueChange={([value]) => updateTapSetting('posture', value)}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Confortable</span>
                  <span>Contraignante</span>
                </div>
              </div>
            </div>
            
            {/* Paramètres psychosociaux */}
            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-purple-400">Facteurs psychosociaux</h3>
              </div>
              
              {/* Charge mentale */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    Charge mentale
                  </Label>
                  <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.mentalWorkload}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[tapSettings.mentalWorkload]}
                  onValueChange={([value]) => updateTapSetting('mentalWorkload', value)}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-purple-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Faible</span>
                  <span>Élevée</span>
                </div>
              </div>
              
              {/* Risques psychosociaux */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    Risques psychosociaux
                  </Label>
                  <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.psychosocialRisk}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[tapSettings.psychosocialRisk]}
                  onValueChange={([value]) => updateTapSetting('psychosocialRisk', value)}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-purple-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Faibles</span>
                  <span>Élevés</span>
                </div>
              </div>
            </div>
            
            {/* Explication du calcul */}
            <div className="mt-8 p-4 bg-slate-900/80 rounded-lg border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Comment le débit est-il calculé ?</h3>
              
              <div className="space-y-3 text-sm text-slate-300">
                <p>Le débit du robinet représente les contraintes physiques et mentales imposées par le travail. Il est calculé en fonction de plusieurs facteurs :</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-start gap-2">
                    <Weight className="h-4 w-4 mt-0.5 text-rose-400" />
                    <div>
                      <p className="font-medium text-rose-400">Poids manipulé</p>
                      <p className="text-xs text-gray-400">Impact: 30% du débit total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5 text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-400">Fréquence</p>
                      <p className="text-xs text-gray-400">Impact: 20% du débit total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Footprints className="h-4 w-4 mt-0.5 text-blue-400" />
                    <div>
                      <p className="font-medium text-blue-400">Posture</p>
                      <p className="text-xs text-gray-400">Impact: 20% du débit total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 mt-0.5 text-purple-400" />
                    <div>
                      <p className="font-medium text-purple-400">Charge mentale</p>
                      <p className="text-xs text-gray-400">Impact: 15% du débit total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-emerald-400">Risques psychosociaux</p>
                      <p className="text-xs text-gray-400">Impact: 15% du débit total</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p>Le débit final est comparé à la capacité d'absorption du verre pour déterminer si le corps peut faire face aux contraintes imposées.</p>
                  <p className="mt-2 text-xs text-blue-400">
                    <TypeWriter
                      text={firstLineComplete ? 
                        "Si le débit est supérieur à la capacité d'absorption, le verre déborde, ce qui représente un risque de TMS." : 
                        "Ajustez les paramètres pour voir comment ils affectent le débit et le remplissage du verre."
                      }
                      delay={30}
                      onComplete={() => setFirstLineComplete(true)}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
