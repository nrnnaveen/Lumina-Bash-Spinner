// Neon color palette for wheel segments
export const NEON_COLORS = [
  { bg: '#0a1e3d', border: '#00d4ff', text: '#00d4ff' },
  { bg: '#1a0a3d', border: '#b44fff', text: '#b44fff' },
  { bg: '#3d0a1e', border: '#ff2d78', text: '#ff2d78' },
  { bg: '#0a3d2e', border: '#00ff88', text: '#00ff88' },
  { bg: '#1e3d0a', border: '#aaff00', text: '#aaff00' },
  { bg: '#3d2a0a', border: '#ffaa00', text: '#ffaa00' },
  { bg: '#0a2e3d', border: '#00ffea', text: '#00ffea' },
  { bg: '#2e0a3d', border: '#dd44ff', text: '#dd44ff' },
  { bg: '#3d0a2e', border: '#ff4488', text: '#ff4488' },
  { bg: '#0a3d1e', border: '#44ff88', text: '#44ff88' },
  { bg: '#2a3d0a', border: '#ccff00', text: '#ccff00' },
  { bg: '#3d1a0a', border: '#ff6622', text: '#ff6622' },
]

export interface SpinnerSegment {
  name: string
  color: { bg: string; border: string; text: string }
  startAngle: number
  endAngle: number
  midAngle: number
}

export function buildSegments(names: string[]): SpinnerSegment[] {
  const count = names.length
  const anglePerSegment = 360 / count

  return names.map((name, i) => {
    const startAngle = i * anglePerSegment
    const endAngle = startAngle + anglePerSegment
    const midAngle = startAngle + anglePerSegment / 2
    const color = NEON_COLORS[i % NEON_COLORS.length]
    return { name, color, startAngle, endAngle, midAngle }
  })
}

export function getRandomSpin(names: string[]): { totalRotation: number; winnerIndex: number } {
  const winnerIndex = getRandomInt(names.length)
  const segmentAngle = 360 / names.length

  // Extra full rotations for drama (5–10)
  const extraSpins = (getRandomInt(6) + 5) * 360

  // The pointer is at top (270° offset in SVG polar coords)
  // We want winnerIndex segment center to land at top
  const targetAngle = 270 - (winnerIndex * segmentAngle + segmentAngle / 2)
  const normalizedTarget = ((targetAngle % 360) + 360) % 360

  const totalRotation = extraSpins + normalizedTarget

  return { totalRotation, winnerIndex }
}

function getRandomInt(max: number): number {
  if (max <= 0) return 0

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const range = 0x100000000
    const limit = Math.floor(range / max) * max
    const array = new Uint32Array(1)
    let value = 0

    do {
      crypto.getRandomValues(array)
      value = array[0]
    } while (value >= limit)

    return value % max
  }

  return Math.floor(Math.random() * max)
}

export function truncateName(name: string, maxLen: number = 12): string {
  return name.length > maxLen ? name.slice(0, maxLen - 1) + '…' : name
}

export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

// LocalStorage helpers
export const STORAGE_KEY = 'lumina-spinner-names'

export function loadNamesFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'string')) {
      return parsed
    }
    return []
  } catch {
    return []
  }
}

export function saveNamesToStorage(names: string[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names))
  } catch {
    // ignore storage errors
  }
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Audio helpers using Web Audio API
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }
  return audioContext
}

export function playTickSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04)
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
  } catch {
    // ignore audio errors
  }
}

export function playWinnerSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4)
      oscillator.start(ctx.currentTime + i * 0.12)
      oscillator.stop(ctx.currentTime + i * 0.12 + 0.5)
    })
  } catch {
    // ignore audio errors
  }
}
