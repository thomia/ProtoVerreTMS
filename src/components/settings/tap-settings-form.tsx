"use client"

import * as React from 'react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import BaseSettingsForm from './base-settings-form'
import { Label } from '@/components/ui/label'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import { cn } from '@/lib/utils'

// Types pour les postures
interface PostureScores {
  neck: number;
  shoulder: number;
  elbow: number;
  wrist: number;
  trunk: number;
  legs: number;
}

interface PostureAdjustments {
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

// Types pour les risques psychosociaux
interface PsychosocialRisks {
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

// Définitions des facteurs de charge mentale (NASA TLX)
const mentalWorkloadDefinitions = {
  mentalDemand: "Jusqu'à quel point les activités mentales et perceptives étaient requises pour faire la tâche (ex., réflexion, décision, calcul, mémoire, observation, recherche, etc.) ?",
  physicalDemand: "Jusqu'à quel point les activités physiques étaient requises pour faire la tâche (ex., pousser, tirer, tourner, contrôler, activer, etc.) ?",
  temporalDemand: "Jusqu'à quel point avez-vous ressenti la pression du temps due au rythme ou à la vitesse à laquelle la tâche ou les éléments de tâche arrivent ?",
  performance: "Jusqu'à quel point pensez-vous que vous réussissez à atteindre les buts de la tâche tels que définis par l'expérimentateur ou par vous-mêmes ?",
  effort: "Jusqu'à quel point avez-vous eu à travailler (mentalement ou physiquement) pour atteindre votre niveau de performance ?",
  frustration: "Jusqu'à quel point vous sentiez-vous non confiant, découragé, irrité, stressé et ennuyé vs confiant, avec plaisir, content, relaxe, satisfait de vous durant la tâche ?"
}

// Définitions des risques psychosociaux
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

// Définitions des paramètres physiques
const physicalDefinitions = {
  weight: "Poids total manipulé en kg. Inclut le poids de l'objet et des contenants.",
  frequency: "Nombre de manipulations par heure de travail.",
  posture: "Position du corps lors de la manipulation : 0° = neutre, 90° = flexion maximale"
}

// Scores maximums par partie du corps
const maxScores = {
  neck: 6,      // 4 + 1 + 1 (base + rotation + inclinaison)
  shoulder: 6,  // 4 + 1 + 1 - 1 (base + levée + abduction - appui)
  elbow: 3,     // 2 + 1 (base + opposé)
  wrist: 6,     // 3 + 1 + 1 + 2 (base + déviation + rotation partielle + rotation complète)
  trunk: 4,     // 4 (base)
  legs: 2       // 2 (base)
}

// Options de réponse pour les risques psychosociaux
const psychosocialOptions = [
  { value: 0, label: "Jamais/Non" },
  { value: 1, label: "Parfois/Plutôt non" },
  { value: 2, label: "Souvent/Plutôt oui" },
  { value: 3, label: "Toujours/Oui" }
]

// Définition des couleurs pour chaque catégorie de risques psychosociaux
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

// Définition de la direction des questions (true = positif, false = négatif)
const psychosocialDirections = {
  workAutonomy: {
    taskAutonomy: true,
    temporalAutonomy: true,
    skillsUse: true
  },
  socialRelations: {
    colleagueSupport: true,
    hierarchySupport: true,
    professionalDisagreements: false,
    workRecognition: true
  },
  valueConflicts: {
    preventedQuality: true,
    uselessWork: false
  },
  jobInsecurity: {
    socioeconomicInsecurity: false,
    changeManagement: true
  }
}

// Ajout des couleurs pour les sliders physiques
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

// Fonction pour obtenir la couleur du score
function getScoreColor(score: number, maxScore: number, baseColor: string) {
  const percentage = score / maxScore
  
  switch(baseColor) {
    case 'red': // Pour le cou
      return percentage <= 0.33 ? 'text-rose-300' :
             percentage <= 0.66 ? 'text-rose-400' :
             'text-rose-500'
    case 'blue': // Pour l'épaule
      return percentage <= 0.33 ? 'text-sky-300' :
             percentage <= 0.66 ? 'text-sky-400' :
             'text-sky-500'
    case 'green': // Pour le coude
      return percentage <= 0.33 ? 'text-emerald-300' :
             percentage <= 0.66 ? 'text-emerald-400' :
             'text-emerald-500'
    case 'purple': // Pour le poignet
      return percentage <= 0.33 ? 'text-violet-300' :
             percentage <= 0.66 ? 'text-violet-400' :
             'text-violet-500'
    case 'yellow': // Pour le tronc
      return percentage <= 0.33 ? 'text-amber-300' :
             percentage <= 0.66 ? 'text-amber-400' :
             'text-amber-500'
    case 'orange': // Pour les jambes
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

export default function TapSettingsForm() {
  // États pour les contraintes
  const [load, setLoad] = useState(50)
  const [frequency, setFrequency] = useState(50)
  const [flowRate, setFlowRate] = useState(50)
  const [isSaved, setIsSaved] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Définir l'état de sauvegarde automatique
  const [autoSave, setAutoSave] = useState(true)
  
  // États pour les scores de posture (ajustables par slider)
  const [postureScores, setPostureScores] = useState({
    neck: 1, // Score pour le cou (1-4)
    shoulder: 1, // Score pour l'épaule (1-4)
    elbow: 1, // Score pour le coude (1-4)
    wrist: 1, // Score pour le poignet (1-4)
    trunk: 1, // Score pour le tronc (1-4)
    legs: 1 // Score pour les jambes (1-4)
  })
  
  // États pour les ajustements de posture (boolean)
  const [postureAdjustments, setPostureAdjustments] = useState({
    neckRotation: false, // Rotation du cou
    neckInclination: false, // Inclinaison latérale du cou
    shoulderRaised: false, // Épaule surélevée
    shoulderAbduction: false, // Abduction de l'épaule
    shoulderSupport: false, // Support de l'épaule/bras
    elbowOpposite: false, // Coude au-delà de la ligne médiane
    wristDeviation: false, // Déviation latérale du poignet
    wristPartialRotation: false, // Rotation partielle du poignet
    wristFullRotation: false // Rotation complète du poignet
  })

  // Chargement des paramètres depuis localStorage au montage du composant
  useEffect(() => {
    // Récupérer les contraintes sauvegardées
    const savedConstraints = getLocalStorage('tapConstraints')
    
    if (savedConstraints) {
      try {
        const constraints = JSON.parse(savedConstraints)
        
        // Contraintes principales
        if (constraints.load) setLoad(constraints.load)
        if (constraints.frequency) setFrequency(constraints.frequency)
        
        // Scores de posture
        if (constraints.postureScores) setPostureScores(constraints.postureScores)
        
        // Ajustements de posture
        if (constraints.postureAdjustments) setPostureAdjustments(constraints.postureAdjustments)
        
        // Si le débit est déjà défini, l'utiliser
        if (constraints.flowRate) {
          setFlowRate(constraints.flowRate)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des contraintes:", error)
      }
    }
    
    // Récupérer le débit depuis localStorage si disponible
    const savedFlowRate = getLocalStorage('flowRate')
    if (savedFlowRate) {
      try {
        setFlowRate(Number(savedFlowRate))
      } catch (e) {
        console.error("Erreur lors du chargement du débit:", e)
      }
    }
    
    setIsInitialized(true)
  }, [])

  // Fonction pour calculer le débit en fonction des contraintes et de la posture
  const calculateFlowRate = useCallback(() => {
    // Calcul du score de posture
    const postureScore = (
      // Somme des scores de base
      (postureScores.neck || 0) + 
      (postureScores.shoulder || 0) + 
      (postureScores.elbow || 0) + 
      (postureScores.wrist || 0) + 
      (postureScores.trunk || 0) + 
      (postureScores.legs || 0)
    ) / 24 * 100; // Conversion en pourcentage (score max = 24)
    
    // Ajustements de posture (chaque ajustement ajoute un pourcentage)
    const adjustmentsScore = (
      (postureAdjustments.neckRotation ? 5 : 0) +
      (postureAdjustments.neckInclination ? 5 : 0) +
      (postureAdjustments.shoulderRaised ? 5 : 0) +
      (postureAdjustments.shoulderAbduction ? 5 : 0) +
      (postureAdjustments.shoulderSupport ? -5 : 0) + // Cet ajustement réduit le score
      (postureAdjustments.elbowOpposite ? 5 : 0) +
      (postureAdjustments.wristDeviation ? 5 : 0) +
      (postureAdjustments.wristPartialRotation ? 5 : 0) +
      (postureAdjustments.wristFullRotation ? 10 : 0)
    );
    
    // Calcul du débit (charge, fréquence et posture)
    // La formule donne plus de poids à la charge (40%), puis à la fréquence (30%) et enfin à la posture (30%)
    const calculatedFlowRate = Math.round(
      (load * 0.4) +
      (frequency * 0.3) +
      ((postureScore + adjustmentsScore) * 0.3)
    );
    
    // Limiter le débit entre 0 et 100
    return Math.max(0, Math.min(100, calculatedFlowRate));
  }, [load, frequency, postureScores, postureAdjustments]);

  // Mémoriser le débit calculé
  const calculatedFlowRate = useMemo(() => calculateFlowRate(), [calculateFlowRate]);
  
  // Sauvegarder le débit calculé
  const saveFlowRate = useCallback((newFlowRate: number) => {
    // Mettre à jour l'état
    setFlowRate(newFlowRate);
    
    // Sauvegarder les contraintes et le débit
    const constraints = {
      load,
      frequency,
      postureScores,
      postureAdjustments,
      flowRate: newFlowRate
    };
    
    // Sauvegarder dans localStorage
    setLocalStorage('tapConstraints', JSON.stringify(constraints));
    setLocalStorage('flowRate', newFlowRate.toString());
    
    // Émettre un événement personnalisé pour notifier les autres composants
    const event = new CustomEvent('tapFlowUpdated', {
      detail: { flowRate: newFlowRate }
    });
    window.dispatchEvent(event);
    
    // Émettre un événement storage
    emitStorageEvent();
    
    return newFlowRate;
  }, [load, frequency, postureScores, postureAdjustments]);

  // Calculer et sauvegarder le débit quand nécessaire
  useEffect(() => {
    if (!isInitialized) return;
    
    // Ne calculer et mettre à jour que lorsque formSubmitted est true (après la première soumission)
    // ou lorsque autoSave est activé
    if (!formSubmitted && !autoSave) return;
    
    const newFlowRate = calculateFlowRate();
    if (newFlowRate !== flowRate) {
      saveFlowRate(newFlowRate);
    }
  }, [calculatedFlowRate, formSubmitted, autoSave, isInitialized, calculateFlowRate, saveFlowRate, flowRate]);

  // Gérer la soumission du formulaire
  const handleSubmit = useCallback(() => {
    setFormSubmitted(true);
    const newFlowRate = calculateFlowRate();
    saveFlowRate(newFlowRate);
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  }, [calculateFlowRate, saveFlowRate]);

  // Mettre à jour un score de posture
  const updatePostureScore = useCallback((key: keyof typeof postureScores, value: number) => {
    setPostureScores(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Mettre à jour un ajustement de posture
  const updatePostureAdjustment = useCallback((key: keyof typeof postureAdjustments, checked: boolean) => {
    setPostureAdjustments(prev => ({
      ...prev,
      [key]: checked
    }));
  }, []);

  return (
    <BaseSettingsForm
      title="Paramètres du Robinet"
      description="Le travail, avec l'ensemble de ses composantes, constitue le facteur clé dans l'analyse du risque de troubles musculo-squelettiques (TMS) et de probabilité d'accident de travail. Quels sont les déterminants physiques, psychologiques et organisationnels impliqués ? Examinez chaque aspect pour évaluer le niveau de contrainte : la charge manipulée (poids, fréquence), les postures adoptées, ainsi que l'état émotionnel (charge mentale, facteurs psychosociaux)."
      currentValue={calculatedFlowRate}
      getValueDescription={() => "Débit du robinet"}
      onSubmit={handleSubmit}
      scoreType="tap"
    >
      <div className="w-full">
        <Accordion 
          type="single" 
          collapsible 
          value={activeSection}
          onValueChange={setActiveSection}
          className="w-full space-y-2"
        >
          {/* Section Charge */}
          <AccordionItem value="charge" className="border-b border-gray-800">
            <AccordionTrigger className="text-xl font-semibold text-white hover:text-gray-300">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {isSectionComplete('charge') ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>Charge manipulée</span>
                  <span className="text-sm font-normal text-gray-400 italic">Charge maximale admissible selon l'article R4541-9 du Code du travail</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 p-4">
                <div className="text-sm text-gray-400 mb-4">
                  {getSectionStatus('charge') === "Poids unitaire défini" ? "" : getSectionStatus('charge')}
                </div>
                <div className={`group p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/40 transition-all duration-300 border-l-4 ${physicalSliderColors.weight.border}`}>
                  <label className="block text-base font-medium text-white mb-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-3xl font-semibold ${physicalSliderColors.weight.text}`}>Poids manipulé</span>
                        <InfoTooltip content={physicalDefinitions.weight} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-semibold text-gray-400">Charge:</span>
                        <span className={`text-5xl font-mono font-bold ${physicalSliderColors.weight.text} bg-gray-800 px-4 py-2 rounded-md min-w-[6rem] text-center`}>
                          {load.toString().padStart(2, '0')}
          </span>
                        <span className="text-3xl font-semibold text-gray-400">kg</span>
        </div>
      </div>
          </label>

                  <div className="relative mt-6">
                    {/* Graduations principales */}
                    <div className="absolute w-full flex justify-between px-1 -top-8">
                      {[0, 15, 30, 45, 55].map((mark) => (
                        <div key={mark} className="flex flex-col items-center">
                          <span className={`text-3xl ${load >= mark ? physicalSliderColors.weight.text : 'text-gray-500'} mb-1`}>
                            {mark}
                          </span>
                          <div className={`h-2 w-0.5 ${load >= mark ? physicalSliderColors.weight.active : physicalSliderColors.weight.inactive}`} />
                        </div>
                      ))}
                    </div>

                    {/* Graduations secondaires */}
                    <div className="absolute w-full flex justify-between px-1 -top-2">
                      {Array.from({ length: 54 }, (_, i) => i + 1)
                        .filter(mark => mark % 15 !== 0 && mark % 5 === 0)
                        .map((mark) => (
                          <SecondaryMark
                            key={mark}
                            mark={mark}
                            value={load}
                            activeClass={physicalSliderColors.weight.activeLight}
                          />
                        ))}
          </div>

                    {/* Barre de progression */}
                    <div className="h-2 bg-gray-700 rounded-sm overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${physicalSliderColors.weight.from} ${physicalSliderColors.weight.to} transition-all duration-150`}
                        style={{ width: `${(load / 55) * 100}%` }}
                      />
        </div>

                    {/* Curseur personnalisé */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ left: `calc(${(load / 55) * 100}% - 6px)` }}
                    >
                      <div className={`w-3 h-6 bg-white rounded-sm shadow-lg border ${physicalSliderColors.weight.border}`} />
      </div>
      
                    {/* Input range masqué */}
          <input
            type="range"
            min={0}
                      max={55}
                      value={load}
                      onChange={(e) => setLoad(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
          </div>

                  {/* Description des valeurs */}
                  <div className="flex justify-between text-xl text-gray-400 mt-6">
                    <div className="flex flex-col items-start">
                      <span className="text-gray-500">0-15 kg</span>
        </div>
                    <div className="flex flex-col items-center">
                      <span className="text-gray-500">15-30 kg</span>
      </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500">30-55 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section Postures */}
          <AccordionItem value="postures" className="border-b border-gray-800">
            <AccordionTrigger className="text-xl font-semibold text-white hover:text-gray-300">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {isSectionComplete('postures') ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>Évaluation des postures</span>
                  <span className="text-sm font-normal text-gray-400 italic">Adaptation de la méthode RULA (Rapid Upper Limb Assessment) par McAtamney et Corlett, 1993</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 p-4">
                <div className="text-sm text-gray-400 mb-4">
                  {getSectionStatus('postures')}
                </div>
                <div className="space-y-3">
                  {/* Cou */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-rose-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Cou</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.neck + 
                        (postureAdjustments.neckRotation ? 1 : 0) + 
                        (postureAdjustments.neckInclination ? 1 : 0),
                        maxScores.neck,
                        'red'
                      )}`}>
                        Score: {postureScores.neck + 
                          (postureAdjustments.neckRotation ? 1 : 0) + 
                          (postureAdjustments.neckInclination ? 1 : 0)}
                        /{maxScores.neck}
                      </span>
                    </div>

                    <RadioGroup
                      value={String(postureScores.neck)}
                      onValueChange={(value: string) => updatePostureScore('neck', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-4 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="neck-1" className="h-6 w-6 group-hover:border-red-400" />
                        <span className="text-lg font-medium text-white">0° à 10° (+1)</span>
          </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="neck-2" className="h-5 w-5 group-hover:border-red-400" />
                        <span className="text-white">10° à 20° (+2)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="3" id="neck-3" className="h-5 w-5 group-hover:border-red-400" />
                        <span className="text-white">20° ou plus (+3)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="4" id="neck-4" className="h-5 w-5 group-hover:border-red-400" />
                        <span className="text-white">Extension (+4)</span>
                      </label>
                    </RadioGroup>

                    <div className="space-y-2 pt-4 mt-4 border-t border-gray-600">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Ajustements supplémentaires</h5>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="neck-rotation"
                          checked={postureAdjustments.neckRotation}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('neckRotation', checked)}
                          className="h-5 w-5 group-hover:border-red-400"
                        />
                        <span className="text-white">Rotation du cou (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="neck-inclination"
                          checked={postureAdjustments.neckInclination}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('neckInclination', checked)}
                          className="h-5 w-5 group-hover:border-red-400"
                        />
                        <span className="text-white">Inclinaison du cou (+1)</span>
                      </label>
          </div>
        </div>

                  {/* Épaule */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-sky-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Épaule</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.shoulder + 
                        (postureAdjustments.shoulderRaised ? 1 : 0) + 
                        (postureAdjustments.shoulderAbduction ? 1 : 0) + 
                        (postureAdjustments.shoulderSupport ? -1 : 0),
                        maxScores.shoulder,
                        'blue'
                      )}`}>
                        Score: {postureScores.shoulder + 
                          (postureAdjustments.shoulderRaised ? 1 : 0) + 
                          (postureAdjustments.shoulderAbduction ? 1 : 0) + 
                          (postureAdjustments.shoulderSupport ? -1 : 0)}
                        /{maxScores.shoulder}
            </span>
      </div>
      
                    <RadioGroup
                      value={String(postureScores.shoulder)}
                      onValueChange={(value: string) => updatePostureScore('shoulder', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="shoulder-1" className="h-5 w-5 group-hover:border-blue-400" />
                        <span className="text-white">-20° à 20° (+1)</span>
          </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="shoulder-2" className="h-5 w-5 group-hover:border-blue-400" />
                        <span className="text-white">20° à 45° (+2)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="3" id="shoulder-3" className="h-5 w-5 group-hover:border-blue-400" />
                        <span className="text-white">45° à 90° (+3)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="4" id="shoulder-4" className="h-5 w-5 group-hover:border-blue-400" />
                        <span className="text-white">90° ou plus (+4)</span>
                      </label>
                    </RadioGroup>

                    <div className="space-y-2 pt-4 mt-4 border-t border-gray-600">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Ajustements supplémentaires</h5>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="shoulder-raised"
                          checked={postureAdjustments.shoulderRaised}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('shoulderRaised', checked)}
                          className="h-5 w-5 group-hover:border-blue-400"
                        />
                        <span className="text-white">Épaule levée (+1)</span>
          </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="shoulder-abduction"
                          checked={postureAdjustments.shoulderAbduction}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('shoulderAbduction', checked)}
                          className="h-5 w-5 group-hover:border-blue-400"
                        />
                        <span className="text-white">Bras en abduction (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="shoulder-support"
                          checked={postureAdjustments.shoulderSupport}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('shoulderSupport', checked)}
                          className="h-5 w-5 group-hover:border-blue-400"
                        />
                        <span className="text-white">Bras en appui (-1)</span>
                      </label>
          </div>
                  </div>

                  {/* Coude */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-emerald-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Coude</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.elbow + 
                        (postureAdjustments.elbowOpposite ? 1 : 0),
                        maxScores.elbow,
                        'green'
                      )}`}>
                        Score: {postureScores.elbow + 
                          (postureAdjustments.elbowOpposite ? 1 : 0)}
                        /{maxScores.elbow}
            </span>
        </div>
        
                    <RadioGroup
                      value={String(postureScores.elbow)}
                      onValueChange={(value: string) => updatePostureScore('elbow', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="elbow-1" className="h-5 w-5 group-hover:border-green-400" />
                        <span className="text-white">60° à 100° (+1)</span>
          </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="elbow-2" className="h-5 w-5 group-hover:border-green-400" />
                        <span className="text-white">0° à 60° (+2)</span>
                      </label>
                    </RadioGroup>

                    <div className="space-y-2 pt-4 mt-4 border-t border-gray-600">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Ajustements supplémentaires</h5>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="elbow-opposite"
                          checked={postureAdjustments.elbowOpposite}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('elbowOpposite', checked)}
                          className="h-5 w-5 group-hover:border-green-400"
                        />
                        <span className="text-white">Travail sur la moitié du corps opposé (+1)</span>
                      </label>
          </div>
                  </div>

                  {/* Poignet */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-violet-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Poignet</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.wrist + 
                        (postureAdjustments.wristDeviation ? 1 : 0) + 
                        (postureAdjustments.wristPartialRotation ? 1 : 0) + 
                        (postureAdjustments.wristFullRotation ? 2 : 0),
                        maxScores.wrist,
                        'purple'
                      )}`}>
                        Score: {postureScores.wrist + 
                          (postureAdjustments.wristDeviation ? 1 : 0) + 
                          (postureAdjustments.wristPartialRotation ? 1 : 0) + 
                          (postureAdjustments.wristFullRotation ? 2 : 0)}
                        /{maxScores.wrist}
            </span>
        </div>
        
                    <RadioGroup
                      value={String(postureScores.wrist)}
                      onValueChange={(value: string) => updatePostureScore('wrist', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="wrist-1" className="h-5 w-5 group-hover:border-purple-400" />
                        <span className="text-white">0° (+1)</span>
          </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="wrist-2" className="h-5 w-5 group-hover:border-purple-400" />
                        <span className="text-white">-15° à 15° (+2)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="3" id="wrist-3" className="h-5 w-5 group-hover:border-purple-400" />
                        <span className="text-white">15° ou plus (+3)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="3" id="wrist-4" className="h-5 w-5 group-hover:border-purple-400" />
                        <span className="text-white">-15° ou moins (+3)</span>
                      </label>
                    </RadioGroup>

                    <div className="space-y-2 pt-4 mt-4 border-t border-gray-600">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Ajustements supplémentaires</h5>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="wrist-deviation"
                          checked={postureAdjustments.wristDeviation}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('wristDeviation', checked)}
                          className="h-5 w-5 group-hover:border-purple-400"
                        />
                        <span className="text-white">Déviation radiale/ulnaire (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="wrist-partial-rotation"
                          checked={postureAdjustments.wristPartialRotation}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('wristPartialRotation', checked)}
                          className="h-5 w-5 group-hover:border-purple-400"
                        />
                        <span className="text-white">Pronation/supination partielle (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <Checkbox
                          id="wrist-full-rotation"
                          checked={postureAdjustments.wristFullRotation}
                          onCheckedChange={(checked: boolean) => updatePostureAdjustment('wristFullRotation', checked)}
                          className="h-5 w-5 group-hover:border-purple-400"
                        />
                        <span className="text-white">Pronation/supination complète (+2)</span>
                      </label>
          </div>
      </div>
      
                  {/* Tronc */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Tronc</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.trunk,
                        maxScores.trunk,
                        'yellow'
                      )}`}>
                        Score: {postureScores.trunk}/{maxScores.trunk}
            </span>
          </div>

                    <RadioGroup
                      value={String(postureScores.trunk)}
                      onValueChange={(value: string) => updatePostureScore('trunk', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="trunk-1" className="h-5 w-5 group-hover:border-yellow-400" />
                        <span className="text-white">0° (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="trunk-2" className="h-5 w-5 group-hover:border-yellow-400" />
                        <span className="text-white">0° à 20° (+2)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="3" id="trunk-3" className="h-5 w-5 group-hover:border-yellow-400" />
                        <span className="text-white">20° à 60° (+3)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="4" id="trunk-4" className="h-5 w-5 group-hover:border-yellow-400" />
                        <span className="text-white">60° ou plus (+4)</span>
                      </label>
                    </RadioGroup>
        </div>
          
                  {/* Jambes */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">Jambes</h4>
                      <span className={`text-lg font-semibold ${getScoreColor(
                        postureScores.legs,
                        maxScores.legs,
                        'orange'
                      )}`}>
                        Score: {postureScores.legs}/{maxScores.legs}
                      </span>
      </div>
      
                    <RadioGroup
                      value={String(postureScores.legs)}
                      onValueChange={(value: string) => updatePostureScore('legs', Number(value))}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="1" id="legs-1" className="h-5 w-5 group-hover:border-orange-400" />
                        <span className="text-white">Position assise (+1)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="legs-2" className="h-5 w-5 group-hover:border-orange-400" />
                        <span className="text-white">Position à genou (+2)</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer group">
                        <RadioGroupItem value="2" id="legs-3" className="h-5 w-5 group-hover:border-orange-400" />
                        <span className="text-white">Position debout (+2)</span>
                      </label>
                    </RadioGroup>
        </div>
      </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section Fréquences */}
          <AccordionItem value="frequences" className="border-b border-gray-800">
            <AccordionTrigger className="text-xl font-semibold text-white hover:text-gray-300">
              <div className="flex items-center gap-4">
                {isSectionComplete('frequences') ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span>Fréquences</span>
        </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 p-4">
                <div className="text-sm text-gray-400 mb-4">
                  {getSectionStatus('frequences')}
          </div>
          
                {/* Fréquence de manipulation */}
                <div className={`group p-4 pb-16 rounded-lg bg-gray-800/30 hover:bg-gray-800/40 transition-all duration-300 border-l-4 ${physicalSliderColors.loadFrequency.border}`}>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-semibold ${physicalSliderColors.loadFrequency.text}`}>Fréquence de manipulation</span>
                      <InfoTooltip content="Combien de fois je manipule la/les charges par heure (Pousser, Tirer, Tourner, Maintenir, Porter, Jeter)" />
            </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-semibold text-gray-400">Fréquence:</span>
                      <span className={`text-5xl font-mono font-bold ${physicalSliderColors.loadFrequency.text} bg-gray-800 px-4 py-2 rounded-md min-w-[6rem] text-center`}>
                        {frequency.toString().padStart(2, '0')}
                      </span>
                      <span className="text-3xl font-semibold text-gray-400">/h</span>
        </div>
      </div>
      
                  <div className="relative mt-6">
                    {/* Barre de progression */}
                    <div className="h-2 bg-gray-700 rounded-sm overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${physicalSliderColors.loadFrequency.from} ${physicalSliderColors.loadFrequency.to} transition-all duration-150`}
                        style={{ width: `${((frequency - 2) / 58) * 100}%` }}
                      />
            </div>

                    {/* Curseur personnalisé */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ left: `calc(${((frequency - 2) / 58) * 100}% - 6px)` }}
                    >
                      <div className={`w-3 h-6 bg-white rounded-sm shadow-lg border ${physicalSliderColors.loadFrequency.border}`} />
          </div>
          
                    {/* Input range masqué */}
            <input
              type="range"
                      min={2}
              max={60}
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />

                    {/* Graduations principales */}
                    <div className="absolute w-full flex justify-between px-1 top-4 mt-2">
                      {[2, 15, 30, 45, 60].map((mark) => (
                        <div key={mark} className="flex flex-col items-center">
                          <div className={`h-2 w-0.5 ${frequency >= mark ? physicalSliderColors.loadFrequency.active : physicalSliderColors.loadFrequency.inactive}`} />
                          <span className={`text-3xl mt-1 ${frequency >= mark ? physicalSliderColors.loadFrequency.text : 'text-gray-500'}`}>
                            {mark}
                          </span>
            </div>
                      ))}
          </div>
          
                    {/* Graduations secondaires */}
                    <div className="absolute w-full flex justify-between px-1 top-4">
                      {Array.from({ length: 58 }, (_, i) => i + 3)
                        .filter(mark => mark % 15 !== 0 && mark % 5 === 0)
                        .map((mark) => (
                          <SecondaryMark
                            key={mark}
                            mark={mark}
                            value={frequency}
                            activeClass={physicalSliderColors.loadFrequency.activeLight}
                          />
                        ))}
            </div>
          </div>
                </div>

                {/* Fréquence posture contraignante */}
                <div className={`group p-4 pb-16 rounded-lg bg-gray-800/30 hover:bg-gray-800/40 transition-all duration-300 border-l-4 ${physicalSliderColors.postureFrequency.border}`}>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-semibold ${physicalSliderColors.postureFrequency.text}`}>Fréquence posture contraignante</span>
                      <InfoTooltip content="Combien de fois par heure je suis dans la posture la plus contraignante (équivalente ou presque à la posture évaluée ci-dessus)" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-semibold text-gray-400">Fréquence:</span>
                      <span className={`text-5xl font-mono font-bold ${physicalSliderColors.postureFrequency.text} bg-gray-800 px-4 py-2 rounded-md min-w-[6rem] text-center`}>
                        {frequency.toString().padStart(2, '0')}
                      </span>
                      <span className="text-3xl font-semibold text-gray-400">/h</span>
        </div>
      </div>
      
                  <div className="relative mt-6">
                    {/* Barre de progression */}
                    <div className="h-2 bg-gray-700 rounded-sm overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${physicalSliderColors.postureFrequency.from} ${physicalSliderColors.postureFrequency.to} transition-all duration-150`}
                        style={{ width: `${((frequency - 2) / 58) * 100}%` }}
                      />
            </div>

                    {/* Curseur personnalisé */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ left: `calc(${((frequency - 2) / 58) * 100}% - 6px)` }}
                    >
                      <div className={`w-3 h-6 bg-white rounded-sm shadow-lg border ${physicalSliderColors.postureFrequency.border}`} />
          </div>
          
                    {/* Input range masqué */}
            <input
              type="range"
                      min={2}
                      max={60}
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />

                    {/* Graduations principales */}
                    <div className="absolute w-full flex justify-between px-1 top-4 mt-2">
                      {[2, 15, 30, 45, 60].map((mark) => (
                        <div key={mark} className="flex flex-col items-center">
                          <div className={`h-2 w-0.5 ${frequency >= mark ? physicalSliderColors.postureFrequency.active : physicalSliderColors.postureFrequency.inactive}`} />
                          <span className={`text-3xl mt-1 ${frequency >= mark ? physicalSliderColors.postureFrequency.text : 'text-gray-500'}`}>
                            {mark}
                          </span>
            </div>
                      ))}
          </div>
          
                    {/* Graduations secondaires */}
                    <div className="absolute w-full flex justify-between px-1 top-4">
                      {Array.from({ length: 58 }, (_, i) => i + 3)
                        .filter(mark => mark % 15 !== 0 && mark % 5 === 0)
                        .map((mark) => (
                          <SecondaryMark
                            key={mark}
                            mark={mark}
                            value={frequency}
                            activeClass={physicalSliderColors.postureFrequency.activeLight}
                          />
                        ))}
            </div>
          </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section Charge Mentale */}
          <AccordionItem value="mental" className="border-b border-gray-800">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {calculateMentalWorkloadScore() > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-xl font-semibold text-white hover:text-gray-300">Charge Mentale</span>
                  <span className="text-sm font-normal text-gray-400 italic">Adaptation du questionnaire NASA-TLX (Task Load Index) par Hart et Staveland, 1988</span>
            </div>
          </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 p-4">
                {/* Score Global */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/15 via-emerald-900/10 to-emerald-950/15 rounded-lg mb-6 border border-emerald-800/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-medium text-white/90">Score Global de Charge Mentale</h4>
                    <span className="text-3xl font-bold text-emerald-400/80">
                      {calculateMentalWorkloadScore()}/120
                    </span>
        </div>
      </div>
      
                {/* Sliders */}
                {Object.entries(mentalWorkload).map(([key, value]) => {
                  const colors = {
                    mentalDemand: {
                      from: 'from-violet-600',
                      to: 'to-violet-400',
                      border: 'border-violet-500',
                      text: 'text-violet-400',
                      active: 'bg-violet-500',
                      activeLight: 'bg-violet-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-violet-900/10'
                    },
                    physicalDemand: {
                      from: 'from-blue-600',
                      to: 'to-blue-400',
                      border: 'border-blue-500',
                      text: 'text-blue-400',
                      active: 'bg-blue-500',
                      activeLight: 'bg-blue-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-blue-900/10'
                    },
                    temporalDemand: {
                      from: 'from-indigo-600',
                      to: 'to-indigo-400',
                      border: 'border-indigo-500',
                      text: 'text-indigo-400',
                      active: 'bg-indigo-500',
                      activeLight: 'bg-indigo-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-indigo-900/10'
                    },
                    performance: {
                      from: 'from-cyan-600',
                      to: 'to-cyan-400',
                      border: 'border-cyan-500',
                      text: 'text-cyan-400',
                      active: 'bg-cyan-500',
                      activeLight: 'bg-cyan-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-cyan-900/10'
                    },
                    effort: {
                      from: 'from-fuchsia-600',
                      to: 'to-fuchsia-400',
                      border: 'border-fuchsia-500',
                      text: 'text-fuchsia-400',
                      active: 'bg-fuchsia-500',
                      activeLight: 'bg-fuchsia-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-fuchsia-900/10'
                    },
                    frustration: {
                      from: 'from-purple-600',
                      to: 'to-purple-400',
                      border: 'border-purple-500',
                      text: 'text-purple-400',
                      active: 'bg-purple-500',
                      activeLight: 'bg-purple-500/30',
                      inactive: 'bg-gray-600',
                      bg: 'bg-purple-900/10'
                    }
                  }

                  const itemColors = colors[key as keyof typeof colors]

                  return (
                    <div key={key} className={`group p-4 pb-16 rounded-lg bg-gray-800/30 hover:bg-gray-800/40 transition-all duration-300 border-l-4 ${itemColors.border}`}>
                      <div className="flex flex-col gap-2 mb-10">
                        <div className="flex items-center justify-between">
                          <span className={`text-3xl font-semibold ${itemColors.text}`}>
                            {key === 'mentalDemand' ? 'Exigence Mentale' :
                             key === 'physicalDemand' ? 'Exigence Physique' :
                             key === 'temporalDemand' ? 'Exigence Temporelle' :
                             key === 'performance' ? 'Performance' :
                             key === 'effort' ? 'Effort' : 'Frustration'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-semibold text-gray-400">Score:</span>
                            <span className={`text-5xl font-mono font-bold ${itemColors.text} bg-gray-800 px-4 py-2 rounded-md min-w-[6rem] text-center`}>
                              {value.toString().padStart(2, '0')}
                            </span>
            </div>
                        </div>
                        <p className="text-base text-gray-400 mt-1">
                          {mentalWorkloadDefinitions[key as keyof typeof mentalWorkloadDefinitions]}
                        </p>
          </div>
          
                      <div className="relative mt-6">
                        {/* Barre de progression */}
                        <div className="h-2 bg-gray-700 rounded-sm overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${itemColors.from} ${itemColors.to} transition-all duration-150`}
                            style={{ width: `${(value / 20) * 100}%` }}
                          />
            </div>

                        {/* Curseur personnalisé */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ left: `calc(${(value / 20) * 100}% - 6px)` }}
                        >
                          <div className={`w-3 h-6 bg-white rounded-sm shadow-lg border ${itemColors.border}`} />
          </div>
          
                        {/* Input range masqué */}
            <input
              type="range"
              min={0}
                          max={20}
                          step={1}
                          value={value}
                          onChange={(e) => setMentalWorkload({
                            ...mentalWorkload,
                            [key]: Number(e.target.value)
                          })}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />

                        {/* Graduations principales */}
                        <div className="absolute w-full flex justify-between px-1 top-4 mt-2">
                          {[0, 5, 10, 15, 20].map((mark) => (
                            <div key={mark} className="flex flex-col items-center">
                              <div className={`h-2 w-0.5 ${value >= mark ? itemColors.active : itemColors.inactive}`} />
                              <span className={`text-3xl mt-1 ${value >= mark ? itemColors.text : 'text-gray-500'}`}>
                                {mark}
                              </span>
            </div>
                          ))}
          </div>
          
                        {/* Graduations secondaires */}
                        <div className="absolute w-full flex justify-between px-1 top-4">
                          {Array.from({ length: 19 }, (_, i) => i + 1)
                            .filter(mark => mark % 5 !== 0)
                            .map((mark) => (
                              <SecondaryMark
                                key={mark}
                                mark={mark}
                                value={value}
                                activeClass={itemColors.activeLight}
                              />
                            ))}
            </div>
          </div>
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section Risques Psychosociaux */}
          <AccordionItem value="psychosocial" className="border-b border-gray-800">
            <AccordionTrigger className="text-xl font-semibold text-white hover:text-gray-300">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {calculatePsychosocialScore() > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>Risques Psychosociaux</span>
                  <span className="text-sm font-normal text-gray-400 italic">Adaptation des documents ressources de l'INRS</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 p-4">
                {/* Score Total */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/15 via-emerald-900/10 to-emerald-950/15 rounded-lg mb-6 border border-emerald-800/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-medium text-white/90">Score Global des Risques Psychosociaux</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-emerald-950/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-700/40 to-emerald-600/40 transition-all duration-500"
                          style={{ width: `${calculatePsychosocialScore()}%` }}
                        />
                      </div>
                      <span className="text-3xl font-bold text-emerald-400/80 min-w-[4rem] text-right">
                        {calculatePsychosocialScore()}%
                      </span>
                    </div>
            </div>
          </div>
          
                {/* Catégories de risques psychosociaux */}
                {Object.entries(psychosocialDefinitions).map(([category, data]) => {
                  const colors = psychosocialColors[category as keyof typeof psychosocialColors]
                  return (
                    <div key={category} className={`space-y-4 p-6 rounded-lg bg-gradient-to-r ${colors.gradient} border-l-4 ${colors.border} transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20`}>
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className={`text-xl font-semibold ${colors.text}`}>{data.title}</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-700/50 to-transparent" />
                      </div>
                      <div className="space-y-6">
                        {Object.entries(data).filter(([key]) => key !== 'title').map(([subCategory, question]) => {
                          const isPositive = psychosocialDirections[category as keyof typeof psychosocialDirections][subCategory as keyof typeof psychosocialDirections[keyof typeof psychosocialDirections]]
                          const currentValue = psychosocialRisks[category as keyof PsychosocialRisks][subCategory as keyof typeof psychosocialRisks[keyof PsychosocialRisks]]
                          const score = isPositive ? currentValue : 3 - currentValue
                          
                          return (
                            <div key={subCategory} className="space-y-3">
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-gray-300">{question}</span>
                                <InfoTooltip content={`${question} (${isPositive ? 'Plus la réponse est "Oui", plus c\'est positif' : 'Plus la réponse est "Non", plus c\'est positif'})`} />
                              </div>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {psychosocialOptions.map((option) => (
                                  <label
                                    key={option.value}
                                    className={`
                                      flex items-center justify-center p-3 rounded-md
                                      ${currentValue === option.value
                                        ? `${colors.active} text-white shadow-lg shadow-gray-900/20`
                                        : `${colors.hover} text-gray-300`
                                      }
                                      cursor-pointer transition-all duration-200
                                      border border-gray-700/30
                                      hover:scale-[1.02] hover:shadow-md
                                    `}
                                  >
            <input
                                      type="radio"
                                      name={`${category}-${subCategory}`}
                                      value={option.value}
                                      checked={currentValue === option.value}
                                      onChange={() => updatePsychosocialRisk(category as keyof PsychosocialRisks, subCategory, option.value)}
                                      className="sr-only"
                                    />
                                    <span className="text-sm font-medium">{option.label}</span>
                                  </label>
                                ))}
            </div>
                              <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                                <span>{isPositive ? 'Négatif' : 'Positif'}</span>
                                <span className={`font-medium ${score <= 1 ? 'text-red-400' : score <= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                                  {score <= 1 ? 'Risque élevé' : score <= 2 ? 'Risque modéré' : 'Risque faible'}
                                </span>
                                <span>{isPositive ? 'Positif' : 'Négatif'}</span>
          </div>
        </div>
                          )
                        })}
      </div>
      </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </BaseSettingsForm>
  )
} 