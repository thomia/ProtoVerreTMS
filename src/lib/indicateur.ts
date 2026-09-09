/**
 * Indicateur LeVerre Labs — "temps avant débordement".
 *
 * Mesure abstraite, identique pour tous les participants (indépendante de la
 * vraie durée de leur tâche), afin d'être comparable et de montrer comment
 * chaque élément fait varier le risque. Un petit nombre de secondes = le verre
 * se remplit vite = situation à risque.
 *
 * La formule reprend exactement les constantes du remplissage visuel de
 * `src/components/modele/dashboard-simplified.tsx` (tick de 50 ms, soit 20
 * ticks/seconde), pour rester cohérente avec l'animation du verre :
 *   inflow  = (R/100) * 0.5
 *   outflow = (P/100) * 0.3
 *   envB    = 1 + (B/200)
 *   stormO  = 1 + (O/150)
 *   capaV   = 1.5 - (V/100)   (grand verre => se remplit plus lentement)
 *   netParSeconde = (inflow * envB * stormO - outflow) * capaV * 20
 *   temps = netParSeconde > 0 ? 100 / netParSeconde : null (aucun débordement)
 */

import type { ElementId, ParticipantScores } from './supabase/types'
import { ELEMENT_THEME } from './element-theme'

const TICKS_PER_SECOND = 20
const GLASS_CAPACITY = 100

/**
 * Calcule le temps (en secondes-modèle) avant que le verre déborde.
 * Retourne `null` si le verre ne déborde pas (récupération >= remplissage,
 * ou robinet pas encore renseigné) — d'où l'aspect "quand c'est possible".
 */
export function computeOverflowSeconds(scores: ParticipantScores): number | null {
  const v = scores.verre ?? 50
  const r = scores.robinet ?? 0
  const b = scores.bulle ?? 0
  const o = scores.orage ?? 0
  const p = scores.paille ?? 0

  const inflow = (r / 100) * 0.5
  const outflow = (p / 100) * 0.3
  const envB = 1 + b / 200
  const stormO = 1 + o / 150
  const capaV = 1.5 - v / 100

  const netParSeconde = (inflow * envB * stormO - outflow) * capaV * TICKS_PER_SECOND
  if (netParSeconde <= 0) return null

  return GLASS_CAPACITY / netParSeconde
}

/** Formate un temps (secondes) pour affichage : `42 s`, `1 min 20 s`, ou `∞`. */
export function formatOverflowSeconds(seconds: number | null): string {
  if (seconds === null) return '∞'
  const rounded = Math.round(seconds)
  if (rounded < 60) return `${rounded} s`
  const min = Math.floor(rounded / 60)
  const rest = rounded % 60
  return rest === 0 ? `${min} min` : `${min} min ${rest} s`
}

export interface FilRougePoint {
  element: ElementId
  label: string
  /** `false` tant que cet élément (ou un précédent) n'a pas été renseigné. */
  isRenseigne: boolean
  /** Temps avant débordement à ce stade, null si non renseigné ou pas de débordement. */
  seconds: number | null
}

/**
 * Série "fil rouge" : évolution de l'indicateur à mesure que les éléments
 * s'ajoutent, dans l'ordre Robinet → Bulle → Orage → Paille (le Verre fixe la
 * taille du verre et s'applique dès le départ). Sert de support au récap
 * formateur pour repérer l'élément qui fait basculer le modèle.
 *
 * La série s'arrête au dernier élément renseigné : les stades suivants
 * ressortent à `null` plutôt que d'être calculés avec un score par défaut,
 * ce qui ferait croire que l'élément a été joué sans rien changer.
 */
export function computeFilRougeSeries(scores: ParticipantScores): FilRougePoint[] {
  const order: ElementId[] = ['robinet', 'bulle', 'orage', 'paille']
  const acc: ParticipantScores = { verre: scores.verre }
  const points: FilRougePoint[] = []
  let isRenseigne = true

  for (const element of order) {
    const score = scores[element]
    if (score === undefined) isRenseigne = false
    else acc[element] = score

    points.push({
      element,
      label: ELEMENT_THEME[element].name,
      isRenseigne,
      seconds: isRenseigne ? computeOverflowSeconds(acc) : null,
    })
  }

  return points
}
