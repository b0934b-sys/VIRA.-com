import { Component, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ——— procedural rock: displaced icosahedron ——— */
function useRockGeometry(radius, detail, seed) {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(radius, detail)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    const hash = (x, y, z) => {
      const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 11.13) * 43758.5453
      return s - Math.floor(s)
    }
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const n = v.clone().normalize()
      // layered pseudo-noise: big lumps + fine grit
      const d =
        1 +
        (hash(Math.floor(n.x * 3 + 5), Math.floor(n.y * 3 + 5), Math.floor(n.z * 3 + 5)) - 0.5) * 0.55 +
        (hash(Math.floor(n.x * 9 + 2), Math.floor(n.y * 9 + 2), Math.floor(n.z * 9 + 2)) - 0.5) * 0.22
      v.copy(n).multiplyScalar(radius * d)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [radius, detail, seed])
}

function Rock({ position, scrollRef }) {
  const geo = useRockGeometry(1.3, 6, 1)
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.05
    ref.current.rotation.x = 0.12 + (scrollRef?.current ?? 0) * 0.35
  })
  return (
    <group ref={ref} position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#2a211a" roughness={0.8} metalness={0.3} flatShading />
      </mesh>
      {/* gold rim halo around the silhouette */}
      <mesh geometry={geo} scale={1.045}>
        <meshBasicMaterial color="#c9a961" side={THREE.BackSide} transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function FloatingRock({ position, scale, speed, seed }) {
  const geo = useRockGeometry(1, 3, seed)
  const ref = useRef()
  const baseY = position[1]
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = baseY + Math.sin(t * speed + seed * 2) * 0.18
    ref.current.rotation.y += 0.0016
    ref.current.rotation.x += 0.0009
  })
  return (
    <mesh ref={ref} geometry={geo} position={position} scale={scale}>
      <meshStandardMaterial color="#14100d" roughness={0.9} metalness={0.22} flatShading />
    </mesh>
  )
}

function Rings({ speedMul }) {
  const g1 = useRef(), g2 = useRef(), g3 = useRef()
  const speeds = useRef([0.12, -0.09, 0.06])
  useFrame((_, delta) => {
    const m = speedMul?.current ?? 1
    if (g1.current) g1.current.rotation.y += delta * speeds.current[0] * m
    if (g2.current) g2.current.rotation.y += delta * speeds.current[1] * m
    if (g3.current) g3.current.rotation.y += delta * speeds.current[2] * m
  })
  const gold = { color: '#d8b978', metalness: 1, roughness: 0.22, emissive: '#8a6a25', emissiveIntensity: 0.4 }
  return (
    <group position={[2.6, 0.15, 0]}>
      <group ref={g1} rotation={[1.12, 0, -0.28]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.032, 16, 128]} />
          <meshStandardMaterial {...gold} />
        </mesh>
      </group>
      <group ref={g2} rotation={[1.32, 0, 0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.8, 0.024, 16, 128]} />
          <meshStandardMaterial {...gold} roughness={0.3} metalness={1} emissive="#6a4d18" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group ref={g3} rotation={[0.92, 0, 0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.3, 0.016, 12, 128]} />
          <meshStandardMaterial {...gold} roughness={0.35} metalness={1} emissive="#5a4212" emissiveIntensity={0.25} />
        </mesh>
      </group>
    </group>
  )
}

function Dust({ count }) {
  const ref = useRef()
  const tex = useMemo(() => glowTexture('rgba(255, 225, 160, 1)', 'rgba(255, 225, 160, 0)'), [])
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 5
      arr[i * 3] = Math.cos(theta) * r + 1
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = Math.sin(theta) * r - 1
    }
    return arr
  }, [count])
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.014
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} color="#e8c87a" size={0.09} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation alphaTest={0.01} />
    </points>
  )
}

function glowTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

function FloorGlow() {
  const tex = useMemo(() => glowTexture('rgba(232, 190, 110, 0.55)', 'rgba(232, 190, 110, 0)'), [])
  return (
    <mesh position={[1.2, -2.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 7]} />
      <meshBasicMaterial map={tex} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  )
}

function HorizonGlow() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 128
    const ctx = c.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, 0, 128)
    g.addColorStop(0, 'rgba(255, 140, 50, 0)')
    g.addColorStop(0.35, 'rgba(255, 150, 60, 0.28)')
    g.addColorStop(0.6, 'rgba(255, 150, 60, 0.5)')
    g.addColorStop(1, 'rgba(255, 150, 60, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 128)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <mesh position={[0, -1.9, -8]}>
      <planeGeometry args={[26, 6]} />
      <meshBasicMaterial map={tex} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

const CAMERAS = [
  { pos: [0, 0.4, 11], look: [1.9, 0, 0], rings: 1 },
  { pos: [0.5, 0.9, 9.4], look: [2.1, 0.25, 0], rings: 1.7 },
  { pos: [-0.6, -0.4, 10.2], look: [1.9, -0.25, 0], rings: 0.8 },
  { pos: [0, 0.2, 12.6], look: [1.7, 0, 0], rings: 2.1 },
]

function CameraRig({ slide, scrollRef, speedRef, reduced, isMobile }) {
  const { camera, pointer } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, delta) => {
    const preset = CAMERAS[slide] || CAMERAS[0]
    const s = scrollRef?.current ?? 0
    const k = 1 - Math.exp(-2.6 * delta)
    // on phones pull the camera back and look further right, so the text
    // column stays over clear sky instead of over the rock
    const mobZ = isMobile ? 2.4 : 0
    const mobX = isMobile ? 0.6 : 0
    target.set(
      preset.pos[0] + (reduced ? 0 : pointer.x * 0.45),
      preset.pos[1] + (reduced ? 0 : pointer.y * 0.28) + s * 0.4,
      preset.pos[2] - s * 1.4 + mobZ,
    )
    camera.position.lerp(target, k)
    lookTarget.set(preset.look[0] + mobX, preset.look[1] + s * 0.2, preset.look[2])
    camera.lookAt(lookTarget)
    if (speedRef) speedRef.current = preset.rings
  })
  return null
}

function Scene({ slide, scrollRef, isMobile, reduced }) {
  const speedRef = useRef(1)
  return (
    <>
      <fog attach="fog" args={['#050505', 13, 30]} />
      <ambientLight intensity={0.32} />
      <pointLight position={[5, 4, 4]} intensity={95} distance={24} color="#ffb84d" />
      <pointLight position={[0, 1, 6]} intensity={18} distance={16} color="#fff2dd" />
      <pointLight position={[-6, 2, -2]} intensity={30} distance={20} color="#8a94ff" />
      <pointLight position={[0, -1.2, -4]} intensity={26} distance={16} color="#ff7a2a" />
      <Rock position={[2.6, 0.2, 0]} scrollRef={scrollRef} />
      <Rings speedMul={speedRef} />
      <FloatingRock position={[-2.8, 1.6, -2.5]} scale={0.18} speed={0.5} seed={2} />
      <FloatingRock position={[-3.6, -0.8, -1.5]} scale={0.12} speed={0.7} seed={3} />
      <FloatingRock position={[5.2, 1.8, -2.5]} scale={0.26} speed={0.45} seed={4} />
      <FloatingRock position={[4.4, -1.4, -0.8]} scale={0.15} speed={0.8} seed={5} />
      <FloatingRock position={[-1.2, 2.2, -3]} scale={0.18} speed={0.6} seed={6} />
      {!isMobile && <FloatingRock position={[6.0, 0.4, -3.5]} scale={0.38} speed={0.4} seed={7} />}
      <Dust count={isMobile ? 260 : 700} />
      <FloorGlow />
      <HorizonGlow />
      <CameraRig slide={slide} scrollRef={scrollRef} speedRef={speedRef} reduced={reduced} isMobile={isMobile} />
    </>
  )
}

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="hero-fallback" aria-hidden="true" />
    return this.props.children
  }
}

export default function HeroScene({ slide, scrollRef, isMobile, reduced, paused }) {
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={isMobile ? 1 : [1, 1.75]}
        camera={{ fov: 42, position: [0, 0.4, 11], near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={paused ? 'never' : 'always'}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene slide={slide} scrollRef={scrollRef} isMobile={isMobile} reduced={reduced} />
      </Canvas>
    </SceneErrorBoundary>
  )
}
