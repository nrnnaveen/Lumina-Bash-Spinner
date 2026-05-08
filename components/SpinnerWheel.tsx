'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import {
  buildSegments,
  describeArc,
  polarToCartesian,
  truncateName,
  playTickSound,
} from '@/utils/spinnerUtils'

interface SpinnerWheelProps {
  names: string[]
  isSpinning: boolean
  rotation: number
  winnerIndex: number | null
  onSpinComplete: () => void
}

const SIZE = 380
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE / 2 - 10
const INNER_R = 40

export default function SpinnerWheel({
  names,
  isSpinning,
  rotation,
  winnerIndex,
  onSpinComplete,
}: SpinnerWheelProps) {
  const controls = useAnimation()
  const prevRotation = useRef(0)
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [displayRotation, setDisplayRotation] = useState(0)

  const segments = buildSegments(names)

  useEffect(() => {
    if (!isSpinning) return

    // Tick sound simulation
    let tickCount = 0
    const totalDuration = 4000 // ms
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / totalDuration
      if (progress >= 1) {
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
        return
      }
      // Tick faster at start, slower at end
      const speed = Math.max(50, progress * 500)
      tickCount++
      if (tickCount % Math.max(1, Math.floor(speed / 50)) === 0) {
        playTickSound()
      }
    }

    tickIntervalRef.current = setInterval(tick, 50)

    // Animate rotation
    controls
      .start({
        rotate: prevRotation.current + rotation,
        transition: {
          duration: 4,
          ease: [0.25, 0.1, 0.05, 1.0], // Custom cubic bezier for dramatic ease-out
        },
      })
      .then(() => {
        prevRotation.current = prevRotation.current + rotation
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
        onSpinComplete()
      })

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, rotation])

  if (names.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: SIZE,
          height: SIZE,
          background: 'rgba(6,13,22,0.8)',
          border: '2px solid rgba(0,212,255,0.2)',
        }}
      >
        <p className="font-display text-xs text-center px-8" style={{ color: 'rgba(0,212,255,0.5)' }}>
          ADD NAMES<br />TO SPIN
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE + 60, height: SIZE + 60 }}>
      {/* Outer glow rings */}
      <div
        className="absolute rounded-full"
        style={{
          width: SIZE + 40,
          height: SIZE + 40,
          border: '1px solid rgba(0,212,255,0.15)',
          boxShadow: isSpinning
            ? '0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(180,79,255,0.2)'
            : '0 0 20px rgba(0,212,255,0.15)',
          transition: 'box-shadow 0.5s ease',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: SIZE + 20,
          height: SIZE + 20,
          border: '1px solid rgba(180,79,255,0.15)',
        }}
      />

      {/* Pointer (top) */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
      >
        <div className="spinner-pointer" />
      </div>

      {/* Spinning wheel */}
      <motion.div
        animate={controls}
        style={{
          width: SIZE,
          height: SIZE,
          transformOrigin: 'center center',
        }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Radial gradient for each segment overlay */}
            <radialGradient id="segOverlay" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="black" stopOpacity="0.2" />
            </radialGradient>

            {/* Center hub gradient */}
            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a3a5c" />
              <stop offset="100%" stopColor="#060d16" />
            </radialGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Winner glow filter */}
            <filter id="winnerGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle cx={CX} cy={CY} r={R} fill="#060d16" />

          {/* Segments */}
          {segments.map((seg, i) => {
            const isWinner = winnerIndex === i && !isSpinning
            const path = describeArc(CX, CY, R, seg.startAngle, seg.endAngle)

            return (
              <g key={`${seg.name}-${i}`} filter={isWinner ? 'url(#winnerGlow)' : undefined}>
                {/* Main segment */}
                <path
                  d={path}
                  fill={isWinner ? '#1a1a00' : seg.color.bg}
                  stroke={isWinner ? '#ffd700' : seg.color.border}
                  strokeWidth={isWinner ? 2.5 : 1.5}
                  style={{
                    transition: 'fill 0.4s, stroke 0.4s',
                  }}
                />

                {/* Highlight overlay */}
                <path d={path} fill="url(#segOverlay)" />

                {/* Label text */}
                <SegmentLabel
                  cx={CX}
                  cy={CY}
                  r={R}
                  seg={seg}
                  total={segments.length}
                  isWinner={isWinner}
                />
              </g>
            )
          })}

          {/* Outer ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="2"
          />

          {/* Tick marks on outer ring */}
          {segments.map((seg, i) => {
            const pt = polarToCartesian(CX, CY, R - 2, seg.startAngle)
            const pt2 = polarToCartesian(CX, CY, R - 14, seg.startAngle)
            return (
              <line
                key={`tick-${i}`}
                x1={pt.x}
                y1={pt.y}
                x2={pt2.x}
                y2={pt2.y}
                stroke="rgba(0,212,255,0.6)"
                strokeWidth="2"
              />
            )
          })}

          {/* Inner circle (hub) */}
          <circle cx={CX} cy={CY} r={INNER_R} fill="url(#hubGrad)" />
          <circle
            cx={CX}
            cy={CY}
            r={INNER_R}
            fill="none"
            stroke="rgba(0,212,255,0.6)"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Hub icon / text */}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: '700',
              fill: '#00d4ff',
              letterSpacing: '0.05em',
            }}
          >
            LUMINA
          </text>
          <text
            x={CX}
            y={CY + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7px',
              fontWeight: '500',
              fill: 'rgba(0,212,255,0.6)',
              letterSpacing: '0.1em',
            }}
          >
            BASH
          </text>

          {/* Spinning glow overlay (only when spinning) */}
          {isSpinning && (
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(0,212,255,0.15)"
              strokeWidth="20"
              filter="url(#glow)"
            />
          )}
        </svg>
      </motion.div>
    </div>
  )
}

// Sub-component for segment label
function SegmentLabel({
  cx,
  cy,
  r,
  seg,
  total,
  isWinner,
}: {
  cx: number
  cy: number
  r: number
  seg: ReturnType<typeof buildSegments>[0]
  total: number
  isWinner: boolean
}) {
  const labelR = total <= 4 ? r * 0.65 : total <= 8 ? r * 0.7 : r * 0.72
  const pt = polarToCartesian(cx, cy, labelR, seg.midAngle)
  const rotateDeg = seg.midAngle - 90

  const maxLen = total <= 4 ? 14 : total <= 8 ? 10 : 8
  const display = truncateName(seg.name, maxLen)
  const fontSize = total <= 4 ? 13 : total <= 8 ? 11 : 9

  return (
    <text
      x={pt.x}
      y={pt.y}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`rotate(${rotateDeg}, ${pt.x}, ${pt.y})`}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${fontSize}px`,
        fontWeight: '600',
        fill: isWinner ? '#ffd700' : 'white',
        letterSpacing: '0.04em',
        textShadow: isWinner ? '0 0 10px rgba(255,215,0,0.8)' : '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {display}
    </text>
  )
}
