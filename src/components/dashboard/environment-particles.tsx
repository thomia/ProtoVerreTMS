"use client"

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface EnvironmentParticlesProps {
  score: number // 0-100
  isPaused?: boolean
}

export function EnvironmentParticles({ score, isPaused = false }: EnvironmentParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Calculer le nombre de particules en fonction du score
  const getParticleCount = (score: number) => {
    return Math.round(score) // Exactement le même nombre que le score
  }

  // Calculer la vitesse des particules en fonction du score
  const getParticleSpeed = (score: number) => {
    // Convertir le score en multiplicateur de vitesse (1 à 10)
    const speedMultiplier = Math.floor(score / 10) + 1
    return speedMultiplier
  }

  // Fonction pour dessiner les particules sans les déplacer
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`
      ctx.fill()
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajuster la taille du canvas pour le rendre responsive
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialiser les particules
    const initParticles = () => {
      const particles: Particle[] = []
      const count = getParticleCount(score)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 2 * 0.85
      const speed = getParticleSpeed(score)

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * radius
        const directionAngle = Math.random() * Math.PI * 2
        
        particles.push({
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
          vx: Math.cos(directionAngle) * speed,
          vy: Math.sin(directionAngle) * speed,
          size: 3,
          opacity: 0.6
        })
      }

      particlesRef.current = particles
    }

    // Animer les particules
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 2 * 0.85

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Vérifier les collisions avec les bords du cercle
        const dx = particle.x - centerX
        const dy = particle.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > radius - particle.size) {
          // Calculer l'angle de réflexion
          const angle = Math.atan2(dy, dx)
          const normalX = Math.cos(angle)
          const normalY = Math.sin(angle)

          // Réflexion en conservant la vitesse actuelle
          const dotProduct = particle.vx * normalX + particle.vy * normalY
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
          particle.vx = (particle.vx - 2 * dotProduct * normalX)
          particle.vy = (particle.vy - 2 * dotProduct * normalY)

          // Normaliser et appliquer la vitesse actuelle
          const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
          particle.vx = (particle.vx / currentSpeed) * speed
          particle.vy = (particle.vy / currentSpeed) * speed

          // Replacer la particule sur le bord
          particle.x = centerX + (radius - particle.size) * Math.cos(angle)
          particle.y = centerY + (radius - particle.size) * Math.sin(angle)
        }
      })

      // Dessiner toutes les particules
      drawParticles(ctx)

      if (!isPaused) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // Gérer l'animation en fonction de l'état de pause
    if (isPaused) {
      // Si en pause, annuler l'animation en cours et dessiner une dernière fois
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawParticles(ctx)
      }
    } else {
      // Si pas en pause, démarrer/continuer l'animation
      initParticles()
      animate()
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [score, isPaused])

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
} 