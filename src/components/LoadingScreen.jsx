import { useState, useEffect } from 'react'
import useRoomStore from '../store/useRoomStore'

const BOOT_LINES = [
  '> Initialising room...',
  '> Loading assets...',
  '> Mounting textures...',
  '> Calibrating lighting...',
  '> Booting portfolio...',
  '> Ready.',
]

export default function LoadingScreen() {
  const setSceneMode = useRoomStore((s) => s.setSceneMode)
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let lineIndex = 0
    const lineInterval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[lineIndex]])
        lineIndex++
      } else {
        clearInterval(lineInterval)
      }
    }, 450)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    const timer = setTimeout(() => {
      setSceneMode('exploring')
    }, 3500)

    return () => {
      clearInterval(lineInterval)
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [setSceneMode])

  return (
    <div style={styles.overlay}>
      <div style={styles.terminal}>
        <div style={styles.header}>PORTFOLIO_OS v2.0 — BOOT SEQUENCE</div>
        <div style={styles.log}>
          {lines.map((line, i) => (
            <div key={i} style={styles.line}>
              {line}
            </div>
          ))}
          {lines.length < BOOT_LINES.length && (
            <span style={styles.cursor}>█</span>
          )}
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.progressLabel}>{progress}%</div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#1A1020',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  terminal: {
    width: '480px',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#39ff14',
    padding: '32px',
    border: '1px solid #39ff1440',
    background: '#0d0d0d',
    borderRadius: '4px',
  },
  header: {
    fontSize: '12px',
    color: '#39ff1499',
    marginBottom: '24px',
    letterSpacing: '2px',
  },
  log: {
    minHeight: '160px',
    marginBottom: '24px',
  },
  line: {
    fontSize: '14px',
    lineHeight: '1.8',
    opacity: 0.9,
  },
  cursor: {
    fontSize: '14px',
    animation: 'none',
  },
  progressBar: {
    height: '4px',
    background: '#1a1a1a',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: '#39ff14',
    transition: 'width 0.06s linear',
  },
  progressLabel: {
    fontSize: '11px',
    color: '#39ff1466',
    textAlign: 'right',
    letterSpacing: '1px',
  },
}
