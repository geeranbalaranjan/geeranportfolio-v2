import { useEffect } from 'react'
import useRoomStore from './store/useRoomStore'
import LoadingScreen from './components/LoadingScreen'
import Scene3D from './components/Scene3D'
import ClickAnywhereOverlay from './components/ClickAnywhereOverlay'
import MonitorUI from './components/MonitorUI'

// ── Back / Escape button ─────────────────────────────────────────────────────
function BackButton() {
  const cameraState           = useRoomStore((s) => s.cameraState)
  const setCameraState        = useRoomStore((s) => s.setCameraState)
  const sceneMode             = useRoomStore((s) => s.sceneMode)
  const setSceneMode          = useRoomStore((s) => s.setSceneMode)
  const setHasClickedAnywhere = useRoomStore((s) => s.setHasClickedAnywhere)

  function goBack() {
    if (sceneMode === 'ui-open') {
      setSceneMode('exploring')
      return
    }
    if (cameraState === 'monitor' || cameraState === 'desk') {
      setCameraState('room')
      setHasClickedAnywhere(false)
      return
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') goBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }) // no deps — always reads latest cameraState via closure

  const visible = cameraState !== 'room' || sceneMode === 'ui-open'

  return (
    <button
      onClick={goBack}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 50,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.18)',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '7px 14px',
        borderRadius: '4px',
        backdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      ← back
    </button>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const sceneMode         = useRoomStore((s) => s.sceneMode)
  const hasClickedAnywhere = useRoomStore((s) => s.hasClickedAnywhere)

  if (sceneMode === 'loading') {
    return <LoadingScreen />
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* 1. 3D canvas — z-index 0, fills viewport */}
      <Scene3D />

      {/* 2. "Click anywhere to enter" — z-index 100, transparent bg, removed after first click */}
      {!hasClickedAnywhere && <ClickAnywhereOverlay />}

      {/* 3. Monitor UI — z-index 10, DOM overlay (not inside Canvas to avoid WebGL compositing) */}
      <MonitorUI />

      {/* 4. Back button — z-index 50, fixed top-left, fades in when not at room view */}
      <BackButton />

    </div>
  )
}
