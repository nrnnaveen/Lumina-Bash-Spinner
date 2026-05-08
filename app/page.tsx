'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

import ParticleBackground from '@/components/ParticleBackground'
import SpinnerWheel from '@/components/SpinnerWheel'
import NameManager from '@/components/NameManager'
import WinnerModal from '@/components/WinnerModal'
import Header from '@/components/Header'

import {
  getRandomSpin,
  loadNamesFromStorage,
  saveNamesToStorage,
  playWinnerSound,
} from '@/utils/spinnerUtils'

const DEFAULT_NAMES = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
const MAX_PARTICIPANTS = 30

export default function HomePage() {
  const [names, setNames] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = loadNamesFromStorage()
    if (stored.length >= 2) {
      setNames(stored)
    } else {
      setNames(DEFAULT_NAMES)
    }
  }, [])

  // Save to localStorage when names change
  useEffect(() => {
    if (mounted) {
      saveNamesToStorage(names)
    }
  }, [names, mounted])

  const handleNamesChange = useCallback((newNames: string[]) => {
    setNames(newNames)
    // Reset winner if active name was removed
    if (winnerIndex !== null && winnerIndex >= newNames.length) {
      setWinnerIndex(null)
    }
  }, [winnerIndex])

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    if (names.length === 0) {
      toast.error('Add at least 1 name to spin!', {
        icon: '⚠️',
      })
      return
    }

    const { totalRotation, winnerIndex: wi } = getRandomSpin(names)
    setWinnerIndex(null)
    setWinner(null)
    setIsSpinning(true)
    setRotation(totalRotation)

    toast('Spinning! 🌀', {
      duration: 1500,
      style: { borderColor: 'rgba(0,212,255,0.5)' },
    })

    // Store winner for reveal after spin
    ;(window as unknown as { _pendingWinner: number })._pendingWinner = wi
  }, [isSpinning, names])

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false)
    setWinnerIndex(null)
    const wi = (window as unknown as { _pendingWinner: number })._pendingWinner
    const winnerName = names[wi]
    if (typeof winnerName !== 'string') {
      return
    }
    setWinner(winnerName)
    setNames((prev) => prev.filter((_, idx) => idx !== wi))

    setTimeout(() => {
      playWinnerSound()
      setShowWinnerModal(true)
    }, 500)
  }, [names])

  const handleCloseWinner = useCallback(() => {
    setShowWinnerModal(false)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020408' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: '#00d4ff', borderRightColor: '#b44fff' }}
        />
      </div>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#020408' }}>
      {/* Background layers */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(180,79,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 20% 80%, rgba(255,45,120,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Animated grid lines */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <ParticleBackground />

      {/* Scan line effect */}
      <div className="scanline" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <Header />

        {/* Main content grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 flex flex-col lg:flex-row gap-6 items-start justify-center"
        >
          {/* Left panel: Name Manager */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card-strong p-5 w-full lg:w-80 xl:w-96 flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.8)' }}
              />
              <h2 className="font-display text-xs tracking-widest uppercase" style={{ color: '#00d4ff' }}>
                Team Members
              </h2>
            </div>

            <NameManager
              names={names}
              onNamesChange={handleNamesChange}
              disabled={isSpinning}
            />
          </motion.div>

          {/* Center: Wheel + controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-6 flex-1 w-full"
          >
            {/* Wheel container */}
            <div
              className="relative flex w-full max-w-[500px] flex-col items-center p-3 sm:p-6 rounded-3xl"
              style={{
                background: 'rgba(6,13,22,0.6)',
                border: '1px solid rgba(0,212,255,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <SpinnerWheel
                names={names}
                isSpinning={isSpinning}
                rotation={rotation}
                winnerIndex={winnerIndex}
                onSpinComplete={handleSpinComplete}
              />

              {/* Winner banner (inline, below wheel) */}
              <AnimatePresence>
                {winner && !isSpinning && !showWinnerModal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="mt-4 px-6 py-3 rounded-2xl text-center"
                    style={{
                      background: 'rgba(255,215,0,0.08)',
                      border: '1px solid rgba(255,215,0,0.3)',
                    }}
                  >
                    <p className="font-display text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,215,0,0.6)' }}>
                      Selected
                    </p>
                    <p className="font-display text-xl font-bold gradient-text-gold">
                      {winner}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Spin button + secondary controls */}
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <motion.button
                whileHover={{ scale: isSpinning ? 1 : 1.04 }}
                whileTap={{ scale: isSpinning ? 1 : 0.97 }}
                onClick={handleSpin}
                disabled={isSpinning || names.length === 0}
                className="btn-spin w-full py-4 text-base"
                style={{
                  fontSize: '0.9rem',
                  letterSpacing: '0.15em',
                }}
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      ◎
                    </motion.span>
                    SPINNING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    ⚡ SPIN THE WHEEL
                  </span>
                )}
              </motion.button>

              {/* Status bar */}
              <div
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl"
                style={{
                  background: 'rgba(0,20,40,0.6)',
                  border: '1px solid rgba(0,212,255,0.1)',
                }}
              >
                <StatusDot active={names.length > 0} />
                <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.7)' }}>
                  {isSpinning
                    ? 'SPINNING...'
                    : names.length === 0
                    ? 'ADD NAMES TO SPIN'
                    : `READY · ${names.length} PARTICIPANTS`}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right panel: Stats / Recent */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card-strong p-5 w-full lg:w-72 xl:w-80 flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#b44fff', boxShadow: '0 0 8px rgba(180,79,255,0.8)' }}
              />
              <h2 className="font-display text-xs tracking-widest uppercase" style={{ color: '#b44fff' }}>
                Session Info
              </h2>
            </div>

            <SessionInfo names={names} winner={winner} />
          </motion.div>
        </motion.div>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        winner={showWinnerModal ? winner : null}
        onClose={handleCloseWinner}
      />
    </main>
  )
}

// Status indicator dot
function StatusDot({ active }: { active: boolean }) {
  return (
    <motion.div
      animate={active ? { opacity: [1, 0.4, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{
        background: active ? '#00ff88' : '#ff2d78',
        boxShadow: active ? '0 0 8px rgba(0,255,136,0.8)' : '0 0 8px rgba(255,45,120,0.8)',
      }}
    />
  )
}

// Session info panel
function SessionInfo({ names, winner }: { names: string[]; winner: string | null }) {
  const stats = [
    { label: 'Participants', value: names.length.toString(), color: '#00d4ff' },
    { label: 'Min to Spin', value: '1', color: '#b44fff' },
    { label: 'Max Names', value: MAX_PARTICIPANTS.toString(), color: '#ff2d78' },
    { label: 'Current Winner', value: winner ?? '—', color: '#ffd700' },
  ]

  return (
    <div className="flex flex-col gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-between py-2 px-3 rounded-xl"
          style={{ background: 'rgba(0,20,40,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="font-body text-xs tracking-wide" style={{ color: 'rgba(224,234,255,0.5)' }}>
            {s.label}
          </span>
          <span
            className="font-mono text-xs font-bold truncate max-w-[120px] text-right"
            style={{ color: s.color }}
          >
            {s.value}
          </span>
        </div>
      ))}

      {/* Instructions */}
      <div
        className="mt-4 p-3 rounded-xl"
        style={{
          background: 'rgba(0,212,255,0.04)',
          border: '1px solid rgba(0,212,255,0.1)',
        }}
      >
        <p className="font-display text-xs tracking-wider mb-2" style={{ color: 'rgba(0,212,255,0.6)' }}>
          HOW TO USE
        </p>
        {[
          '1. Add team member names',
          '2. Click ⚡ SPIN THE WHEEL',
          '3. Wait for the result',
          '4. Winner presents first!',
        ].map((step) => (
          <p key={step} className="font-body text-xs leading-relaxed mt-1" style={{ color: 'rgba(224,234,255,0.45)' }}>
            {step}
          </p>
        ))}
      </div>

      {/* Tech stack badge */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['Next.js 14', 'TypeScript', 'Framer Motion', 'Tailwind'].map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2 py-0.5 rounded-md"
            style={{
              background: 'rgba(180,79,255,0.1)',
              border: '1px solid rgba(180,79,255,0.2)',
              color: 'rgba(180,79,255,0.7)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
