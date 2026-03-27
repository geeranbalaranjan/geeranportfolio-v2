import { useEffect, useRef, useState } from 'react'
import useRoomStore from '../store/useRoomStore'

export default function ClickAnywhereOverlay() {
  const hasClickedAnywhere    = useRoomStore((s) => s.hasClickedAnywhere)
  const setHasClickedAnywhere = useRoomStore((s) => s.setHasClickedAnywhere)
  const setCameraState        = useRoomStore((s) => s.setCameraState)
  const [fading, setFading]   = useState(false)
  const mouseDownPos          = useRef(null)

  useEffect(() => {
    if (hasClickedAnywhere) return

    function onMouseDown(e) {
      mouseDownPos.current = { x: e.clientX, y: e.clientY }
    }

    function onMouseUp(e) {
      if (!mouseDownPos.current) return
      const dx = e.clientX - mouseDownPos.current.x
      const dy = e.clientY - mouseDownPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      // Only treat as a click (not a drag/orbit) if mouse barely moved
      if (dist < 5) {
        setFading(true)
        setTimeout(() => setHasClickedAnywhere(true), 500)
        setCameraState('monitor')
      }
      mouseDownPos.current = null
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [hasClickedAnywhere, setCameraState, setHasClickedAnywhere])

  if (hasClickedAnywhere) return null

  return (
    <>
      <style>{`
        @keyframes pulseText {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1.0; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '10vh',
          pointerEvents: 'none',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            color: 'white',
            fontSize: 'clamp(12px, 1.4vw, 16px)',
            animation: 'pulseText 2s ease-in-out infinite',
            userSelect: 'none',
            letterSpacing: '0.12em',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            padding: '10px 22px',
            borderRadius: '4px',
          }}
        >
          click anywhere to enter
        </div>
      </div>
    </>
  )
}
