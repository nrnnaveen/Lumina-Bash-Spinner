'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { shuffleArray } from '@/utils/spinnerUtils'

interface NameManagerProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  disabled: boolean
}

export default function NameManager({ names, onNamesChange, disabled }: NameManagerProps) {
  const [input, setInput] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editIndex !== null && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editIndex])

  const addName = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      toast.error('Name cannot be empty!')
      return
    }
    if (names.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Name already exists!')
      return
    }
    if (names.length >= 20) {
      toast.error('Maximum 20 names allowed!')
      return
    }
    onNamesChange([...names, trimmed])
    setInput('')
    inputRef.current?.focus()
    toast.success(`${trimmed} added!`, {
      icon: '✦',
      style: { borderColor: 'rgba(0, 255, 136, 0.4)' },
    })
  }

  const removeName = (i: number) => {
    const removed = names[i]
    onNamesChange(names.filter((_, idx) => idx !== i))
    toast(`${removed} removed`, {
      icon: '✕',
    })
  }

  const startEdit = (i: number) => {
    setEditIndex(i)
    setEditValue(names[i])
  }

  const commitEdit = () => {
    if (editIndex === null) return
    const trimmed = editValue.trim()
    if (!trimmed) {
      toast.error('Name cannot be empty!')
      return
    }
    if (
      names.some((n, idx) => idx !== editIndex && n.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error('Name already exists!')
      return
    }
    const updated = [...names]
    updated[editIndex] = trimmed
    onNamesChange(updated)
    setEditIndex(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setEditValue('')
  }

  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addName()
  }

  const handleEditKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const handleShuffle = () => {
    onNamesChange(shuffleArray(names))
    toast('Names shuffled!', { icon: '🔀' })
  }

  const handleReset = () => {
    onNamesChange([])
    toast('All names cleared!', { icon: '🗑' })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKey}
          placeholder="Enter a name..."
          disabled={disabled}
          maxLength={30}
          className="neon-input flex-1 px-4 py-2.5 text-base"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addName}
          disabled={disabled || !input.trim()}
          className="px-4 py-2.5 rounded-xl font-display text-xs font-bold tracking-widest uppercase transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))',
            border: '1px solid rgba(0,212,255,0.5)',
            color: '#00d4ff',
            boxShadow: '0 0 10px rgba(0,212,255,0.2)',
            opacity: disabled || !input.trim() ? 0.4 : 1,
            cursor: disabled || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          ADD
        </motion.button>
      </div>

      {/* Name count + action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-xs px-2 py-1 rounded-md"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
            }}
          >
            {names.length} / 20
          </span>
          {names.length < 2 && (
            <span className="font-body text-xs" style={{ color: 'rgba(255,170,0,0.8)' }}>
              Add {2 - names.length} more to spin
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShuffle}
            disabled={disabled || names.length < 2}
            title="Shuffle names"
            className="px-3 py-1.5 rounded-lg font-body text-xs tracking-wide transition-all"
            style={{
              background: 'rgba(180,79,255,0.1)',
              border: '1px solid rgba(180,79,255,0.3)',
              color: '#b44fff',
              opacity: disabled || names.length < 2 ? 0.3 : 1,
              cursor: disabled || names.length < 2 ? 'not-allowed' : 'pointer',
            }}
          >
            ⇄ Shuffle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            disabled={disabled || names.length === 0}
            title="Clear all names"
            className="px-3 py-1.5 rounded-lg font-body text-xs tracking-wide transition-all"
            style={{
              background: 'rgba(255,45,120,0.1)',
              border: '1px solid rgba(255,45,120,0.3)',
              color: '#ff2d78',
              opacity: disabled || names.length === 0 ? 0.3 : 1,
              cursor: disabled || names.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ✕ Clear All
          </motion.button>
        </div>
      </div>

      {/* Names list */}
      <div
        className="flex flex-col gap-1.5 overflow-y-auto pr-1"
        style={{ maxHeight: '280px', minHeight: names.length === 0 ? '80px' : 'auto' }}
      >
        {names.length === 0 ? (
          <div
            className="flex items-center justify-center h-20 rounded-xl"
            style={{
              border: '1px dashed rgba(0,212,255,0.2)',
              color: 'rgba(0,212,255,0.4)',
            }}
          >
            <p className="font-body text-sm tracking-wide">No names yet — add some above!</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {names.map((name, i) => (
              <motion.div
                key={`${name}-${i}`}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="name-tag flex items-center gap-2 px-3 py-2"
              >
                {/* Index badge */}
                <span
                  className="font-mono text-xs min-w-[20px] text-center"
                  style={{ color: 'rgba(0,212,255,0.5)' }}
                >
                  {i + 1}
                </span>

                {editIndex === i ? (
                  /* Edit mode */
                  <div className="flex flex-1 gap-1.5 items-center">
                    <input
                      ref={editRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKey}
                      onBlur={commitEdit}
                      maxLength={30}
                      className="neon-input flex-1 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={commitEdit}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ background: 'rgba(255,45,120,0.15)', color: '#ff2d78', border: '1px solid rgba(255,45,120,0.3)' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <span className="flex-1 font-body text-sm tracking-wide truncate" style={{ color: '#e0eaff' }}>
                      {name}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(i)}
                        disabled={disabled}
                        title="Edit name"
                        className="text-xs px-2 py-1 rounded-md transition-all hover:bg-blue-500/20"
                        style={{ color: 'rgba(0,212,255,0.6)' }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => removeName(i)}
                        disabled={disabled}
                        title="Remove name"
                        className="text-xs px-2 py-1 rounded-md transition-all hover:bg-red-500/20"
                        style={{ color: 'rgba(255,45,120,0.6)' }}
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
