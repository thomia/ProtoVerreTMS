"use client"

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TypeWriter } from "@/components/ui/typewriter"
import GlassComponent from '../dashboard/glass-component'
import TapComponent from '../dashboard/tap-component'

export default function TapAndGlassInteractive() {
  // États pour les paramètres
  const [age, setAge] = useState(30)
  const [physicalActivity, setPhysicalActivity] = useState(3)
  const [nutrition, setNutrition] = useState(3)
  const [sleepDuration, setSleepDuration] = useState(7)
  const [flowRate, setFlowRate] = useState(20)
  
  // États pour suivre la progression de l'animation
  const [firstLineComplete, setFirstLineComplete] = useState(false)
  const [secondLineComplete, setSecondLineComplete] = useState(false)
  const [thirdLineComplete, setThirdLineComplete] = useState(false)

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  })

  // Calculer la capacité d'absorption et la largeur du verre
  const { absorptionCapacity, glassWidth } = useMemo(() => {
    // Facteur d'âge (diminue avec l'âge)
    const ageFactor = age <= 30 ? 20 : 
                     age <= 40 ? 15 :
                     age <= 50 ? 10 :
                     age <= 60 ? 5 : 0
    
    // Facteur d'activité physique (0-7 fois par semaine)
    const activityFactor = physicalActivity * 5 // 0-35
    
    // Facteur de nutrition (1-5 échelle)
    const nutritionFactor = nutrition * 5 // 5-25
    
    // Facteur de sommeil (10% par heure jusqu'à 7h)
    const sleepFactor = Math.min(sleepDuration, 7) * 5 // 0-35
    
    // Facteur d'antécédents médicaux (négatif)
    const medicalFactor = Object.values(medicalHistory)
      .reduce((acc, condition) => condition ? acc - 5 : acc, 0)
    
    // Calculer la capacité totale
    let capacity = ageFactor + activityFactor + nutritionFactor + sleepFactor + medicalFactor
    
    // Limiter la capacité entre 10% et 100%
    capacity = Math.max(10, Math.min(100, capacity))
    
    return {
      absorptionCapacity: Math.round(capacity),
      glassWidth: 20 + (capacity / 100) * 70
    }
  }, [age, physicalActivity, nutrition, sleepDuration, medicalHistory])

  // Gérer le changement de débit du robinet
  const handleFlowRateChange = useCallback((newRate: number) => {
    setFlowRate(newRate)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-400 text-2xl">
            Le Robinet et le Verre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
              {/* Robinet centré */}
              <div className="w-[300px] flex justify-center mb-4">
                <TapComponent 
                  flowRate={flowRate} 
                  onFlowRateChange={setFlowRate}
                  hideDebitLabel={false}
                />
              </div>

              {/* Verre */}
              <div className="relative w-32 mb-8">
                <GlassComponent 
                  width={glassWidth} 
                  height={300}
                  absorptionCapacity={absorptionCapacity}
                  hideColorLegend={false}
                />
              </div>

              {/* Curseur de débit */}
              <div className="w-full max-w-sm mb-6">
                <Label className="text-blue-400 mb-2 block text-center">Ajustez le débit</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-full accent-blue-400"
                />
                <div className="flex justify-between text-sm text-blue-400/70">
                  <span>Faible</span>
                  <span>Élevé</span>
                </div>
              </div>

              {/* Explications avec animation */}
              <div className="w-full max-w-2xl">
                <div className="p-4 bg-slate-800/50 rounded-lg space-y-4">
                  <TypeWriter 
                    text="Le robinet représente le flux des contraintes physiques qui s'appliquent sur votre corps pendant le travail."
                    className="block text-gray-300 text-lg"
                    speed={50}
                    onComplete={() => setFirstLineComplete(true)}
                  />
                  <TypeWriter 
                    text="Plus le débit est important, plus le risque de TMS augmente si la capacité d'absorption est insuffisante."
                    className="block text-gray-300 mt-4 text-lg"
                    speed={50}
                    delay={500}
                    isActive={firstLineComplete}
                    onComplete={() => setSecondLineComplete(true)}
                  />
                  <TypeWriter 
                    text="Observez comment le verre se remplit en fonction du débit du robinet !"
                    className="block text-blue-400 font-medium mt-4 text-lg"
                    speed={50}
                    delay={300}
                    isActive={secondLineComplete}
                    onComplete={() => setThirdLineComplete(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
