"use client"

import { motion } from 'framer-motion'
import { TypeWriter } from "@/components/ui/typewriter"

interface BubbleExplanationProps {
  onComplete: () => void
}

// Texte d'explication de la bulle
const bubbleExplanationText = `Maintenant, découvrons la bulle et son rôle dans le contexte des TMS.

La bulle représente votre environnement de travail. Les particules à l'intérieur symbolisent les contraintes environnementales qui peuvent affecter votre santé et votre bien-être au travail.

Examinons les facteurs environnementaux clés :

1. <u>La température</u> : 
Un environnement trop chaud ou trop froid augmente la fatigue et réduit la concentration. La température idéale se situe entre 19°C et 23°C pour un travail de bureau.

2. <u>L'éclairage</u> : 
Un éclairage inadéquat provoque fatigue visuelle et maux de tête. Un bon éclairage (environ 500 lux) est essentiel pour réduire la tension oculaire et les postures compensatoires.

3. <u>Le niveau sonore</u> : 
Le bruit constant augmente le stress et perturbe la concentration. Au-delà de 85 dB, une protection auditive devient nécessaire pour éviter des dommages.

4. <u>L'hygiène</u> : 
Un environnement sale ou insalubre peut causer des problèmes respiratoires et augmenter le stress. La propreté contribue à un environnement de travail sain.

5. <u>L'espace de travail</u> : 
Un espace exigu force des postures contraignantes. Un espace suffisant permet des mouvements naturels et réduit les tensions musculaires.

6. <u>Les équipements</u> : 
Des outils ou équipements mal adaptés augmentent les contraintes physiques. Des équipements ergonomiques réduisent les tensions et les efforts excessifs.

7. <u>Le travail de nuit</u> : 
Le travail nocturne perturbe le rythme circadien et augmente la fatigue. Il peut affecter la vigilance et la capacité à gérer les contraintes physiques.

Plus l'agitation dans la bulle est importante (score élevé), plus les contraintes environnementales sont fortes, augmentant le risque de TMS.`

export default function BubbleExplanation({ onComplete }: BubbleExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="prose prose-invert prose-headings:text-purple-400 prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={bubbleExplanationText}
          className="text-xl font-light text-white/90 leading-relaxed text-left whitespace-pre-line [&_u]:text-purple-400 [&_u]:font-medium"
          onComplete={() => setTimeout(onComplete, 500)}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
