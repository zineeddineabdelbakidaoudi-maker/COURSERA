"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, RootState } from '@react-three/fiber'
import { Environment, PerspectiveCamera, Float, Stars, TorusKnot, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AbstractShapes() {
  const group = useRef<THREE.Group>(null)

  // Rotate entire group slowly
  useFrame((state: RootState) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Primary Color: Sky Blue (#0EA5E9 -> oklch 69% 0.15 220)
  // Accent Color: Indigo (#6366F1 -> oklch 55% 0.22 265)

  return (
    <group ref={group}>
      {/* Center distorted sphere (represents the globe/platform) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.5, 64, 64]} position={[2, 0, -2]}>
          <MeshDistortMaterial
            color="#0EA5E9"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
      </Float>

      {/* Floating torus knot (represents connectivity/network) */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <TorusKnot args={[0.8, 0.25, 128, 32]} position={[-3, 1, -4]}>
          <meshPhysicalMaterial
            color="#6366F1"
            roughness={0.1}
            metalness={0.5}
            transmission={0.9} // glass effect
            thickness={1}
            ior={1.5}
          />
        </TorusKnot>
      </Float>

      {/* Small accent sphere */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[0.5, 32, 32]} position={[0, -2, -1]}>
          <meshStandardMaterial color="#10B981" roughness={0.3} metalness={0.7} />
        </Sphere>
      </Float>
      
      {/* Background Particles (stars) */}
      <Stars radius={10} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#0EA5E9" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#6366F1" />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
        
        <AbstractShapes />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
