declare module 'canvas-confetti' {
  interface ConfettiOptions {
    [key: string]: unknown
  }

  type Confetti = (options?: ConfettiOptions) => Promise<void> | void

  const confetti: Confetti

  export default confetti
}
