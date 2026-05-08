declare module 'canvas-confetti' {
  interface ConfettiOptions {
    [key: string]: unknown
  }

  type Confetti = (options?: ConfettiOptions) => Promise<null> | null

  const confetti: Confetti

  export default confetti
}
