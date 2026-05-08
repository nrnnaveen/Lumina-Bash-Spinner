'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex items-center gap-4 mb-2"
      >
        {/* Animated hex logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative"
          style={{ width: 48, height: 48 }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#b44fff" />
                <stop offset="100%" stopColor="#ff2d78" />
              </linearGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="24,2 44,13 44,35 24,46 4,35 4,13"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="2"
              filter="url(#logoGlow)"
            />
            <polygon
              points="24,8 38,16 38,32 24,40 10,32 10,16"
              fill="rgba(0,212,255,0.05)"
              stroke="url(#logoGrad)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle cx="24" cy="24" r="4" fill="url(#logoGrad)" filter="url(#logoGlow)" />
          </svg>
        </motion.div>

        <div>
          <motion.h1
            className="font-display font-black tracking-tight leading-none"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}
          >
            <span className="gradient-text">LUMINA</span>
          </motion.h1>
          <motion.p
            className="font-display text-xs tracking-widest uppercase mt-0.5"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            Weekly Bash Spinner
          </motion.p>
        </div>
      </motion.div>

      {/* Divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full max-w-md h-px mt-2"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(180,79,255,0.5), transparent)',
        }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="font-body text-sm mt-3 text-center tracking-wide"
        style={{ color: 'rgba(224,234,255,0.5)' }}
      >
        Add your team · Spin the wheel · Pick a speaker
      </motion.p>
    </header>
  )
}
