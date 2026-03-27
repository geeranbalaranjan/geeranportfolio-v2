import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import useRoomStore from '../store/useRoomStore'

// ── Scene geometry (derived from GLB accessor min/max) ─────────────────────
//
// Scene bounds:
//   min: [-4.73, -0.86, -4.68]   max: [4.91, 6.86, 4.96]
//   centre (SC): [0.25, 3.00, 0.14]   size (SS): [9.95, 7.71, 9.64]
//
// Monitor (Object_21, mesh "screen"):
//   bounds min: [-2.681, 1.434, -2.265]   max: [-2.639, 1.457, -2.210]
//   centre [mx, my, mz]: [-2.660, 1.446, -2.238]
//   facing axis: X is thinnest (span 0.042) → monitor faces NEGATIVE X
//
// Camera positions — formula:
//   room:    SC + SS * [0.9, 1.2, 0.9],  target [SC.x, SC.y*0.3, SC.z]
//   desk:    [mx-4,   my+1.8, mz+0.5],  target [mx, my+0.3, mz]  (|MF.x| largest, MF.x<0)
//   monitor: [mx-1.8, my+0.2, mz+0.5],  target [mx, my+0.3, mz]

// Desk position locked from live camera logger readout
// Room = desk target + diagonal offset [+7, +5, +7]
// Monitor = same x/y as desk, z pulled forward to ~-0.2
// intro-card-anchor world centre: [-3.786, 2.470, -1.132]
const CARD_TARGET = [-3.786, 2.470, -1.132]

const CAMERA_POSITIONS = {
  room: {
    position: [10.4, 12.5, 10.881],
    target:   [-1.600, 0.5, -1.119],
  },
  desk: {
    position: [-1.101, 2.533, -1.114],
    target:   CARD_TARGET,
  },
  monitor: {
    // Same as desk — camera stays put, overlay appears on the screen
    position: [-1.101, 2.533, -1.114],
    target:   CARD_TARGET,
  },
}

const AZIMUTH = {
  // Room default azimuth ≈ PI/4 (45°). Allow ±75° around that so walls stay visible.
  room:    { min: -Math.PI / 6, max: Math.PI * (2 / 3), polar: { min: Math.PI * 0.15, max: Math.PI * 0.65 } },
  desk:    { min: -Infinity, max: Infinity, polar: { min: 0, max: Math.PI } },
  monitor: { min: -Infinity, max: Infinity, polar: { min: 0, max: Math.PI } },
}

export default function CameraController({ controlsRef }) {
  const { camera } = useThree()
  const cameraState  = useRoomStore((s) => s.cameraState)
  const isFirstRender = useRef(true)
  const activeTweens  = useRef([])

  // Apply static orbit constraints once the ref is ready
  useEffect(() => {
    const controls = controlsRef?.current
    if (!controls) return
    controls.minDistance   = 0.5
    controls.maxDistance   = 25
    controls.enablePan     = false
    controls.dampingFactor = 0.05
    controls.enableDamping = true
  }, [controlsRef])

  // Update azimuth + polar constraints whenever camera state changes
  useEffect(() => {
    const controls = controlsRef?.current
    if (!controls) return
    const az = AZIMUTH[cameraState]
    if (!az) return
    controls.minAzimuthAngle = az.min
    controls.maxAzimuthAngle = az.max
    controls.minPolarAngle   = az.polar.min
    controls.maxPolarAngle   = az.polar.max
    controls.update()
  }, [cameraState, controlsRef])

  useEffect(() => {
    const config = CAMERA_POSITIONS[cameraState]
    if (!config) return

    const controls = controlsRef?.current

    // First render — snap camera without tweening (canvas already sets initial position)
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (controls) {
        controls.target.set(...config.target)
        controls.update()
      }
      return
    }

    // Kill any in-flight tweens
    activeTweens.current.forEach((t) => t.kill())
    activeTweens.current = []

    // Lock orbit controls for the duration of the tween
    if (controls) controls.enabled = false

    const posProxy = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const tgtProxy = {
      x: controls ? controls.target.x : config.target[0],
      y: controls ? controls.target.y : config.target[1],
      z: controls ? controls.target.z : config.target[2],
    }

    const posTween = gsap.to(posProxy, {
      x: config.position[0],
      y: config.position[1],
      z: config.position[2],
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.set(posProxy.x, posProxy.y, posProxy.z)
        if (controls) controls.update()
      },
      onComplete: () => {
        if (controls) {
          controls.enabled = cameraState !== 'monitor'
          controls.update()
        }
      },
    })

    const tgtTween = gsap.to(tgtProxy, {
      x: config.target[0],
      y: config.target[1],
      z: config.target[2],
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (controls) {
          controls.target.set(tgtProxy.x, tgtProxy.y, tgtProxy.z)
          controls.update()
        } else {
          camera.lookAt(tgtProxy.x, tgtProxy.y, tgtProxy.z)
        }
      },
    })

    activeTweens.current = [posTween, tgtTween]

    return () => {
      activeTweens.current.forEach((t) => t.kill())
      if (controls) controls.enabled = cameraState !== 'monitor'
    }
  }, [cameraState, camera]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
