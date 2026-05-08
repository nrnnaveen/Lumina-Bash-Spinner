'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface WinnerModalProps {
  winner: string | null
  onClose: () => void
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const hasFired = useRef(false)

  useEffect(() => {
    if (winner && !hasFired.current) {
      hasFired.current = true
      fireConfetti()
    }
    if (!winner) {
      hasFired.current = false
    }
  }, [winner])

  const fireConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#00d4ff', '#b44fff', '#ff2d78', '#00ffea', '#ffd700', '#00ff88']

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors,
      shapes: ['circle', 'square'],
      ticks: 200,
    })

    // Side cannons
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        ticks: 150,
      })

      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        ticks: 150,
      })
    }, 150)
  }

  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center text-center glass-card-strong p-8 md:p-12 max-w-lg w-full winner-glow"
            style={{
              border: '2px solid rgba(255,215,0,0.5)',
            }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #ffd700, #ffaa00, #ff8800, #ffd700)' }}
            />

            {/* Trophy icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [-5, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>

            {/* Title */}
            <p
              className="font-display text-xs tracking-widest uppercase mb-3"
              style={{ color: 'rgba(255,215,0,0.7)' }}
            >
              ⚡ Selected for Lumina Bash ⚡
            </p>

            {/* Winner name */}
            <motion.h2
              className="font-display text-3xl md:text-4xl font-black mb-6 gradient-text-gold"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255,215,0,0.5)',
                  '0 0 50px rgba(255,215,0,0.9)',
                  '0 0 20px rgba(255,215,0,0.5)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {winner}
            </motion.h2>

            {/* Subtitle */}
            <p
              className="font-body text-base tracking-wide mb-8"
              style={{ color: 'rgba(224,234,255,0.7)' }}
            >
              Get ready to present! The wheel has spoken.
            </p>

            {/* Stars row */}
            <div className="flex gap-3 mb-8">
              {['✦', '★', '✦', '★', '✦'].map((s, i) => (
                <motion.span
                  key={i}
                  className="text-lg"
                  style={{ color: '#ffd700' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>

            {/* Dismiss button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="btn-spin px-8 py-3 font-display text-sm font-bold tracking-widest"
            >
              SPIN AGAIN
            </motion.button>

            <p className="mt-4 font-body text-xs" style={{ color: 'rgba(224,234,255,0.3)' }}>
              Click anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
