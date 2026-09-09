/**
 * Questions de l'élément ROBINET - Charge de travail (version Sensibilisation).
 *
 * Élément NÉGATIF : score élevé = charge importante.
 *
 * Deux étapes côté participant :
 *   1. Il CLASSE les 5 aspects par importance (glisser-déposer) → chaque rang
 *      donne un poids wᵢ (`ROBINET_RANK_WEIGHTS`). Stockés dans `answers`
 *      (`robinet_w_*`). Le participant ne voit jamais les poids.
 *   2. Il place un curseur 0-100 par aspect → ce sont les défaveurs xᵢ.
 *
 * Score_R = moyenne quadratique pondérée des curseurs avec ces poids
 * (voir scoring.ts). Sans classement, tous les aspects pèsent également.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { applyDirection, weightedQuadraticMean } from './scoring'

/**
 * Correspondance aspect → clé du poids stocké dans `answers`.
 * L'ordre définit aussi l'ordre d'affichage par défaut du classement.
 */
export const ROBINET_ASPECTS = [
  { questionId: 'robinet_charge', weightKey: 'robinet_w_charge', label: 'Charge physique' },
  { questionId: 'robinet_posture', weightKey: 'robinet_w_posture', label: 'Posture' },
  { questionId: 'robinet_frequence', weightKey: 'robinet_w_frequence', label: 'Fréquence et durée' },
  { questionId: 'robinet_charge_mentale', weightKey: 'robinet_w_cognitif', label: 'Charge mentale' },
  { questionId: 'robinet_rps', weightKey: 'robinet_w_rps', label: 'Risques psychosociaux' },
] as const

export const ROBINET_WEIGHT_KEYS = ROBINET_ASPECTS.map((a) => a.weightKey)

/**
 * Poids attribués selon le rang du classement (du plus au moins important).
 * `ROBINET_RANK_WEIGHTS[0]` = poids du 1er aspect classé (le plus important),
 * etc. Seuls les rapports comptent (la moyenne quadratique renormalise par la
 * somme des poids).
 */
export const ROBINET_RANK_WEIGHTS = [3, 2.5, 2, 1.5, 1] as const

/** Poids neutre utilisé tant que le participant n'a pas classé les aspects. */
export const DEFAULT_ASPECT_WEIGHT = 2

/**
 * Curseurs « aperçu terrain » : le titre décrit concrètement ce que le
 * participant doit évaluer dans sa tâche, le sous-titre détaille ce qu'on
 * observe ou mesure pour cet aspect. `section` conserve le nom technique de
 * l'aspect (repris tel quel dans l'exercice de classement).
 */
const questions: Question[] = [
  {
    id: 'robinet_charge',
    element: 'robinet',
    type: 'scale',
    section: 'Charge physique',
    question: 'Les charges que vous manipulez : porter, soulever, pousser, tirer, déplacer',
    subtitle:
      'Ce qui compte : le poids réel de la charge, la façon de la saisir (poignées, volume, matière glissante), son équilibre, et le nombre de fois où vous la reprenez.',
    description: '0 = aucune charge à manipuler / 100 = charges lourdes, difficiles à saisir, reprises très souvent',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Aucune charge',
    maxLabel: 'Lourd et répété',
  },
  {
    id: 'robinet_posture',
    element: 'robinet',
    type: 'scale',
    section: 'Posture',
    question: 'Les positions que votre corps doit tenir pour faire le travail',
    subtitle:
      'On regarde l\u2019angle pris par chaque partie du corps — dos, épaules, bras, genoux. Au-delà de certaines plages angulaires la position devient contraignante, et le temps passé dedans aggrave tout.',
    description: '0 = position confortable / 100 = angles contraignants tenus longtemps',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Position confortable',
    maxLabel: 'Position contraignante',
  },
  {
    id: 'robinet_frequence',
    element: 'robinet',
    type: 'scale',
    section: 'Fréquence et durée',
    question: 'La fréquence et la durée des efforts notables',
    subtitle:
      'Chronomètre en main : combien de fois l\u2019effort revient dans un cycle de travail, combien de temps il dure à chaque fois, et ce qu\u2019il reste comme récupération entre deux.',
    description: '0 = effort ponctuel / 100 = effort quasi continu, sans récupération',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Ponctuel',
    maxLabel: 'Quasi continu',
  },
  {
    id: 'robinet_charge_mentale',
    element: 'robinet',
    type: 'scale',
    section: 'Charge mentale',
    question: 'L\u2019effort mental que demande la tâche : attention, mémoire, décisions',
    subtitle:
      'Ça se mesure au niveau de concentration exigé, au nombre d\u2019informations à suivre en même temps, à la pression temporelle (cadence, délai à tenir), aux interruptions et aux conséquences d\u2019une erreur.',
    description: '0 = geste automatique / 100 = concentration permanente, erreurs lourdes de conséquences',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Geste automatique',
    maxLabel: 'Concentration permanente',
  },
  {
    id: 'robinet_rps',
    element: 'robinet',
    type: 'scale',
    section: 'Risques psychosociaux',
    question: 'Le contexte humain et organisationnel dans lequel vous travaillez',
    subtitle:
      'Ce qui pèse ici : les objectifs et délais imposés, la marge de manœuvre laissée sur la façon de faire, le soutien des collègues et de l\u2019encadrement, la reconnaissance du travail.',
    description: '0 = climat serein / 100 = tensions fortes, isolement',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Climat serein',
    maxLabel: 'Tensions, isolement',
  },
]

function readNumber(answers: AnswersMap, key: string): number | null {
  const raw = answers[key]
  return typeof raw === 'number' ? raw : null
}

function computeScore(answers: AnswersMap): number {
  const items = []

  for (const aspect of ROBINET_ASPECTS) {
    const value = readNumber(answers, aspect.questionId)
    if (value === null) continue
    const weight = readNumber(answers, aspect.weightKey) ?? DEFAULT_ASPECT_WEIGHT
    items.push({ value, weight })
  }

  return applyDirection(weightedQuadraticMean(items), 'negative')
}

export const robinetDefinition: ElementDefinition = {
  id: 'robinet',
  name: 'Robinet',
  emoji: '🚰',
  description: 'Charge de travail',
  questions,
  direction: 'negative',
  computeScore,
}
