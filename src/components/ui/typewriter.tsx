"use client"

import { useState, useEffect } from 'react'

interface TypeWriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  delay?: number
  isActive?: boolean
  dangerouslySetInnerHTML?: boolean
}

export function TypeWriter({ 
  text, 
  speed = 50, 
  className = "", 
  onComplete,
  delay = 0,
  isActive = true,
  dangerouslySetInnerHTML = false
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!isActive) return

    // Attendre le délai initial avant de commencer
    const initialDelay = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(initialDelay)
  }, [delay, isActive])

  useEffect(() => {
    if (!hasStarted || !isActive) return

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete, hasStarted, isActive])

  // Réinitialiser l'animation quand le texte change
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setHasStarted(false)
  }, [text])

  if (dangerouslySetInnerHTML) {
    return (
      <span 
        className={className}
        dangerouslySetInnerHTML={{ 
          __html: displayedText + (hasStarted && currentIndex < text.length ? '<span class="animate-pulse">|</span>' : '')
        }} 
      />
    )
  }

  return (
    <span className={className}>
      {displayedText}
      {hasStarted && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  )
}
