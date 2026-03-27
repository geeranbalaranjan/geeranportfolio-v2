import { useEffect, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useRoomStore from '../store/useRoomStore'

// Projects intro-card-anchor's 3D bounding box to 2D screen coords every frame.
// Runs at all times so the overlay always tracks the monitor screen.
const _box = new THREE.Box3()
const _v   = new THREE.Vector3()

// Convex hull via gift wrapping (Jarvis march) — works fine for ≤8 points
function convexHull(pts) {
  if (pts.length < 3) return pts
  let start = 0
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x < pts[start].x || (pts[i].x === pts[start].x && pts[i].y < pts[start].y))
      start = i
  }
  const hull = []
  let cur = start
  do {
    hull.push(pts[cur])
    let next = (cur + 1) % pts.length
    for (let i = 0; i < pts.length; i++) {
      const cross =
        (pts[next].x - pts[cur].x) * (pts[i].y - pts[cur].y) -
        (pts[next].y - pts[cur].y) * (pts[i].x - pts[cur].x)
      if (cross < 0) next = i
    }
    cur = next
  } while (cur !== start && hull.length <= pts.length)
  return hull
}

function MonitorBoundsTracker({ scene }) {
  const camera                 = useThree(s => s.camera)
  const gl                     = useThree(s => s.gl)
  const setMonitorScreenBounds = useRoomStore(s => s.setMonitorScreenBounds)
  const prev                   = useRef(null)

  useFrame(() => {
    const mesh = scene.getObjectByName('intro-card-anchor')
    if (!mesh) return
    _box.setFromObject(mesh)
    if (_box.isEmpty()) return

    const w = gl.domElement.clientWidth
    const h = gl.domElement.clientHeight
    const corners = [
      [_box.min.x, _box.min.y, _box.min.z], [_box.max.x, _box.min.y, _box.min.z],
      [_box.min.x, _box.max.y, _box.min.z], [_box.max.x, _box.max.y, _box.min.z],
      [_box.min.x, _box.min.y, _box.max.z], [_box.max.x, _box.min.y, _box.max.z],
      [_box.min.x, _box.max.y, _box.max.z], [_box.max.x, _box.max.y, _box.max.z],
    ]
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    const screenPts = []
    for (const [x, y, z] of corners) {
      _v.set(x, y, z).project(camera)
      const px = (_v.x *  0.5 + 0.5) * w
      const py = (_v.y * -0.5 + 0.5) * h
      if (px < minX) minX = px
      if (px > maxX) maxX = px
      if (py < minY) minY = py
      if (py > maxY) maxY = py
      screenPts.push({ x: px, y: py })
    }

    // Only push to store when bounds change by >1px to avoid thrashing renders
    const p = prev.current
    if (!p ||
        Math.abs(p.left - minX) > 1 || Math.abs(p.top - minY) > 1 ||
        Math.abs(p.width - (maxX - minX)) > 1 || Math.abs(p.height - (maxY - minY)) > 1) {
      const hull = convexHull(screenPts)
      // Store hull points relative to the bounding rect's top-left corner
      const clipPoints = hull.map(pt => ({ x: pt.x - minX, y: pt.y - minY }))
      const b = { left: minX, top: minY, width: maxX - minX, height: maxY - minY, clipPoints }
      prev.current = b
      setMonitorScreenBounds(b)
    }
  })
  return null
}

useGLTF.preload('/portfolio-room.optimized.glb')

// ── Scene mesh inventory (from: gltf-transform inspect portfolio-room.optimized.glb)
//
//   one-piece.001                 material: one-piece        → easter egg (figurine)
//   Mesh_0                        material: Material_0       → static (main room bake)
//   Plane.000_Material.001_0.001  material: Material.005     → static (floor/wall plane)
//   Object_12                     material: base_cama        → bed (generic click)
//   Object_8                      material: PaletteMaterial  → prop
//   Object_1                      material: PaletteMaterial  → prop
//   Object_0                      material: PaletteMaterial  → prop
//   Object_32                     material: pcinsidenormal   → PC tower (generic click)
//   Object_17                     material: architectural    → static
//   Object_19                     material: libro (book)     → Skills
//   Object_21                     material: screen           → MONITOR ← primary interactive
//   Object_24                     material: libro (book)     → Skills
//   mr-robot                      material: mr-robot poster  → Projects
//   pink-floyd                    material: pink-floyd poster→ Projects
//
// Monitor mesh: Object_21 (material name: "screen", 8 vertices — flat screen quad)

// Node names in portfolio-room.optimized.glb (node names ≠ mesh names after optimization)
const MONITOR_MESHES  = new Set(['intro-card-anchor', 'Object_37'])
const BOOK_MESHES     = new Set(['books', 'Object_42'])
const POSTER_MESHES   = new Set(['mr-robot', 'pink-floyd'])
const FIGURINE_MESHES = new Set(['one-piece'])

export default function RoomScene() {
  const { scene } = useGLTF('/portfolio-room.optimized.glb')

  const [monitorHovered, setMonitorHovered] = useState(false)

  const cameraState        = useRoomStore((s) => s.cameraState)
  const setFocusTarget     = useRoomStore((s) => s.setFocusTarget)
  const setSceneMode       = useRoomStore((s) => s.setSceneMode)
  const setActiveSection   = useRoomStore((s) => s.setActiveSection)
  const setCameraState     = useRoomStore((s) => s.setCameraState)
  const addEasterEgg       = useRoomStore((s) => s.addEasterEgg)
  const setMonitorWorldPos = useRoomStore((s) => s.setMonitorWorldPos)

  useEffect(() => {
    scene.updateMatrixWorld(true)

    const wp = new THREE.Vector3()

    // ── Material brightness pass ───────────────────────────────────────────
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((mat) => {
          if (mat.color) mat.color.multiplyScalar(1.8)
          if (mat.name === 'suelo') {
            mat.color.multiplyScalar(2.5)
            mat.roughness = Math.max(0.6, mat.roughness ?? 1)
          }
          mat.needsUpdate = true
        })
      }
    })

    // ── Capture monitor world position for tooltip + MonitorUI anchor ───
    const monitor = scene.getObjectByName('intro-card-anchor')
    if (monitor) {
      monitor.getWorldPosition(wp)
      setMonitorWorldPos({ x: wp.x, y: wp.y, z: wp.z })
    }
  }, [scene, setMonitorWorldPos])

  function handlePointerOver(e) {
    const name = e.object.name
    if (!name) return
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    setFocusTarget(name)
    if (MONITOR_MESHES.has(name)) setMonitorHovered(true)
  }

  function handlePointerOut(e) {
    const name = e.object.name
    e.stopPropagation()
    document.body.style.cursor = 'auto'
    setFocusTarget(null)
    if (MONITOR_MESHES.has(name)) setMonitorHovered(false)
  }

  function handleClick(e) {
    const name = e.object.name
    if (!name) return
    e.stopPropagation()

    if (FIGURINE_MESHES.has(name)) {
      addEasterEgg('one-piece-figure')
      console.log('Easter egg found: One Piece figure!')
      return
    }

    if (MONITOR_MESHES.has(name)) {
      setMonitorHovered(false)
      setCameraState('monitor')
      return
    }

    if (BOOK_MESHES.has(name)) {
      setSceneMode('ui-open')
      setActiveSection('skills')
      return
    }

    if (POSTER_MESHES.has(name)) {
      setSceneMode('ui-open')
      setActiveSection('projects')
      return
    }

    console.log('clicked:', name)
  }

  const monitorWorldPos = useRoomStore((s) => s.monitorWorldPos)

  // Tooltip shown only when at desk AND hovering the monitor
  const showTooltip = cameraState === 'desk' && monitorHovered && monitorWorldPos

  // Tooltip sits 0.5 units above the monitor screen centre
  const tooltipPos = monitorWorldPos
    ? [monitorWorldPos.x, monitorWorldPos.y + 0.5, monitorWorldPos.z + 0.1]
    : [0, 2.35, 0.9]

  return (
    <>
      <primitive
        object={scene}
        dispose={null}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Monitor hover tooltip — anchored above the real monitor position */}
      {showTooltip && (
        <Html position={tooltipPos} center>
          <div style={tooltipStyles}>View Portfolio →</div>
        </Html>
      )}

      <MonitorBoundsTracker scene={scene} />
    </>
  )
}

const tooltipStyles = {
  background: 'rgba(0,0,0,0.72)',
  color: 'white',
  fontFamily: 'monospace',
  fontSize: '13px',
  padding: '6px 12px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  animation: 'tooltipFadeIn 0.2s ease forwards',
  border: '1px solid rgba(255,255,255,0.12)',
}
