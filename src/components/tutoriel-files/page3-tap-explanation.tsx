"use client"

import { motion } from 'framer-motion'
import { TypeWriter } from "@/components/ui/typewriter"

interface TapExplanationProps {
  onComplete: () => void
}

// Texte d'explication du robinet
const tapExplanationText = `Maintenant que nous comprenons le verre, observons son interaction avec le robinet.

Le robinet représente l'intensité des contraintes qui s'appliquent sur votre corps. Plus le débit est élevé, plus les contraintes sont importantes.

Points clés à retenir :

1. Si le débit du robinet (les contraintes) est supérieur à la capacité de votre verre (votre capacité d'absorption), il y a un risque de débordement, ce qui représente un risque de TMS.

2. Un petit verre avec un faible débit peut être aussi sain qu'un grand verre avec un fort débit. L'important est l'équilibre entre les deux.

3. Vous pouvez agir sur les deux aspects :
   - Augmenter la taille de votre verre en améliorant vos facteurs personnels
   - Réduire le débit en adaptant vos conditions de travail

Essayez différentes combinaisons pour comprendre comment maintenir un équilibre sain entre contraintes et capacité d'absorption.`

export default function TapExplanation({ onComplete }: TapExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="prose prose-invert prose-headings:text-blue-400 prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={tapExplanationText}
          className="text-xl font-light text-white/90 leading-relaxed text-left whitespace-pre-line [&_u]:text-blue-400 [&_u]:font-medium"
          onComplete={() => setTimeout(onComplete, 500)}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
