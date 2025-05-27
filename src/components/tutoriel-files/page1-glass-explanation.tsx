"use client"

import { motion } from 'framer-motion'
import { TypeWriter } from "@/components/ui/typewriter"

interface GlassExplanationProps {
  onComplete: () => void
}

// Texte d'explication du verre
const glassExplanationText = `Dans cette première étape, nous allons comprendre comment fonctionne le verre et ce qu'il représente dans le contexte des TMS.

Le verre symbolise votre capacité à absorber les contraintes physiques et mentales. Sa taille varie en fonction de plusieurs facteurs personnels que vous pouvez ajuster.

Commençons par explorer ces facteurs :

1. <u>L'âge</u> : 
Plus on avance en âge, plus notre capacité naturelle d'absorption diminue. C'est normal, mais cela peut être compensé par d'autres facteurs.

2. <u>L'activité sportive</u> : 
Une pratique régulière renforce votre corps et augmente sa capacité à gérer les contraintes. Plus vous êtes actif, plus votre verre sera grand.

3. <u>L'alimentation</u> : 
Une bonne nutrition aide votre corps à récupérer et à maintenir sa capacité d'absorption. Une alimentation équilibrée agrandit votre verre.

4. <u>Le sommeil</u> : 
La qualité et la quantité de sommeil sont essentielles. Un bon repos permet à votre corps de se régénérer et maintient une bonne capacité d'absorption.

5. <u>Les antécédents médicaux</u> : 
Des problèmes de santé préexistants peuvent réduire votre capacité d'absorption. Il est important d'en tenir compte pour adapter votre activité.

Ajustez ces paramètres pour voir comment ils influencent la taille de votre verre. Un verre plus grand signifie une meilleure capacité à gérer les contraintes sans risque de TMS.`

export default function GlassExplanation({ onComplete }: GlassExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="prose prose-invert prose-headings:text-blue-400 prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={glassExplanationText}
          className="text-xl font-light text-white/90 leading-relaxed text-left whitespace-pre-line [&_u]:text-blue-400 [&_u]:font-medium"
          onComplete={() => setTimeout(onComplete, 500)}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
