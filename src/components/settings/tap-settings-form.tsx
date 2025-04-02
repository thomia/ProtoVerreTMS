"use client"

import * as React from 'react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import BaseSettingsForm from './base-settings-form'
import { Label } from '@/components/ui/label'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { 
  CheckCircle2, 
  AlertCircle, 
  Circle, 
  Brain,
  Footprints,
  Hand,
  Heart,
  HeartPulse,
  Layers,
  Lightbulb,
  Repeat,
  Save,
  ShieldAlert,
  Skull,
  Timer,
  Users,
  Weight
} from "lucide-react"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { cn } from '@/lib/utils'

type PostureScores = {
  neck: number;
  shoulder: number;
  elbow: number;
  wrist: number;
  trunk: number;
  legs: number;
}

type PostureAdjustments = {
  neckRotation: boolean;
  neckInclination: boolean;
  shoulderRaised: boolean;
  shoulderAbduction: boolean;
  shoulderSupport: boolean;
  elbowOpposite: boolean;
  wristDeviation: boolean;
  wristPartialRotation: boolean;
  wristFullRotation: boolean;
}

type PsychosocialRisks = {
  workAutonomy: {
    taskAutonomy: number;
    temporalAutonomy: number;
    skillsUse: number;
  };
  socialRelations: {
    colleagueSupport: number;
    hierarchySupport: number;
    professionalDisagreements: number;
    workRecognition: number;
  };
  valueConflicts: {
    preventedQuality: number;
    uselessWork: number;
  };
  jobInsecurity: {
    socioeconomicInsecurity: number;
    changeManagement: number;
  };
}

const mentalWorkloadDefinitions = {
  mentalDemand: "Jusqu'à quel point les activités mentales et perceptives étaient requises pour faire la tâche (ex., réflexion, décision, calcul, mémoire, observation, recherche, etc.) ?",
  physicalDemand: "Jusqu'à quel point les activités physiques étaient requises pour faire la tâche (ex., pousser, tirer, tourner, contrôler, activer, etc.) ?",
  temporalDemand: "Jusqu'à quel point avez-vous ressenti la pression du temps due au rythme ou à la vitesse à laquelle la tâche ou les éléments de tâche arrivent ?",
  performance: "Jusqu'à quel point pensez-vous que vous réussissez à atteindre les buts de la tâche tels que définis par l'expérimentateur ou par vous-mêmes ?",
  effort: "Jusqu'à quel point avez-vous eu à travailler (mentalement ou physiquement) pour atteindre votre niveau de performance ?",
  frustration: "Jusqu'à quel point vous sentiez-vous non confiant, découragé, irrité, stressé et ennuyé vs confiant, avec plaisir, content, relaxe, satisfait de vous durant la tâche ?"
}

const psychosocialDefinitions = {
  workAutonomy: {
    title: "Faible autonomie au travail",
    taskAutonomy: "Les salariés ont-ils des marges de manœuvre dans la manière de réaliser leur travail dès lors que les objectifs sont atteints ?",
    temporalAutonomy: "Les salariés peuvent-ils interrompre momentanément leur travail quand ils en ressentent le besoin ?",
    skillsUse: "Les salariés peuvent-ils utiliser leurs compétences professionnelles et en développer de nouvelles ?"
  },
  socialRelations: {
    title: "Rapports sociaux au travail dégradés",
    colleagueSupport: "Existe-t-il des possibilités d'entraide entre les salariés, par exemple en cas de surcharge de travail ou de travail délicat ou compliqué ?",
    hierarchySupport: "Les salariés reçoivent-ils un soutien de la part de l'encadrement ?",
    professionalDisagreements: "Existe-t-il entre les salariés des causes de désaccord ayant pour origine l'organisation du travail (flou sur le rôle de chacun, inégalité de traitement, etc.) ?",
    workRecognition: "Les salariés reçoivent-ils des marques de reconnaissance de leur travail de la part de l'entreprise ?"
  },
  valueConflicts: {
    title: "Conflits de valeurs",
    preventedQuality: "Les salariés considèrent-ils qu'ils font un travail de qualité ?",
    uselessWork: "Les salariés estiment-ils en général que leur travail est reconnu comme utile ?"
  },
  jobInsecurity: {
    title: "Insécurité de l'emploi et du travail",
    socioeconomicInsecurity: "Les salariés sont-ils confrontés à des incertitudes quant au maintien de leur activité dans les prochains mois ?",
    changeManagement: "Les changements sont-ils suffisamment anticipés, accompagnés, et clairement expliqués aux salariés ?"
  }
}

const physicalDefinitions = {
  weight: "Poids total manipulé en kg. Inclut le poids de l'objet et des contenants.",
  frequency: "Nombre de manipulations par heure de travail.",
  posture: "Position du corps lors de la manipulation : 0° = neutre, 90° = flexion maximale"
}

const maxScores = {
  neck: 6,      // 4 + 1 + 1 (base + rotation + inclinaison)
  shoulder: 6,  // 4 + 1 + 1 - 1 (base + levée + abduction - appui)
  elbow: 3,     // 2 + 1 (base + opposé)
  wrist: 6,     // 3 + 1 + 1 + 2 (base + déviation + rotation partielle + rotation complète)
  trunk: 6,     // 4 (base)
  legs: 2       // 2 (base)
}

const psychosocialOptions = [
  { value: 0, label: "Jamais/Non" },
  { value: 1, label: "Parfois/Plutôt non" },
  { value: 2, label: "Souvent/Plutôt oui" },
  { value: 3, label: "Toujours/Oui" }
]

const psychosocialColors = {
  workAutonomy: {
    border: 'border-emerald-600/30',
    bg: 'bg-emerald-950/10',
    text: 'text-emerald-300/80',
    active: 'bg-gradient-to-r from-emerald-800/40 to-emerald-700/40',
    hover: 'hover:bg-emerald-900/15',
    gradient: 'from-emerald-950/20 via-emerald-900/15 to-emerald-950/20'
  },
  socialRelations: {
    border: 'border-[#FFE082]/30',
    bg: 'bg-[#FFE082]/5',
    text: 'text-[#FFE082]/90',
    active: 'bg-gradient-to-r from-[#FFD54F]/40 to-[#FFECB3]/40',
    hover: 'hover:bg-[#FFE082]/10',
    gradient: 'from-[#FFE082]/10 via-[#FFE082]/5 to-[#FFE082]/10'
  },
  valueConflicts: {
    border: 'border-blue-600/30',
    bg: 'bg-blue-950/10',
    text: 'text-blue-300/80',
    active: 'bg-gradient-to-r from-blue-800/40 to-blue-700/40',
    hover: 'hover:bg-blue-900/15',
    gradient: 'from-blue-950/20 via-blue-900/15 to-blue-950/20'
  },
  jobInsecurity: {
    border: 'border-stone-600/30',
    bg: 'bg-stone-950/10',
    text: 'text-stone-300/80',
    active: 'bg-gradient-to-r from-stone-800/40 to-stone-700/40',
    hover: 'hover:bg-stone-900/15',
    gradient: 'from-stone-950/20 via-stone-900/15 to-stone-950/20'
  }
}

const physicalSliderColors = {
  weight: {
    from: 'from-rose-600',
    to: 'to-rose-400',
    border: 'border-rose-500',
    text: 'text-rose-400',
    active: 'bg-rose-500',
    activeLight: 'bg-rose-500/30',
    inactive: 'bg-gray-600',
    bg: 'bg-rose-900/10'
  },
  loadFrequency: {
    from: 'from-blue-500',
    to: 'to-blue-400',
    border: 'border-blue-500',
    text: 'text-blue-400',
    active: 'bg-blue-500',
    activeLight: 'bg-blue-500/30',
    inactive: 'bg-gray-600',
    bg: 'bg-blue-900/20'
  },
  postureFrequency: {
    from: 'from-blue-500',
    to: 'to-blue-400',
    border: 'border-blue-500',
    text: 'text-blue-400',
    active: 'bg-blue-500',
    activeLight: 'bg-blue-500/30',
    inactive: 'bg-gray-600',
    bg: 'bg-blue-900/20'
  }
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon className="inline-block ml-2 h-4 w-4 text-gray-400 hover:text-gray-300 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getScoreColorByBase(score: number, maxScore: number, baseColor: string) {
  const percentage = score / maxScore
  
  switch(baseColor) {
    case 'red': 
      return percentage <= 0.33 ? 'text-rose-300' :
             percentage <= 0.66 ? 'text-rose-400' :
             'text-rose-500'
    case 'blue': 
      return percentage <= 0.33 ? 'text-sky-300' :
             percentage <= 0.66 ? 'text-sky-400' :
             'text-sky-500'
    case 'green': 
      return percentage <= 0.33 ? 'text-emerald-300' :
             percentage <= 0.66 ? 'text-emerald-400' :
             'text-emerald-500'
    case 'purple': 
      return percentage <= 0.33 ? 'text-violet-300' :
             percentage <= 0.66 ? 'text-violet-400' :
             'text-violet-500'
    case 'yellow': 
      return percentage <= 0.33 ? 'text-amber-300' :
             percentage <= 0.66 ? 'text-amber-400' :
             'text-amber-500'
    case 'orange': 
      return percentage <= 0.33 ? 'text-orange-300' :
             percentage <= 0.66 ? 'text-orange-400' :
             'text-orange-500'
    default:
      return 'text-white'
  }
}

type SecondaryMarkProps = {
  mark: number;
  value: number;
  activeClass: string;
}

function SecondaryMark({ mark, value, activeClass }: SecondaryMarkProps) {
  const isActive = value >= mark;
  return (
    <div className="flex flex-col items-center">
      <div className={`h-1 w-0.5 ${isActive ? activeClass : 'bg-gray-600/30'}`} />
    </div>
  );
}

function getMentalWorkloadLabel(key: string): string {
  const labels: Record<string, string> = {
    mentalDemand: "•	Exigence mentale de la tâche",
    physicalDemand: "•	Exigences physiques ",
    temporalDemand: "•	Exigence temporelle",
    performance: "•	Performance ",
    effort: "•	Effort ",
    frustration: "•	Frustration ",
  }
  return labels[key] || key
}

function getPsychosocialRiskLabel(key: string): string {
  const labels: Record<string, string> = {
    autonomyTask: "•	Autonomie décisionnelle",
    autonomyTime: "•	Autonomie temporelle",
    skillDevelopment: "•	Développement des compétences",
    colleagueSupport: "•	Soutien des collègues",
    managerSupport: "•	Soutien hiérarchique",
    professionalDisagreements: "•	Désaccords professionnels",
    workRecognition: "•	Reconnaissance du travail",
    qualityPrevented: "•	  Qualité empêchée",
    uselessWork: "•	Travail inutile",
    socioeconomicInsecurity: "•	Insécurité socio-économique",
    changeManagement: "•	Gestion du changement",
  }
  return labels[key] || key
}

function getPsychosocialRiskDescription(key: string): string {
  const descriptions: Record<string, string> = {
    // Faible autonomie au travail
    taskAutonomy: "Les salariés ont-ils des marges de manœuvre dans la manière de réaliser leur travail dès lors que les objectifs sont atteints ?",
    temporalAutonomy: "Les salariés peuvent-ils interrompre momentanément leur travail quand ils en ressentent le besoin ?",
    skillsUse: "Les salariés peuvent-ils utiliser leurs compétences professionnelles et en développer de nouvelles ?",
    
    // Rapports sociaux au travail dégradés
    colleagueSupport: "Existe-t-il des possibilités d'entraide entre les salariés, par exemple en cas de surcharge de travail ou de travail délicat ou compliqué ?",
    hierarchySupport: "Les salariés reçoivent-ils un soutien de la part de l'encadrement ?",
    professionalDisagreements: "Existe-t-il entre les salariés des causes de désaccord ayant pour origine l'organisation du travail (flou sur le rôle de chacun, inégalité de traitement, etc.) ?",
    workRecognition: "Les salariés reçoivent-ils des marques de reconnaissance de leur travail de la part de l'entreprise ?",
    
    // Conflits de valeurs
    preventedQuality: "Les salariés considèrent-ils qu'ils font un travail de qualité ?",
    uselessWork: "Les salariés estiment-ils en général que leur travail est reconnu comme utile ?",
    
    // Insécurité de l'emploi et du travail
    socioeconomicInsecurity: "Les salariés sont-ils confrontés à des incertitudes quant au maintien de leur activité dans les prochains mois ?",
    changeManagement: "Les changements sont-ils suffisamment anticipés, accompagnés, et clairement expliqués aux salariés ?",
  }
  
  return descriptions[key] || ""
}

function getMentalWorkloadDescription(key: string): string {
  const descriptions: Record<string, string> = {
    mentalDemand: "Jusqu'à quel point les activités mentales et perceptives étaient requises pour faire la tâche (ex., réflexion, décision, calcul, mémoire, observation, recherche, etc.) ?",
    physicalDemand: "Jusqu'à quel point les activités physiques étaient requises pour faire la tâche (ex., pousser, tirer, tourner, contrôler, activer, etc.) ?",
    temporalDemand: "Jusqu'à quel point avez-vous ressenti la pression du temps due au rythme ou à la vitesse à laquelle la tâche ou les éléments de tâche arrivent ?",
    performance: "Jusqu'à quel point pensez-vous que vous réussissez à atteindre les buts de la tâche tels que définis par votre employeur ou par vous-mêmes ?",
    effort: "Jusqu'à quel point avez-vous eu à travailler (mentalement ou physiquement) pour atteindre votre niveau de performance ?",
    frustration: "Jusqu'à quel point vous sentiez-vous non confiant, découragé, irrité, stressé et ennuyé vs confiant, avec plaisir, content, relaxe, satisfait de vous durant la tâche ?"
  }
  
  return descriptions[key] || ""
}

function getScoreColor(score: number, max: number): string {
  return "text-blue-400"
}

function getScoreBgColor(score: number, max: number): string {
  const percentage = score / max
  if (percentage < 0.25) return "bg-cyan-950/30"
  if (percentage < 0.5) return "bg-teal-950/30"
  if (percentage < 0.75) return "bg-amber-950/30"
  return "bg-rose-950/30"
}

function getScoreBorderColor(score: number, max: number): string {
  const percentage = score / max
  if (percentage < 0.25) return "border-cyan-900"
  if (percentage < 0.5) return "border-teal-900"
  if (percentage < 0.75) return "border-amber-900"
  return "border-rose-900"
}

// Fonction pour calculer les scores intermédiaires
const getIntermediateScore = (score: number, maxScore: number) => {
  return Math.round((score / maxScore) * 20);
};

export default function TapSettingsForm() {
  const [load, setLoad] = useState(20)
  const [frequency, setFrequency] = useState(10)
  const [postureFrequency, setPostureFrequency] = useState(5)
  const [isSaved, setIsSaved] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("charge")
  
  const [psychosocialRisks, setPsychosocialRisks] = useState({
    // Faible autonomie au travail
    taskAutonomy: 0, // Autonomie dans la tâche
    temporalAutonomy: 0, // Autonomie temporelle
    skillsUse: 0, // Utilisation et développement des compétences
    
    // Rapports sociaux au travail dégradés
    colleagueSupport: 0, // Soutien de la part des collègues
    hierarchySupport: 0, // Soutien de la part des supérieurs hiérarchiques
    professionalDisagreements: 0, // Désaccords professionnels
    workRecognition: 0, // Reconnaissance dans le travail
    
    // Conflits de valeurs
    preventedQuality: 0, // Qualité empêchée
    uselessWork: 0, // Travail inutile
    
    // Insécurité de l'emploi et du travail
    socioeconomicInsecurity: 0, // Insécurité socio-économique
    changeManagement: 0, // Conduite du changement dans l'entreprise
  })
  
  const [mentalWorkload, setMentalWorkload] = useState({
    mentalDemand: 10, // Exigence mentale de la tâche
    physicalDemand: 10, // Exigences physiques
    temporalDemand: 10, // Exigence temporelle
    performance: 10, // Performance
    effort: 10, // Effort
    frustration: 10 // Frustration
  })
  
  // États pour suivre si chaque section a été enregistrée
  const [savedSections, setSavedSections] = useState({
    charge: false,
    posture: false,
    frequency: false,
    mental: false,
    psychosocial: false
  })
  
  const [neckPosition, setNeckPosition] = useState("0-10")
  const [neckRotation, setNeckRotation] = useState(false)
  const [neckInclination, setNeckInclination] = useState(false)

  const [shoulderPosition, setShoulderPosition] = useState("-20-20")
  const [shoulderRaised, setShoulderRaised] = useState(false)
  const [armAbduction, setArmAbduction] = useState(false)
  const [armSupported, setArmSupported] = useState(false)

  const [elbowPosition, setElbowPosition] = useState("0-60")
  const [forearmCrossing, setForearmCrossing] = useState(false)

  const [wristPosition, setWristPosition] = useState("0")
  const [wristDeviation, setWristDeviation] = useState(false)
  const [wristPronationPartial, setWristPronationPartial] = useState(false)
  const [wristPronationComplete, setWristPronationComplete] = useState(false)

  const [trunkPosition, setTrunkPosition] = useState("0")
  const [trunkRotation, setTrunkRotation] = useState(false)
  const [trunkLateralBending, setTrunkLateralBending] = useState(false)

  const [legsPosition, setLegsPosition] = useState("balanced")
  const [legsKneeling, setLegsKneeling] = useState(false)
  const [legsWalking, setLegsWalking] = useState(false)

  const [neckScore, setNeckScore] = useState(1)
  const [shoulderScore, setShoulderScore] = useState(1)
  const [elbowScore, setElbowScore] = useState(1)
  const [wristScore, setWristScore] = useState(1)
  const [trunkScore, setTrunkScore] = useState(1)
  const [legsScore, setLegsScore] = useState(1)
  const [mentalScore, setMentalScore] = useState(0)
  const [psychosocialScore, setPsychosocialScore] = useState(0)
  const [globalScore, setGlobalScore] = useState(0)

  // État pour le feedback visuel d'enregistrement
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const calculateScores = useCallback(() => {
    // Normalisation de chaque sous-thème sur 20 points
    const normalizedLoad = (load / 55) * 20;
    const normalizedPosture = ((neckScore + shoulderScore + elbowScore + wristScore + trunkScore + legsScore) / 31) * 20;
    const normalizedFrequency = (frequency / 120) * 20;
    const normalizedMental = (Object.values(mentalWorkload).reduce((acc, val) => acc + val, 0) / 120) * 20;
    
    // Calcul du score psychosocial (1 à 4 points par question)
    const psychosocialTotal = Object.values(psychosocialRisks).reduce((acc, val) => acc + val, 0);
    const normalizedPsychosocial = (psychosocialTotal / 44) * 20;

    // Score final sur 100 points
    const finalScore = Math.round(
      normalizedLoad + 
      normalizedPosture + 
      normalizedFrequency + 
      normalizedMental + 
      normalizedPsychosocial
    );

    setGlobalScore(finalScore);
  }, [load, neckScore, shoulderScore, elbowScore, wristScore, trunkScore, legsScore, frequency, mentalWorkload, psychosocialRisks]);

  useEffect(() => {
    let score = 0

    // Correction des valeurs pour correspondre exactement aux valeurs des boutons radio
    if (neckPosition === "0-10") score += 1
    else if (neckPosition === "10-20") score += 2
    else if (neckPosition === "20+") score += 3
    else if (neckPosition === "extension") score += 4

    if (neckRotation) score += 1
    if (neckInclination) score += 1

    setNeckScore(Math.min(score, 6))
  }, [neckPosition, neckRotation, neckInclination])

  useEffect(() => {
    let score = 0

    if (shoulderPosition === "-20-20") score += 1
    else if (shoulderPosition === "20-45") score += 2
    else if (shoulderPosition === "45-90") score += 3
    else if (shoulderPosition === "90+") score += 4

    if (shoulderRaised) score += 1
    if (armAbduction) score += 1
    if (armSupported) score -= 1

    setShoulderScore(Math.min(Math.max(score, 0), 6))
  }, [shoulderPosition, shoulderRaised, armAbduction, armSupported])

  useEffect(() => {
    let score = 0

    if (elbowPosition === "0-60") score += 1
    else if (elbowPosition === "60-100") score += 2
    else if (elbowPosition === "100+") score += 2

    if (forearmCrossing) score += 1

    setElbowScore(Math.min(score, 3))
  }, [elbowPosition, forearmCrossing])

  useEffect(() => {
    let score = 0

    if (wristPosition === "0") score += 1
    else if (wristPosition === "-15-15") score += 2
    else if (wristPosition === "15+" || wristPosition === "-15-") score += 3

    if (wristDeviation) score += 1
    if (wristPronationPartial) score += 1
    if (wristPronationComplete) score += 2

    setWristScore(Math.min(score, 6))
  }, [wristPosition, wristDeviation, wristPronationPartial, wristPronationComplete])

  useEffect(() => {
    let score = 0

    if (trunkPosition === "0") score = 1
    else if (trunkPosition === "0-20") score = 2
    else if (trunkPosition === "20-60") score = 3
    else if (trunkPosition === "60+") score = 4

    if (trunkRotation) score += 1
    if (trunkLateralBending) score += 1

    setTrunkScore(Math.min(score, 6))
  }, [trunkPosition, trunkRotation, trunkLateralBending])

  useEffect(() => {
    let score = 0

    if (legsPosition === "balanced") score += 1
    else if (legsPosition === "unbalanced") score += 2

    if (legsKneeling) score += 1
    if (legsWalking) score += 1

    setLegsScore(score)
  }, [legsPosition, legsKneeling, legsWalking])

  useEffect(() => {
    const score = (mentalWorkload.mentalDemand + mentalWorkload.physicalDemand + mentalWorkload.temporalDemand + 
                  mentalWorkload.performance + mentalWorkload.effort + mentalWorkload.frustration) / 6
    setMentalScore(score)
  }, [mentalWorkload])

  useEffect(() => {
    let score = 0

    Object.values(psychosocialRisks).forEach((value) => {
      score += value
    })

    setPsychosocialScore((score / 110) * 10)
  }, [psychosocialRisks])

  useEffect(() => {
    calculateScores();
  }, [calculateScores]);

  useEffect(() => {
    const total = Object.values(mentalWorkload).reduce((acc, val) => acc + val, 0);
    setMentalScore(Math.round((total / 120) * 20));
  }, [mentalWorkload]);

  useEffect(() => {
    const total = Object.values(psychosocialRisks).reduce((acc, val) => acc + val, 0);
    setPsychosocialScore(Math.round((total / 44) * 20));
  }, [psychosocialRisks]);

  const handlePsychosocialChange = (key: string, value: number) => {
    setPsychosocialRisks((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const getGlobalScoreText = (score: number) => {
    if (score < 25) return "Risque global faible"
    if (score < 50) return "Risque global modéré"
    if (score < 75) return "Risque global élevé"
    return "Risque global très élevé - Intervention recommandée"
  }

  const handleSave = () => {
    setIsSaved(true)
    
    // Afficher le feedback visuel
    setSaveFeedback(activeTab);
    setTimeout(() => {
      setSaveFeedback(null);
    }, 2000)
    
    // Marquer la section active comme enregistrée
    setSavedSections(prev => ({
      ...prev,
      [activeTab]: true
    }))
    
    const settings = {
      load,
      frequency,
      postureFrequency,
      neckPosition,
      neckRotation,
      neckInclination,
      shoulderPosition,
      shoulderRaised,
      armAbduction,
      armSupported,
      elbowPosition,
      forearmCrossing,
      wristPosition,
      wristDeviation,
      wristPronationPartial,
      wristPronationComplete,
      trunkPosition,
      trunkRotation,
      trunkLateralBending,
      legsPosition,
      legsKneeling,
      legsWalking,
      mentalWorkload,
      psychosocialRisks,
      globalScore
    }
    
    setLocalStorage('tapSettings', JSON.stringify(settings))
    setLocalStorage('flowRate', Math.round(globalScore).toString())
    
    emitStorageEvent()
  }

  return (
    <div className="bg-black text-white">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-3 text-[#3b82f6]">Paramètres du Robinet</h1>
          <p className="text-[#3b82f6]/90 mb-4">Le travail, avec l'ensemble de ses composantes, constitue le facteur clé dans l'analyse du risque de troubles musculo-squelettiques (TMS) et de probabilité d'accident de travail. Quels sont les déterminants physiques, psychologiques et organisationnels impliqués ? Examinez chaque aspect pour évaluer le niveau de contrainte : la charge manipulée (poids, fréquence), les postures adoptées, ainsi que l'état émotionnel (charge mentale, facteurs psychosociaux).</p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
            <div className="text-[#3b82f6] font-medium">Score calculé</div>
            <div className="text-xl font-bold text-[#3b82f6]">{globalScore.toFixed(0)}%</div>
          </div>
          
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute h-full left-0 top-0 rounded-full transition-all duration-300 bg-[#3b82f6]"
              style={{ width: `${globalScore}%` }}
            />
          </div>
          
          <p className="text-sm text-[#3b82f6]/90 mt-1">
            {getGlobalScoreText(globalScore)}
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <TabsTrigger
              value="charge"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400 transition-all duration-200 text-white"
            >
              <div className="flex items-center">
                <Weight className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-[#3b82f6]">Charge manipulée</span>
                <span className="sm:hidden text-[#3b82f6]">Charge</span>
                {savedSections.charge && <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="posture"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400 transition-all duration-200 text-white"
            >
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-[#3b82f6]">Positions de travail</span>
                <span className="sm:hidden text-[#3b82f6]">Posture</span>
                {savedSections.posture && <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="frequency"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400 transition-all duration-200 text-white"
            >
              <div className="flex items-center">
                <Repeat className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-[#3b82f6]">Fréquence</span>
                <span className="sm:hidden text-[#3b82f6]">Fréq.</span>
                {savedSections.frequency && <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="mental"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400 transition-all duration-200 text-white"
            >
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-[#3b82f6]">Charge Mentale</span>
                <span className="sm:hidden text-[#3b82f6]">Mental</span>
                {savedSections.mental && <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="psychosocial"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-cyan-400 transition-all duration-200 text-white"
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-[#3b82f6]">Risques Psychosociaux</span>
                <span className="sm:hidden text-[#3b82f6]">RPS</span>
                {savedSections.psychosocial && <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charge">
            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium mb-4">
                      <div className="flex items-center">
                        <Weight className="h-5 w-5 mr-2 text-cyan-400" />
                        <span className="text-[#3b82f6]">Charge manipulée</span>
                      </div>
                    </h3>
                    <div className="flex items-center">
                      <div className="w-24 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">{getIntermediateScore(load, 55)}/20</span>
                      </div>
                      {savedSections.charge && (
                        <div className="flex items-center text-green-500 text-sm ml-4">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Section enregistrée</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Évaluez la charge manipulée en utilisant le curseur ci-dessous. La charge est notée de 0 à 55 kg.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="chargeWeight" className="text-white">
                        Poids de la charge manipulée
                      </Label>
                      <span className="text-white">{load} kg</span>
                    </div>
                    <Slider
                      id="chargeWeight"
                      value={[load]}
                      onValueChange={(value) => setLoad(value[0])}
                      min={0}
                      max={55}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>0 kg</span>
                      <span>55 kg</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg mt-6 ${getScoreBgColor(load, 55)} border ${getScoreBorderColor(load, 55)}`}
                  >
                    <div className="flex items-center gap-2">
                      <Weight className={`h-5 w-5 ${getScoreColor(load, 55)}`} />
                      <span className="font-medium text-white">Évaluation de la charge</span>
                    </div>
                    <p className="mt-2 text-sm text-white">
                      {load < 15
                        ? "Charge légère - Risque faible"
                        : load < 30
                          ? "Charge modérée - Risque modéré"
                          : load < 45
                            ? "Charge lourde - Risque élevé"
                            : "Charge très lourde - Risque très élevé"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-4">
                  {saveFeedback === 'charge' && (
                    <span className="flex items-center text-sm text-[#3b82f6]">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Paramètres sauvegardés
                    </span>
                  )}
                  <Button 
                    onClick={handleSave} 
                    variant="outline"
                    className="!bg-[#3b82f6] hover:!bg-[#60a5fa] !text-white !border-[#3b82f6]/50 transition-all duration-200 shadow-lg font-medium text-sm rounded-md px-4 py-2"
                  >
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posture">
            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium mb-4">
                      <div className="flex items-center">
                        <Layers className="h-5 w-5 mr-2 text-cyan-400" />
                        <span className="text-[#3b82f6]">Position de travail</span>
                      </div>
                    </h3>
                    <div className="flex items-center">
                      <div className="w-24 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">{getIntermediateScore(
                          neckScore + shoulderScore + elbowScore + wristScore + trunkScore + legsScore,
                          30
                        )}/20</span>
                      </div>
                      {savedSections.posture && (
                        <div className="flex items-center text-green-500 text-sm ml-4">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Section enregistrée</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Évaluez les positions de travail et les ajustements posturaux pour chaque partie du corps.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <Skull className="h-5 w-5 mr-2 text-cyan-400" />
                      <span className="text-white font-bold text-[#3b82f6]">Cou</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(neckScore, 6)} border ${getScoreBorderColor(neckScore, 6)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(neckScore, 6)}>{neckScore}</span><span className="text-white">/6</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={neckPosition} onValueChange={setNeckPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="0-10" id="neck-0-10" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="neck-0-10" className="cursor-pointer w-full text-white">
                          0 à 10 degrés (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="10-20" id="neck-10-20" className="border-teal-500 text-teal-500" />
                        <Label htmlFor="neck-10-20" className="cursor-pointer w-full text-white">
                          10 à 20 degrés (+2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="20+" id="neck-20+" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="neck-20+" className="cursor-pointer w-full text-white">
                          20 degrés ou plus (+3)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem
                          value="extension"
                          id="neck-extension"
                          className="border-rose-500 text-rose-500"
                        />
                        <Label htmlFor="neck-extension" className="cursor-pointer w-full text-white">
                          Extension (+4)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="neck-rotation"
                          checked={neckRotation}
                          onCheckedChange={(checked) => setNeckRotation(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="neck-rotation" className="cursor-pointer w-full text-white">
                          Le cou est en rotation (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="neck-inclination"
                          checked={neckInclination}
                          onCheckedChange={(checked) => setNeckInclination(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="neck-inclination" className="cursor-pointer w-full text-white">
                          Le cou est en inclinaison (+1)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="relative h-5 w-5 mr-2 text-cyan-400">
                        <div className="absolute top-0 left-1/2 w-1 h-3 bg-current rounded-full transform -translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-3 h-1 bg-current rounded-full transform -translate-x-1/2"></div>
                      </div>
                      <span className="text-white font-bold text-[#3b82f6]">Épaule</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(shoulderScore, 6)} border ${getScoreBorderColor(shoulderScore, 6)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(shoulderScore, 6)}>{shoulderScore}</span><span className="text-white">/6</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={shoulderPosition} onValueChange={setShoulderPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="-20-20" id="shoulder--20-20" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="shoulder--20-20" className="cursor-pointer w-full text-white">
                          -20 à 20 degrés (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="20-45" id="shoulder-20-45" className="border-teal-500 text-teal-500" />
                        <Label htmlFor="shoulder-20-45" className="cursor-pointer w-full text-white">
                          20 à 45 degrés (+2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="45-90" id="shoulder-45-90" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="shoulder-45-90" className="cursor-pointer w-full text-white">
                          45 à 90 degrés (+3)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="90+" id="shoulder-90+" className="border-rose-500 text-rose-500" />
                        <Label htmlFor="shoulder-90+" className="cursor-pointer w-full text-white">
                          90 degrés ou plus (+4)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="shoulder-raised"
                          checked={shoulderRaised}
                          onCheckedChange={(checked) => setShoulderRaised(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="shoulder-raised" className="cursor-pointer w-full text-white">
                          L'épaule est levée (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="arm-abduction"
                          checked={armAbduction}
                          onCheckedChange={(checked) => setArmAbduction(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="arm-abduction" className="cursor-pointer w-full text-white">
                          Le bras est en abduction (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="arm-supported"
                          checked={armSupported}
                          onCheckedChange={(checked) => setArmSupported(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="arm-supported" className="cursor-pointer w-full text-white">
                          Le bras est en appui sur un support (-1)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="relative h-5 w-5 mr-2 text-cyan-400">
                        <div className="absolute top-1 left-1 w-1 h-4 bg-current rounded-full"></div>
                        <div className="absolute top-2 left-1/2 w-3 h-1 bg-current rounded-full transform rotate-45 -translate-x-1/4"></div>
                      </div>
                      <span className="text-white font-bold text-[#3b82f6]">Coude</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(elbowScore, 3)} border ${getScoreBorderColor(elbowScore, 3)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(elbowScore, 3)}>{elbowScore}</span><span className="text-white">/3</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={elbowPosition} onValueChange={setElbowPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="0-60" id="elbow-0-60" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="elbow-0-60" className="cursor-pointer w-full text-white">
                          0 à 60 degrés (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="60-100" id="elbow-60-100" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="elbow-60-100" className="cursor-pointer w-full text-white">
                          60 à 100 degrés (+2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="100+" id="elbow-100+" className="border-rose-500 text-rose-500" />
                        <Label htmlFor="elbow-100+" className="cursor-pointer w-full text-white">
                          Plus de 100 degrés (+2)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="forearm-crossing"
                          checked={forearmCrossing}
                          onCheckedChange={(checked) => setForearmCrossing(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="forearm-crossing" className="cursor-pointer w-full text-white">
                          L'avant-bras travaille en croisant la ligne médiane du corps (+1)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="relative h-5 w-5 mr-2 text-cyan-400">
                        <div className="absolute top-2 left-0 w-5 h-1 bg-current rounded-full"></div>
                        <div className="absolute top-0 right-0 w-1 h-3 bg-current rounded-full"></div>
                      </div>
                      <span className="text-white font-bold text-[#3b82f6]">Poignet</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(wristScore, 6)} border ${getScoreBorderColor(wristScore, 6)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(wristScore, 6)}>{wristScore}</span><span className="text-white">/6</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={wristPosition} onValueChange={setWristPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="0" id="wrist-0" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="wrist-0" className="cursor-pointer w-full text-white">
                          0 degré (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="-15-15" id="wrist-15" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="wrist-15" className="cursor-pointer w-full text-white">
                          -15 à 15 degrés (+2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="15+" id="wrist-15+" className="border-rose-500 text-rose-500" />
                        <Label htmlFor="wrist-15+" className="cursor-pointer w-full text-white">
                          15 degrés ou plus (+3)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="-15-" id="wrist-15-" className="border-rose-500 text-rose-500" />
                        <Label htmlFor="wrist-15-" className="cursor-pointer w-full text-white">
                          -15 degrés ou moins (+3)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="wrist-deviation"
                          checked={wristDeviation}
                          onCheckedChange={(checked) => setWristDeviation(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="wrist-deviation" className="cursor-pointer w-full text-white">
                          Le poignet est en adduction ou abduction (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="wrist-pronation-partial"
                          checked={wristPronationPartial}
                          onCheckedChange={(checked) => setWristPronationPartial(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="wrist-pronation-partial" className="cursor-pointer w-full text-white">
                          Le poignet est en pronation/supination partielle (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="wrist-pronation-complete"
                          checked={wristPronationComplete}
                          onCheckedChange={(checked) => setWristPronationComplete(checked === true)}
                          className="border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="wrist-pronation-complete" className="cursor-pointer w-full text-white">
                          Le poignet est en pronation/supination complète (+2)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="relative h-5 w-5 mr-2 text-cyan-400">
                        <div className="absolute top-0 left-1 w-1 h-5 bg-current rounded-full"></div>
                        <div className="absolute top-0 right-1 w-1 h-5 bg-current rounded-full"></div>
                      </div>
                      <span className="text-white font-bold text-[#3b82f6]">Tronc</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(trunkScore, 6)} border ${getScoreBorderColor(trunkScore, 6)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(trunkScore, 6)}>{trunkScore}</span><span className="text-white">/6</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={trunkPosition} onValueChange={setTrunkPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="0" id="trunk-0" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="trunk-0" className="cursor-pointer w-full text-white">
                          0 degré (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="0-20" id="trunk-0-20" className="border-teal-500 text-teal-500" />
                        <Label htmlFor="trunk-0-20" className="cursor-pointer w-full text-white">
                          0 à 20 degrés (+2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="20-60" id="trunk-20-60" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="trunk-20-60" className="cursor-pointer w-full text-white">
                          20 à 60 degrés (+3)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="60+" id="trunk-60+" className="border-rose-500 text-rose-500" />
                        <Label htmlFor="trunk-60+" className="cursor-pointer w-full text-white">
                          60 degrés ou plus (+4)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="trunk-rotation"
                          checked={trunkRotation}
                          onCheckedChange={(checked) => setTrunkRotation(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="trunk-rotation" className="cursor-pointer w-full text-white">
                          Le tronc est en rotation (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="trunk-lateral-bending"
                          checked={trunkLateralBending}
                          onCheckedChange={(checked) => setTrunkLateralBending(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="trunk-lateral-bending" className="cursor-pointer w-full text-white">
                          Le tronc est en flexion latéral (+1)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="relative h-5 w-5 mr-2 text-cyan-400">
                        <div className="absolute top-0 left-1 w-1 h-5 bg-current rounded-full"></div>
                        <div className="absolute top-0 right-1 w-1 h-5 bg-current rounded-full"></div>
                      </div>
                      <span className="text-white font-bold text-[#3b82f6]">Jambes</span>
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getScoreBgColor(legsScore, 4)} border ${getScoreBorderColor(legsScore, 4)}`}
                    >
                      <span className="text-white">Score:</span> <span className={getScoreColor(legsScore, 4)}>{legsScore}</span><span className="text-white">/4</span>
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <RadioGroup value={legsPosition} onValueChange={setLegsPosition} className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="balanced" id="legs-balanced" className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor="legs-balanced" className="cursor-pointer w-full text-white">
                          Posture équilibrée, poids réparti uniformément (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <RadioGroupItem value="unbalanced" id="legs-unbalanced" className="border-amber-500 text-amber-500" />
                        <Label htmlFor="legs-unbalanced" className="cursor-pointer w-full text-white">
                          Posture déséquilibrée, poids non réparti uniformément (+2)
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Label className="text-sm text-gray-300">Ajustements</Label>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="legs-kneeling"
                          checked={legsKneeling}
                          onCheckedChange={(checked) => setLegsKneeling(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="legs-kneeling" className="cursor-pointer w-full text-white">
                          Position à genoux ou accroupie (+1)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="legs-walking"
                          checked={legsWalking}
                          onCheckedChange={(checked) => setLegsWalking(checked === true)}
                          className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-gray-900"
                        />
                        <Label htmlFor="legs-walking" className="cursor-pointer w-full text-white">
                          Position debout avec marche fréquente (+1)
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end items-center gap-4">
              {saveFeedback === 'posture' && (
                <span className="flex items-center text-sm text-[#3b82f6]">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Paramètres sauvegardés
                </span>
              )}
              <Button 
                onClick={handleSave} 
                variant="outline"
                className="!bg-[#3b82f6] hover:!bg-[#60a5fa] !text-white !border-[#3b82f6]/50 transition-all duration-200 shadow-lg font-medium text-sm rounded-md px-4 py-2"
              >
                Sauvegarder
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="frequency">
            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium mb-4">
                      <div className="flex items-center">
                        <Repeat className="h-5 w-5 mr-2 text-cyan-400" />
                        <span className="text-[#3b82f6]">Fréquence</span>
                      </div>
                    </h3>
                    <div className="flex items-center">
                      <div className="w-24 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">{getIntermediateScore(frequency, 120)}/20</span>
                      </div>
                      {savedSections.frequency && (
                        <div className="flex items-center text-green-500 text-sm ml-4">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Section enregistrée</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Évaluez la fréquence des actions techniques et des changements de posture.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="actionFrequency" className="text-white">
                        Fréquence des actions techniques (par minute)
                      </Label>
                      <span className="text-white">{frequency} actions/min</span>
                    </div>
                    <Slider
                      id="actionFrequency"
                      value={[frequency]}
                      onValueChange={(value) => setFrequency(value[0])}
                      min={0}
                      max={60}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>0 actions/min</span>
                      <span>60 actions/min</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="postureFrequency" className="text-white">
                        Fréquence des changements de posture (par minute)
                      </Label>
                      <span className="text-white">{postureFrequency} changements/min</span>
                    </div>
                    <Slider
                      id="postureFrequency"
                      value={[postureFrequency]}
                      onValueChange={(value) => setPostureFrequency(value[0])}
                      min={0}
                      max={60}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>0 changements/min</span>
                      <span>60 changements/min</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg mt-6 ${getScoreBgColor(
                      (frequency + postureFrequency) / 2,
                      60
                    )} border ${getScoreBorderColor((frequency + postureFrequency) / 2, 60)}`}
                  >
                    <div className="flex items-center gap-2">
                      <Timer className={`h-5 w-5 ${getScoreColor((frequency + postureFrequency) / 2, 60)}`} />
                      <span className="font-medium text-white">Évaluation de la fréquence</span>
                    </div>
                    <p className="mt-2 text-sm text-white">
                      {(frequency + postureFrequency) / 2 < 15
                        ? "Fréquence faible - Risque faible"
                        : (frequency + postureFrequency) / 2 < 30
                          ? "Fréquence modérée - Risque modéré"
                          : (frequency + postureFrequency) / 2 < 45
                            ? "Fréquence élevée - Risque élevé"
                            : "Fréquence très élevée - Risque très élevé"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-4">
                  {saveFeedback === 'frequency' && (
                    <span className="flex items-center text-sm text-[#3b82f6]">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Paramètres sauvegardés
                    </span>
                  )}
                  <Button 
                    onClick={handleSave} 
                    variant="outline"
                    className="!bg-[#3b82f6] hover:!bg-[#60a5fa] !text-white !border-[#3b82f6]/50 transition-all duration-200 shadow-lg font-medium text-sm rounded-md px-4 py-2"
                  >
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mental">
            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium mb-4">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-cyan-400" />
                        <span className="text-[#3b82f6]">Charge Mentale</span>
                      </div>
                    </h3>
                    <div className="flex items-center">
                      <div className="w-24 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">{getIntermediateScore(
                          Object.values(mentalWorkload).reduce((acc, val) => acc + val, 0),
                          120
                        )}/20</span>
                      </div>
                      {savedSections.mental && (
                        <div className="flex items-center text-green-500 text-sm ml-4">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Section enregistrée</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Évaluez la charge mentale de travail en utilisant les curseurs ci-dessous. Chaque dimension est notée de 0 à 20.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(mentalWorkload).map(([key, value]) => (
                <Card key={key} className="bg-gray-900 border-gray-800 p-4 rounded-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="relative h-5 w-5 mr-2 text-cyan-400">
                          <div className="absolute top-0 left-1/2 w-1 h-5 bg-current rounded-full transform -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-1/2 w-3 h-1 bg-current rounded-full transform -translate-x-1/2"></div>
                        </div>
                        {getMentalWorkloadLabel(key)}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${getScoreBgColor(value, 20)} border ${getScoreBorderColor(value, 20)}`}
                      >
                        <span className="text-white">Score:</span> <span className={getScoreColor(value, 20)}>{value}</span><span className="text-white">/20</span>
                      </span>
                    </h3>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-300 mb-4">{getMentalWorkloadDescription(key)}</p>
                      <Slider
                        id={`mental-${key}`}
                        value={[value]}
                        onValueChange={(val) =>
                          setMentalWorkload((prev) => ({ ...prev, [key]: val[0] }))
                        }
                        min={0}
                        max={20}
                        step={1}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-300">
                        {key === 'performance' ? (
                          <>
                            <span>Élevé</span>
                            <span>Faible</span>
                          </>
                        ) : (
                          <>
                            <span>Faible</span>
                            <span>Élevé</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div
              className={`p-4 rounded-lg mt-6 ${getScoreBgColor(mentalScore, 20)} border ${getScoreBorderColor(mentalScore, 20)}`}
            >
              <div className="flex items-center gap-2">
                <Brain className={`h-5 w-5 ${getScoreColor(mentalScore, 20)}`} />
                <span className="font-medium text-white">Évaluation de la charge mentale</span>
              </div>
              <p className="mt-2 text-sm text-white">
                {mentalScore < 5
                  ? "Charge mentale faible - Risque faible"
                  : mentalScore < 10
                    ? "Charge mentale modérée - Risque modéré"
                    : mentalScore < 15
                      ? "Charge mentale élevée - Risque élevé"
                      : "Charge mentale très élevée - Risque très élevé"}
              </p>
            </div>

            <div className="flex justify-end items-center gap-4">
              {saveFeedback === 'mental' && (
                <span className="flex items-center text-sm text-[#3b82f6]">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Paramètres sauvegardés
                </span>
              )}
              <Button 
                onClick={handleSave} 
                variant="outline"
                className="!bg-[#3b82f6] hover:!bg-[#60a5fa] !text-white !border-[#3b82f6]/50 transition-all duration-200 shadow-lg font-medium text-sm rounded-md px-4 py-2"
              >
                Sauvegarder
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="psychosocial">
            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium mb-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-cyan-400" />
                        <span className="text-[#3b82f6]">Risques Psychosociaux</span>
                      </div>
                    </h3>
                    <div className="flex items-center">
                      <div className="w-24 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">{getIntermediateScore(
                          Object.values(psychosocialRisks).reduce((acc, val) => acc + val, 0),
                          44
                        )}/20</span>
                      </div>
                      {savedSections.psychosocial && (
                        <div className="flex items-center text-green-500 text-sm ml-4">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Section enregistrée</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Évaluez les risques psychosociaux selon les différentes dimensions ci-dessous.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {/* Faible autonomie au travail */}
                    <AccordionItem value="autonomie" className="border-gray-700 rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors text-white">
                        <div className="flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-blue-400" />
                          <span className="font-medium text-[#3b82f6]">Faible autonomie au travail</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-800/80 px-4 py-3 space-y-4 border-l-2 border-blue-500">
                        {/* Autonomie dans la tâche */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Autonomie dans la tâche
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés ont-ils des marges de manœuvre dans la manière de réaliser leur travail dès lors que les objectifs sont atteints ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.taskAutonomy.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, taskAutonomy: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="task-autonomy-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="task-autonomy-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="task-autonomy-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="task-autonomy-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="task-autonomy-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="task-autonomy-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="task-autonomy-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="task-autonomy-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Autonomie temporelle */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Autonomie temporelle
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés peuvent-ils interrompre momentanément leur travail quand ils en ressentent le besoin ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.temporalAutonomy.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, temporalAutonomy: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="temporal-autonomy-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="temporal-autonomy-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="temporal-autonomy-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="temporal-autonomy-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="temporal-autonomy-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="temporal-autonomy-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="temporal-autonomy-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="temporal-autonomy-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Utilisation et développement des compétences */}
                        <div className="space-y-2">
                          <Label className="text-white font-medium">
                            Utilisation et développement des compétences
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés peuvent-ils utiliser leurs compétences professionnelles et en développer de nouvelles ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.skillsUse.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, skillsUse: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="skills-use-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="skills-use-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="skills-use-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="skills-use-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="skills-use-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="skills-use-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="skills-use-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="skills-use-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Rapports sociaux au travail dégradés */}
                    <AccordionItem value="rapports-sociaux" className="border-gray-700 rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors text-white">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-purple-400" />
                          <span className="font-medium text-[#3b82f6]">Rapports sociaux au travail dégradés</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-800/80 px-4 py-3 space-y-4 border-l-2 border-purple-500">
                        {/* Soutien de la part des collègues */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Soutien de la part des collègues
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Existe-t-il des possibilités d'entraide entre les salariés, par exemple en cas de surcharge de travail ou de travail délicat ou compliqué ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.colleagueSupport.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, colleagueSupport: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="colleague-support-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="colleague-support-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="colleague-support-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="colleague-support-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="colleague-support-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="colleague-support-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="colleague-support-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="colleague-support-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Soutien de la part des supérieurs hiérarchiques */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Soutien de la part des supérieurs hiérarchiques
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés reçoivent-ils un soutien de la part de l'encadrement ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.hierarchySupport.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, hierarchySupport: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="hierarchy-support-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="hierarchy-support-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="hierarchy-support-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="hierarchy-support-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="hierarchy-support-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="hierarchy-support-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="hierarchy-support-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="hierarchy-support-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Désaccords professionnels */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Désaccords professionnels
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Existe-t-il entre les salariés des causes de désaccord ayant pour origine l'organisation du travail (flou sur le rôle de chacun, inégalité de traitement, etc.) ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.professionalDisagreements.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, professionalDisagreements: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="professional-disagreements-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="professional-disagreements-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="professional-disagreements-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="professional-disagreements-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="professional-disagreements-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="professional-disagreements-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="professional-disagreements-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="professional-disagreements-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Reconnaissance dans le travail */}
                        <div className="space-y-2">
                          <Label className="text-white font-medium">
                            Reconnaissance dans le travail
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés reçoivent-ils des marques de reconnaissance de leur travail de la part de l'entreprise ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.workRecognition.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, workRecognition: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="work-recognition-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="work-recognition-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="work-recognition-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="work-recognition-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="work-recognition-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="work-recognition-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="work-recognition-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="work-recognition-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Conflits de valeurs */}
                    <AccordionItem value="conflits-valeurs" className="border-gray-700 rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors text-white">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-rose-400" />
                          <span className="font-medium text-[#3b82f6]">Conflits de valeurs</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-800/80 px-4 py-3 space-y-4 border-l-2 border-rose-500">
                        {/* Qualité empêchée */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Qualité empêchée
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés considèrent-ils qu'ils font un travail de qualité ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.preventedQuality.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, preventedQuality: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="prevented-quality-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="prevented-quality-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="prevented-quality-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="prevented-quality-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="prevented-quality-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="prevented-quality-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="prevented-quality-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="prevented-quality-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Travail inutile */}
                        <div className="space-y-2">
                          <Label className="text-white font-medium">
                            Travail inutile
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés estiment-ils en général que leur travail est reconnu comme utile ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.uselessWork.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, uselessWork: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="useless-work-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="useless-work-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="useless-work-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="useless-work-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="useless-work-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="useless-work-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="useless-work-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="useless-work-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Insécurité de l'emploi et du travail */}
                    <AccordionItem value="insecurite-emploi" className="border-gray-700 rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors text-white">
                        <div className="flex items-center">
                          <ShieldAlert className="h-5 w-5 mr-2 text-amber-400" />
                          <span className="font-medium text-[#3b82f6]">Insécurité de l'emploi et du travail</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-800/80 px-4 py-3 space-y-4 border-l-2 border-amber-500">
                        {/* Insécurité socio-économique */}
                        <div className="space-y-2 border-b border-gray-700 pb-4">
                          <Label className="text-white font-medium">
                            Insécurité socio-économique (emploi, salaire, carrière...)
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les salariés sont-ils confrontés à des incertitudes quant au maintien de leur activité dans les prochains mois ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.socioeconomicInsecurity.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, socioeconomicInsecurity: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="socioeconomic-insecurity-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="socioeconomic-insecurity-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="socioeconomic-insecurity-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="socioeconomic-insecurity-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="socioeconomic-insecurity-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="socioeconomic-insecurity-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="socioeconomic-insecurity-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="socioeconomic-insecurity-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Conduite du changement dans l'entreprise */}
                        <div className="space-y-2">
                          <Label className="text-white font-medium">
                            Conduite du changement dans l'entreprise
                          </Label>
                          <p className="text-sm text-gray-300 mb-2">
                            Les changements sont-ils suffisamment anticipés, accompagnés, et clairement expliqués aux salariés ?
                          </p>
                          <RadioGroup 
                            value={psychosocialRisks.changeManagement.toString()} 
                            onValueChange={(value) => setPsychosocialRisks(prev => ({...prev, changeManagement: parseInt(value)}))}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="0" id="change-management-0" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="change-management-0" className="cursor-pointer w-full text-white">
                                Jamais/Non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="1" id="change-management-1" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="change-management-1" className="cursor-pointer w-full text-white">
                                Parfois/Plutôt non
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="2" id="change-management-2" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="change-management-2" className="cursor-pointer w-full text-white">
                                Souvent/Plutôt oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                              <RadioGroupItem value="3" id="change-management-3" className="border-cyan-500 text-cyan-500" />
                              <Label htmlFor="change-management-3" className="cursor-pointer w-full text-white">
                                Toujours/Oui
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 hidden">
                    {Object.entries(psychosocialRisks).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between mb-1">
                          <Label htmlFor={`psychosocial-${key}`} className="text-white">
                            {getPsychosocialRiskLabel(key)}
                          </Label>
                          <span className="text-white">{value}</span>
                        </div>
                        <Slider
                          id={`psychosocial-${key}`}
                          value={[value]}
                          onValueChange={(val) =>
                            setPsychosocialRisks((prev) => ({ ...prev, [key]: val[0] }))
                          }
                          min={0}
                          max={10}
                          step={1}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>Faible</span>
                          <span>Élevé</span>
                        </div>
                        <InfoTooltip content={getPsychosocialRiskDescription(key)} />
                      </div>
                    ))}
                  </div>

                  <div
                    className={`p-4 rounded-lg mt-6 ${getScoreBgColor(
                      psychosocialScore,
                      30
                    )} border ${getScoreBorderColor(psychosocialScore, 30)}`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className={`h-5 w-5 ${getScoreColor(psychosocialScore, 30)}`} />
                      <span className="font-medium text-white">Évaluation des risques psychosociaux</span>
                    </div>
                    <p className="mt-2 text-sm text-white">
                      {psychosocialScore < 10
                        ? "Risques psychosociaux faibles"
                        : psychosocialScore < 20
                          ? "Risques psychosociaux modérés"
                          : "Risques psychosociaux élevés"}
                    </p>
                  </div>
                  
                  <div className="flex justify-end items-center gap-4">
                    {saveFeedback === 'psychosocial' && (
                      <span className="flex items-center text-sm text-[#3b82f6]">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Paramètres sauvegardés
                      </span>
                    )}
                    <Button 
                      onClick={handleSave} 
                      variant="outline"
                      className="!bg-[#3b82f6] hover:!bg-[#60a5fa] !text-white !border-[#3b82f6]/50 transition-all duration-200 shadow-lg font-medium text-sm rounded-md px-4 py-2"
                    >
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}