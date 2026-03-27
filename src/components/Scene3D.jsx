import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import RoomScene from './RoomScene'
import CameraController from './CameraController'

useGLTF.setDecoderPath('/draco/')


export default function Scene3D() {
  const controlsRef = useRef()

  return (
    <Canvas
      shadows
      camera={{ position: [10.4, 12.5, 10.881], fov: 45 }}
      gl={{ antialias: true, toneMappingExposure: 1.8 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Suspense fallback={null}>
        {/* ── Lighting ─────────────────────────────────────────────────────── */}
        <hemisphereLight skyColor="#c8b8e8" groundColor="#6040a0" intensity={1.2} />
        <directionalLight
          position={[6, 10, 6]}
          intensity={1.4}
          color="#fff5e0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[2, 4, 2]}  intensity={30} color="#ffcc88" distance={12} decay={2} />
        <pointLight position={[3, 3, -2]} intensity={25} color="#c0d8ff" distance={10} decay={2} />
        <pointLight position={[0, 0.3, 0]} intensity={15} color="#b89060" distance={8}  decay={1.5} />
        <pointLight position={[2, 1.2, -1]} intensity={10} color="#ff2d88" distance={5}  decay={2} />

        {/* ── Scene ────────────────────────────────────────────────────────── */}
        <RoomScene />

        {/* ── Camera controller: reads cameraState, drives GSAP tweens ─────── */}
        <CameraController controlsRef={controlsRef} />

        {/* ── Orbit controls ───────────────────────────────────────────────── */}
        <OrbitControls
          ref={controlsRef}
          target={[-3.786, 2.470, -1.132]}
          minDistance={0.5}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          enablePan={false}
          dampingFactor={0.05}
          enableDamping
        />
      </Suspense>
    </Canvas>
  )
}
