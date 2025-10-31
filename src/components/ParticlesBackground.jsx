import React, { useEffect, useRef } from 'react'

/**
 * Optimized animated particles background component
 * @param {boolean} isDark - Whether dark mode is enabled
 */
const ParticlesBackground = React.memo(function ParticlesBackground({ isDark = true }) {
  const canvasRef = useRef(null)
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 40 // Reduced from 50
    const connectionDistance = 120 // Reduced for fewer calculations

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Slower = smoother
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      })
    }

    // Dynamic colors based on theme
    // Dark theme: Light blue particles on dark background
    // Light theme: Dark gray-blue particles on light background for better visibility
    const particleColor = isDark ? 'rgba(100, 149, 237, 0.5)' : 'rgba(49, 205, 34, 0.8)'
    const connectionBaseColor = isDark ? '100, 149, 237' : '49, 205, 100'
    const connectionOpacity = isDark ? 0.2 : 0.8

    let animationId

    function animate() {
      // Only render every 2 frames for better performance
      frameCountRef.current++
      if (frameCountRef.current % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw and update particles
        particles.forEach((particle) => {
          // Draw particle with theme-aware color
          ctx.fillStyle = particleColor
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Update position
          particle.x += particle.vx
          particle.y += particle.vy

          // Wrap around screen
          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < 0) particle.y = canvas.height
          if (particle.y > canvas.height) particle.y = 0
        })

        // Draw lines between nearby particles (optimized with squared distance)
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distanceSq = dx * dx + dy * dy

            if (distanceSq < connectionDistance * connectionDistance) {
              const distance = Math.sqrt(distanceSq)
              ctx.strokeStyle = `rgba(${connectionBaseColor}, ${
                connectionOpacity * (1 - distance / connectionDistance)
              })`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  )
})

export default ParticlesBackground
