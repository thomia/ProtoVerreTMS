"use client"

import { TypeWriter } from "@/components/ui/typewriter"
import { tutorialExplanations } from '@/data/tutorial-explanations'
import { motion } from 'framer-motion'

interface GlassExplanationProps {
  onComplete: () => void
}

export default function GlassExplanation({ onComplete }: GlassExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="prose prose-invert prose-headings:text-blue-400 prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={tutorialExplanations.glass.intro}
          className="text-2xl font-light text-white/90 leading-relaxed text-center whitespace-pre-line [&_u]:text-blue-400 [&_u]:font-medium"
          onComplete={() => setTimeout(onComplete, 1000)}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
