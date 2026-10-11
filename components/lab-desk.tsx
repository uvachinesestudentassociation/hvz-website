"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useTheme } from "next-themes"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { ACESFilmicToneMapping, Box3, CanvasTexture, Group, Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap, RepeatWrapping, SpotLight, SRGBColorSpace, TextureLoader, Vector3 } from "three"
import { BountyCard } from "@/components/bounty-card"
import { GameCountdown } from "@/components/game-countdown"
import { QuestBoardEmbed } from "@/components/quest-board-embed"
import { getResource } from "@/lib/public-resources"

type DeskId =
  | "board"
  | "rules"
  | "zones"
  | "kill"
  | "quest"
  | "points"
  | "population"
  | "graveyard"
  | "bounty"
  | "clock"

const ITEMS: {
  id: DeskId
  label: string
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}[] = [
  { id: "points", label: "Points", url: "/lab/models/computerScreen.glb", position: [0, 0.73, -1.08], rotation: [0, 0, 0], scale: 2.6 },
  { id: "kill", label: "Kill Report", url: "/lab/models/cooking-knife.glb", position: [1.68, 0.73, -0.12], rotation: [0, -1.15, 0], scale: 2.2 },
  { id: "population", label: "Population", url: "/lab/models/cardboardBoxOpen.glb", position: [0.95, 0.73, -0.42], rotation: [0, -0.9, 0], scale: 1.45 },
  { id: "zones", label: "Safe Zones", url: "/lab/models/computerKeyboard.glb", position: [0, 0.73, -0.05], rotation: [0, 0, 0], scale: 4.2 },
]

for (const item of ITEMS) useGLTF.preload(item.url)

function HoverPoint({ y, marker }: { y: number; marker: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<Group>(null)
  const { camera, size } = useThree()
  const world = useMemo(() => new Vector3(), [])
  useFrame(() => {
    const el = marker.current
    if (!el || !ref.current) return
    ref.current.getWorldPosition(world)
    world.project(camera)
    el.style.left = `${(world.x * 0.5 + 0.5) * size.width}px`
    el.style.top = `${(-world.y * 0.5 + 0.5) * size.height}px`
  })
  return <group ref={ref} position={[0, y, 0]} />
}

function markShadows(root: Object3D) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return
    child.castShadow = true
    child.receiveShadow = true
  })
}

function OfficeModel({ url, glow, marker }: { url: string; glow: boolean; marker: React.RefObject<HTMLDivElement | null> }) {
  const { scene } = useGLTF(url)
  const fitted = useMemo(() => {
    const clone = scene.clone(true)
    markShadows(clone)
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const source = child.material
      const list = Array.isArray(source) ? source : [source]
      const cloned = list.map((material) => material.clone())
      child.material = Array.isArray(source) ? cloned : cloned[0]
    })
    const box = new Box3().setFromObject(clone)
    clone.position.x -= (box.min.x + box.max.x) / 2
    clone.position.z -= (box.min.z + box.max.z) / 2
    clone.position.y -= box.min.y
    return { object: clone, height: box.max.y - box.min.y }
  }, [scene])

  useEffect(() => {
    fitted.object.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const list = Array.isArray(child.material) ? child.material : [child.material]
      for (const material of list) {
        if (!(material instanceof MeshStandardMaterial)) continue
        material.emissive.set(glow ? "#e0b15a" : "#000000")
        material.emissiveIntensity = glow ? 0.3 : 0
      }
    })
  }, [fitted.object, glow])

  return (
    <>
      <primitive object={fitted.object} />
      {glow ? <HoverPoint y={fitted.height} marker={marker} /> : null}
    </>
  )
}

function DeskObject({
  url,
  position,
  rotation,
  scale,
  glow,
  marker,
  onOver,
  onOut,
  onPick,
}: {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  glow: boolean
  marker: React.RefObject<HTMLDivElement | null>
  onOver: () => void
  onOut: () => void
  onPick: () => void
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(event) => {
        event.stopPropagation()
        onOver()
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onOut()
      }}
      onClick={(event) => {
        event.stopPropagation()
        onPick()
      }}
    >
      <OfficeModel url={url} glow={glow} marker={marker} />
    </group>
  )
}

const TV_URL = "/lab/models/televisionVintage.glb"
useGLTF.preload(TV_URL)

const FEEDS: { id: DeskId; label: string; col: number; row: number }[] = [
  { id: "quest", label: "Quest Report", col: 1, row: 1 },
  { id: "rules", label: "Game Rules", col: 2, row: 1 },
  { id: "graveyard", label: "Graveyard", col: 1, row: 0 },
  { id: "board", label: "Quest Board", col: 2, row: 0 },
]

function SecuritySet({
  id,
  glow,
  marker,
}: {
  id: DeskId | null
  glow: boolean
  marker: React.RefObject<HTMLDivElement | null>
}) {
  const { scene } = useGLTF(TV_URL)
  const fitted = useMemo(() => {
    const clone = scene.clone(true)
    markShadows(clone)
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const source = child.material
      const list = Array.isArray(source) ? source : [source]
      const cloned = list.map((material) => material.clone())
      child.material = Array.isArray(source) ? cloned : cloned[0]
    })
    const box = new Box3().setFromObject(clone)
    const sizeY = box.max.y - box.min.y
    clone.position.x -= (box.min.x + box.max.x) / 2
    clone.position.z -= (box.min.z + box.max.z) / 2
    clone.position.y -= box.min.y
    return { object: clone, height: sizeY }
  }, [scene])
  useEffect(() => {
    fitted.object.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const list = Array.isArray(child.material) ? child.material : [child.material]
      for (const material of list) {
        if (!(material instanceof MeshStandardMaterial)) continue
        material.emissive.set(glow ? "#e0b15a" : "#000000")
        material.emissiveIntensity = glow ? 0.3 : 0
      }
    })
  }, [fitted.object, glow])
  return (
    <>
      <primitive object={fitted.object} />
      {glow && id ? <HoverPoint y={fitted.height} marker={marker} /> : null}
    </>
  )
}

function SecurityWall({
  lit,
  marker,
  onOver,
  onOut,
  onPick,
}: {
  lit: DeskId | null
  marker: React.RefObject<HTMLDivElement | null>
  onOver: (id: DeskId) => void
  onOut: (id: DeskId) => void
  onPick: (id: DeskId) => void
}) {
  const { scene } = useGLTF(TV_URL)
  const size = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    return { width: box.max.x - box.min.x, height: box.max.y - box.min.y }
  }, [scene])
  const scale = 2.15
  const pitchX = size.width * scale
  const pitchY = size.height * scale
  return (
    <group position={[-(0.85 + pitchX) - 0.35, 0.73, -0.65]} rotation={[0, 0.5, 0]}>
      {FEEDS.map((feed) => {
        const id = feed.id
        return (
          <group
            key={`${feed.col}-${feed.row}`}
            position={[(feed.col - 1) * pitchX, feed.row * pitchY, 0]}
            scale={scale}
            onPointerOver={
              id
                ? (event) => {
                    event.stopPropagation()
                    onOver(id)
                  }
                : undefined
            }
            onPointerOut={
              id
                ? (event) => {
                    event.stopPropagation()
                    onOut(id)
                  }
                : undefined
            }
            onClick={
              id
                ? (event) => {
                    event.stopPropagation()
                    onPick(id)
                  }
                : undefined
            }
          >
            <SecuritySet id={id} glow={id !== null && lit === id} marker={marker} />
          </group>
        )
      })}
    </group>
  )
}

const DESK_URL = "/lab/models/desk.glb"
useGLTF.preload(DESK_URL)

function DeskModel() {
  const { scene } = useGLTF(DESK_URL)
  const object = useMemo(() => {
    const clone = scene.clone(true)
    const box = new Box3().setFromObject(clone)
    const sizeX = box.max.x - box.min.x
    const sizeY = box.max.y - box.min.y
    const sizeZ = box.max.z - box.min.z
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    const scaleX = 7.2 / sizeX
    const scaleY = 0.72 / sizeY
    const scaleZ = 3.2 / sizeZ
    clone.scale.set(scaleX, scaleY, scaleZ)
    clone.position.set(-scaleX * centerX, -scaleY * box.min.y, 0.2 - scaleZ * centerZ)
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const source = child.material
      const list = Array.isArray(source) ? source : [source]
      const cloned = list.map((material) => {
        const next = material.clone()
        if (next instanceof MeshStandardMaterial) {
          next.color.multiplyScalar(0.72)
          next.color.r *= 1.08
          next.color.g *= 0.9
          next.color.b *= 0.72
          next.roughness = Math.min(1, next.roughness + 0.28)
          next.metalness *= 0.35
        }
        return next
      })
      child.material = Array.isArray(source) ? cloned : cloned[0]
    })
    markShadows(clone)
    return clone
  }, [scene])
  return <primitive object={object} />
}

const SIGN_TEXT = "HUMANS VS. ZOMBIES"

function HangingSign({ night }: { night: boolean }) {
  const light = useRef<SpotLight>(null)
  const target = useRef<Object3D>(null)
  useEffect(() => {
    if (light.current && target.current) light.current.target = target.current
  }, [night])

  if (!night) return null
  return (
    <>
      <spotLight
        ref={light}
        position={[0, 1.55, -0.25]}
        angle={1.5}
        penumbra={0.65}
        intensity={40}
        color="#ff9a3c"
        distance={20}
        decay={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={12}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
        shadow-camera-near={0.4}
        shadow-camera-far={12}
      />
      <object3D ref={target} position={[0, 0.2, -0.25]} />
    </>
  )
}

function SignOverlay({ night, reduced }: { night: boolean; reduced: boolean }) {
  const swing = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      if (swing.current) {
        swing.current.style.transform = `rotate(${Math.sin(((now - start) / 1000) * 1.15) * 0.03}rad)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])
  const rope = night ? "#b0b0b0" : "#6a6258"

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[6%] z-10 flex justify-center">
      <div ref={swing} style={{ transformOrigin: "top center" }}>
        <div className="hero-sign__panel" style={{ position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: "100%", height: "4.5rem" }}>
            <span style={{ position: "absolute", top: 0, left: "-0.15rem", right: "-0.15rem", height: 5, background: night ? "linear-gradient(180deg, #4a4a4a 0%, #1a1a1a 100%)" : "linear-gradient(180deg, #6a6560 0%, #3a3530 100%)", border: "1px solid #000" }} />
            <span style={{ position: "absolute", top: 0, bottom: -2, left: 0, width: 4, background: rope }} />
            <span style={{ position: "absolute", top: 0, bottom: -2, right: 0, width: 4, background: rope }} />
          </div>
          <p className="hero-logo" data-text={SIGN_TEXT} style={{ margin: 0, fontSize: "5rem" }}>
            <span className="hero-logo__text">{SIGN_TEXT}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function posterMap(title: string, ink: string, paper: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 640
  const ctx = canvas.getContext("2d")
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  if (!ctx) return texture
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, 512, 640)
  ctx.fillStyle = ink
  ctx.fillRect(28, 28, 456, 120)
  ctx.fillStyle = paper
  ctx.font = "700 54px Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(title, 256, 88)
  const swatches = ["#e23b3b", "#f2c14e", "#3d7ea6", "#d36aa8", "#6aa84f"]
  swatches.forEach((color, index) => {
    ctx.fillStyle = color
    ctx.fillRect(48 + (index % 3) * 140, 200 + Math.floor(index / 3) * 160, 120, 130)
  })
  ctx.fillStyle = "rgba(90, 58, 28, 0.38)"
  ;[
    [140, 390, 30],
    [390, 250, 16],
    [310, 530, 22],
  ].forEach(([sx, sy, r]) => {
    ctx.beginPath()
    ctx.ellipse(sx, sy, r, r * 0.65, 0.4, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalCompositeOperation = "destination-out"
  ctx.beginPath()
  ctx.moveTo(440, 0)
  ctx.lineTo(512, 0)
  ctx.lineTo(512, 78)
  ctx.lineTo(468, 36)
  ctx.closePath()
  ctx.fill()
  ctx.globalCompositeOperation = "source-over"
  texture.needsUpdate = true
  return texture
}

function CsaLogo() {
  const map = useMemo(() => {
    const texture = new TextureLoader().load("/images/csa_square_logo.png")
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={[0.48, 0.734, 0.52]} rotation={[0, 0.22, 0]} receiveShadow>
      <boxGeometry args={[0.22, 0.004, 0.22]} />
      <meshStandardMaterial attach="material-0" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-1" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-2" map={map} roughness={0.72} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      <meshStandardMaterial attach="material-3" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-4" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-5" color="#7a1f1a" roughness={0.9} />
    </mesh>
  )
}

function WallPosters({ night }: { night: boolean }) {
  const maps = useMemo(
    () => [
      posterMap("STAY IN", night ? "#1a120c" : "#3c3228", night ? "#c9ae6a" : "#e4d3a2"),
      posterMap("REPORT", "#1a120c", night ? "#c9ae6a" : "#e4d3a2"),
    ],
    [night],
  )
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps])
  return (
    <>
      {maps.map((map, index) => (
        <mesh key={index} position={[index === 0 ? 1.55 : 2.8, 1.15, -2.64]} rotation={[0, 0, index === 0 ? 0 : -0.07]}>
          <planeGeometry args={[0.95, 1.15]} />
          <meshStandardMaterial map={map} transparent roughness={0.95} />
        </mesh>
      ))}
    </>
  )
}

function DeskFan({ reduced }: { reduced: boolean }) {
  const fan = useRef<Group>(null)
  const blades = useRef<Group>(null)
  useEffect(() => {
    if (fan.current) markShadows(fan.current)
  }, [])
  useFrame((_, delta) => {
    if (!blades.current || reduced) return
    blades.current.rotation.z += delta * 8
  })
  const cage = 0.22
  return (
    <group ref={fan} position={[-1.62, 0.73, 0.28]} rotation={[0, 1.2, 0]}>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.04, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.016, 0.02, 0.32, 8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.55} />
      </mesh>
      <group position={[0, 0.42, 0]}>
        <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.07, 12]} />
          <meshStandardMaterial color="#242424" roughness={0.45} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <torusGeometry args={[cage, 0.01, 8, 24]} />
          <meshStandardMaterial color="#9aa0a6" roughness={0.32} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[cage, 0.008, 8, 24]} />
          <meshStandardMaterial color="#9aa0a6" roughness={0.32} metalness={0.75} />
        </mesh>
        {[-0.14, -0.07, 0, 0.07, 0.14].map((y) => (
          <mesh key={y} position={[0, y, 0.075]}>
            <boxGeometry args={[Math.sqrt(Math.max(cage * cage - y * y, 0)) * 2, 0.008, 0.008]} />
            <meshStandardMaterial color="#c5c8cc" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
        {[0, 1, 2, 3, 4, 5].map((spoke) => {
          const angle = (spoke / 6) * Math.PI * 2
          return (
            <mesh key={spoke} position={[Math.cos(angle) * cage, Math.sin(angle) * cage, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.12, 5]} />
              <meshStandardMaterial color="#9aa0a6" roughness={0.32} metalness={0.75} />
            </mesh>
          )
        })}
        <group ref={blades} position={[0, 0, 0.02]}>
          {[0, 1, 2].map((blade) => (
            <group key={blade} rotation={[0, 0, (blade * Math.PI * 2) / 3]}>
              <mesh position={[0, 0.09, 0]} rotation={[0, 0.7, 0]}>
                <boxGeometry args={[0.06, 0.16, 0.01]} />
                <meshStandardMaterial color="#d5d8dc" roughness={0.35} metalness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}

function deskNoteMap() {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 346
  const ctx = canvas.getContext("2d")
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  if (!ctx) return texture
  ctx.fillStyle = "#e4d3a2"
  ctx.fillRect(0, 0, 512, 346)
  ctx.fillStyle = "rgba(90, 58, 28, 0.35)"
  ;[
    [90, 250, 22],
    [400, 180, 14],
  ].forEach(([sx, sy, r]) => {
    ctx.beginPath()
    ctx.ellipse(sx, sy, r, r * 0.7, 0.3, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = "#c4b48a"
  ctx.fillRect(150, 10, 212, 34)
  ctx.fillStyle = "#1a120c"
  ctx.font = "700 72px Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ;["STAY INSIDE", "THE SAFE", "ZONES"].forEach((line, index) => {
    ctx.fillText(line, 256, 128 + index * 72)
  })
  texture.needsUpdate = true
  return texture
}

function DeskNote() {
  const map = useMemo(() => deskNoteMap(), [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={[-0.95, 0.734, 0.42]} rotation={[0, -0.08, 0]} receiveShadow>
      <boxGeometry args={[0.62, 0.006, 0.42]} />
      <meshStandardMaterial attach="material-0" color="#e4d3a2" roughness={0.95} />
      <meshStandardMaterial attach="material-1" color="#e4d3a2" roughness={0.95} />
      <meshStandardMaterial attach="material-2" map={map} roughness={0.95} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      <meshStandardMaterial attach="material-3" color="#d7c496" roughness={0.95} />
      <meshStandardMaterial attach="material-4" color="#e4d3a2" roughness={0.95} />
      <meshStandardMaterial attach="material-5" color="#e4d3a2" roughness={0.95} />
    </mesh>
  )
}

function Room({ reduced, night }: { reduced: boolean; night: boolean }) {
  return (
    <>
      <color attach="background" args={[night ? "#070605" : "#a89884"]} />
      {night ? (
        <hemisphereLight args={["#ffb070", "#1a120c", 0.38]} />
      ) : (
        <>
          <hemisphereLight args={["#f4f7fb", "#d7c4a4", 0.5]} />
          <directionalLight
            position={[1.4, 4.8, 2.6]}
            intensity={1.4}
            color="#fff6ea"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-near={0.5}
            shadow-camera-far={18}
            shadow-bias={-0.00015}
            shadow-normalBias={0.04}
            shadow-radius={10}
          />
        </>
      )}
      <DeskModel />
      <DeskFan reduced={reduced} />
    </>
  )
}

function HallFluorescent({
  night,
  x,
  y,
  z,
  floorY,
  dead = false,
}: {
  night: boolean
  x: number
  y: number
  z: number
  floorY: number
  dead?: boolean
}) {
  const light = useRef<SpotLight>(null)
  const bulb = useRef<MeshStandardMaterial>(null)
  const target = useRef<Object3D>(null)
  const seed = useRef(Math.random() * 1000)
  useEffect(() => {
    if (light.current && target.current) light.current.target = target.current
  }, [night])
  useFrame(({ clock }) => {
    if (dead || !night || !light.current) return
    const step = Math.floor(clock.elapsedTime * 14 + seed.current)
    const n = Math.sin(step * 127.1 + seed.current) * 43758.5453
    const h = n - Math.floor(n)
    const k = h > 0.96 ? 0.2 : h > 0.9 ? 0.5 : 1
    light.current.intensity = 400 * k
    if (bulb.current) bulb.current.emissiveIntensity = 1.6 * k
  })
  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[1.7, 0.04, 0.18]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.035, 0]}>
        <boxGeometry args={[1.55, 0.025, 0.07]} />
        <meshStandardMaterial
          ref={bulb}
          color={dead ? "#6a6e72" : night ? "#e7f3ff" : "#b7c0c8"}
          emissive={dead || !night ? "#000000" : "#c5ddff"}
          emissiveIntensity={dead || !night ? 0 : 1.6}
        />
      </mesh>
      {night && !dead && (
        <>
          {/* 400 cd straight down the beam. Aimed 1.25 m further into the hall, so the
              floor under the tube is about 45 lux and the open doorway, out in the
              penumbra, is about 8 lux. The wall casts a shadow, so the spill stays
              in the doorway instead of passing through the wall. */}
          <spotLight
            ref={light}
            position={[0, -0.05, 0]}
            angle={1.05}
            penumbra={0.5}
            intensity={400}
            color="#d4e6ff"
            decay={2}
            distance={0}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0003}
            shadow-normalBias={0.03}
          />
          <object3D ref={target} position={[0, floorY - y, -1.25]} />
        </>
      )}
    </group>
  )
}

function Hallway({
  night,
  y0,
  y1,
  z0,
  checker,
  floorX0,
  floorZ0,
  floorW,
  floorD,
}: {
  night: boolean
  y0: number
  y1: number
  z0: number
  checker: CanvasTexture
  floorX0: number
  floorZ0: number
  floorW: number
  floorD: number
}) {
  const left = -8
  const right = 4.2
  const depth = 4.2
  const z1 = z0 - depth
  const wall = night ? "#1c2830" : "#5d6e7c"
  const end = night ? "#141c22" : "#4e5e6b"
  const midX = (left + right) / 2
  const midY = (y0 + y1) / 2
  const midZ = (z0 + z1) / 2
  const span = right - left
  const tiles = useMemo(() => {
    const map = checker.clone()
    map.wrapS = RepeatWrapping
    map.wrapT = RepeatWrapping
    map.colorSpace = SRGBColorSpace
    map.repeat.set(span / floorW, -depth / floorD)
    map.offset.set((left - floorX0) / floorW, (z0 - floorZ0) / floorD)
    return map
  }, [checker, span, depth, left, floorW, floorD, floorX0, floorZ0, z0])
  useEffect(() => () => tiles.dispose(), [tiles])
  return (
    <group>
      <mesh receiveShadow position={[midX, y0 - 0.04, midZ]}>
        <boxGeometry args={[span, 0.08, depth]} />
        <meshStandardMaterial map={tiles} roughness={0.92} />
      </mesh>
      <mesh position={[midX, y1 + 0.04, midZ]}>
        <boxGeometry args={[span, 0.08, depth]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      <mesh position={[left, midY, midZ]}>
        <boxGeometry args={[0.08, y1 - y0, depth]} />
        <meshStandardMaterial color={end} roughness={0.95} />
      </mesh>
      <mesh position={[right, midY, midZ]}>
        <boxGeometry args={[0.08, y1 - y0, depth]} />
        <meshStandardMaterial color={end} roughness={0.95} />
      </mesh>
      <mesh position={[midX, midY, z1]}>
        <boxGeometry args={[span, y1 - y0, 0.08]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {[-5.4, -3.35, -0.9].map((x) => (
        <HallFluorescent key={x} night={night} dead={x !== -3.35} x={x} y={y1 - 0.1} z={z0 - 1.15} floorY={y0} />
      ))}
    </group>
  )
}

function BackWall({
  night,
  color,
  trim,
  floorY,
  ceilY,
  backZ,
  thick,
  roomX,
  checker,
  floorX0,
  floorZ0,
  floorW,
  floorD,
}: {
  night: boolean
  color: string
  trim: string
  floorY: number
  ceilY: number
  backZ: number
  thick: number
  roomX: number
  checker: CanvasTexture
  floorX0: number
  floorZ0: number
  floorW: number
  floorD: number
}) {
  const doorX0 = -4.15
  const doorX1 = -2.55
  const doorTop = 1.85
  const winX0 = -2.35
  const winX1 = 0.7
  const winY0 = 0.55
  const winY1 = 1.9
  const z = backZ - thick / 2
  const slab = (x0: number, x1: number, y0: number, y1: number, key: string) => (
    <mesh key={key} castShadow receiveShadow position={[(x0 + x1) / 2, (y0 + y1) / 2, z]}>
      <boxGeometry args={[x1 - x0, y1 - y0, thick]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
  const glass = night ? "#7eb6d6" : "#d7eef8"
  return (
    <group>
      {slab(-roomX - thick, doorX0, floorY, ceilY, "left")}
      {slab(doorX0, doorX1, doorTop, ceilY, "over-door")}
      {slab(doorX1, winX0, floorY, ceilY, "pier")}
      {slab(winX0, winX1, floorY, winY0, "sill")}
      {slab(winX0, winX1, winY1, ceilY, "header")}
      {slab(winX1, roomX + thick, floorY, ceilY, "right")}
      <mesh position={[doorX0, (floorY + doorTop) / 2, backZ + 0.02]}>
        <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[doorX1, (floorY + doorTop) / 2, backZ + 0.02]}>
        <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <group position={[doorX0 + 0.04, (floorY + doorTop) / 2, backZ]} rotation={[0, -0.75, 0]}>
        <mesh castShadow position={[(doorX1 - doorX0) / 2, 0, 0]}>
          <boxGeometry args={[doorX1 - doorX0 - 0.1, doorTop - floorY - 0.08, 0.05]} />
          <meshStandardMaterial color={night ? "#8a5a32" : "#a56b3c"} roughness={0.72} />
        </mesh>
      </group>
      <Hallway
        night={night}
        y0={floorY}
        y1={ceilY}
        z0={backZ - thick}
        checker={checker}
        floorX0={floorX0}
        floorZ0={floorZ0}
        floorW={floorW}
        floorD={floorD}
      />
      <mesh position={[(doorX0 + doorX1) / 2, doorTop, backZ + 0.03]}>
        <boxGeometry args={[doorX1 - doorX0, 0.06, 0.06]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, (winY0 + winY1) / 2, backZ + 0.02]}>
        <boxGeometry args={[winX1 - winX0 - 0.08, winY1 - winY0 - 0.06, 0.03]} />
        <meshStandardMaterial color={glass} transparent opacity={night ? 0.34 : 0.4} roughness={0.04} metalness={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, winY1, backZ + 0.03]}>
        <boxGeometry args={[winX1 - winX0, 0.05, 0.05]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, winY0, backZ + 0.03]}>
        <boxGeometry args={[winX1 - winX0, 0.05, 0.05]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[winX0, (winY0 + winY1) / 2, backZ + 0.03]}>
        <boxGeometry args={[0.05, winY1 - winY0, 0.05]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[winX1, (winY0 + winY1) / 2, backZ + 0.03]}>
        <boxGeometry args={[0.05, winY1 - winY0, 0.05]} />
        <meshStandardMaterial color={trim} />
      </mesh>
    </group>
  )
}

function peelMap(paint: string, under: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  if (!ctx) return texture
  ctx.clearRect(0, 0, 128, 128)
  ctx.fillStyle = under
  ctx.beginPath()
  ctx.moveTo(16, 34)
  ctx.lineTo(98, 12)
  ctx.lineTo(114, 72)
  ctx.lineTo(76, 120)
  ctx.lineTo(22, 98)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = paint
  ctx.beginPath()
  ctx.moveTo(30, 42)
  ctx.lineTo(82, 26)
  ctx.lineTo(68, 90)
  ctx.lineTo(34, 80)
  ctx.closePath()
  ctx.fill()
  texture.needsUpdate = true
  return texture
}

function Peel({
  position,
  rotation,
  paint,
  under,
  size = 0.55,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  paint: string
  under: string
  size?: number
}) {
  const map = useMemo(() => peelMap(paint, under), [paint, under])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={map} transparent alphaTest={0.2} roughness={0.95} depthWrite={false} />
    </mesh>
  )
}

function OfficeShell({ night }: { night: boolean }) {
  const checker = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    if (!ctx) return texture
    const tile = 32
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const light = (x + y) % 2 === 0
        ctx.fillStyle = night ? (light ? "#e4dcc8" : "#070707") : light ? "#e7dcc8" : "#5a5148"
        ctx.fillRect(x * tile, y * tile, tile, tile)
      }
    }
    ctx.strokeStyle = night ? "#3a342c" : "#8a7d70"
    ctx.lineWidth = 2
    for (let i = 0; i <= 8; i += 1) {
      ctx.beginPath()
      ctx.moveTo(i * tile + 0.5, 0)
      ctx.lineTo(i * tile + 0.5, 256)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * tile + 0.5)
      ctx.lineTo(256, i * tile + 0.5)
      ctx.stroke()
    }
    ctx.fillStyle = night ? "rgba(74, 52, 28, 0.55)" : "rgba(92, 64, 36, 0.45)"
    ;[
      [40, 70, 14],
      [150, 40, 18],
      [200, 180, 16],
      [90, 200, 12],
      [220, 100, 10],
    ].forEach(([sx, sy, r]) => {
      ctx.beginPath()
      ctx.ellipse(sx, sy, r, r * 0.7, 0.4, 0, Math.PI * 2)
      ctx.fill()
    })
    texture.needsUpdate = true
    return texture
  }, [night])
  useEffect(() => () => checker.dispose(), [checker])

  const backWall = night ? "#2a241e" : "#d8cfc2"
  const leftWall = night ? "#1e1916" : "#c4baac"
  const rightWall = night ? "#342c26" : "#e6ded2"
  const trim = night ? "#2a2118" : "#8a7a68"
  const door = night ? "#050505" : "#2a2620"
  const roomX = 4.4
  const floorY = -0.5
  const ceilY = 2.35
  const backZ = -2.7
  const frontZ = 2.85
  const thick = 0.16
  const doorZ0 = -0.25
  const doorZ1 = 0.95
  const doorTop = 1.55
  const spanZ = frontZ - backZ
  const spanY = ceilY - floorY
  const floorW = roomX * 2 + thick * 2
  const floorD = spanZ + thick
  const floorX0 = -floorW / 2
  const floorZ0 = (backZ + frontZ) / 2 - floorD / 2
  return (
    <group>
      <mesh receiveShadow position={[0, floorY - thick / 2, (backZ + frontZ) / 2]}>
        <boxGeometry args={[roomX * 2 + thick * 2, thick, spanZ + thick]} />
        <meshStandardMaterial map={checker} roughness={0.92} />
      </mesh>
      <BackWall
        night={night}
        color={backWall}
        trim={trim}
        floorY={floorY}
        ceilY={ceilY}
        backZ={backZ}
        thick={thick}
        roomX={roomX}
        checker={checker}
        floorX0={floorX0}
        floorZ0={floorZ0}
        floorW={floorW}
        floorD={floorD}
      />
      <mesh position={[0, ceilY + thick / 2, (backZ + frontZ) / 2]}>
        <boxGeometry args={[roomX * 2 + thick * 2, thick, spanZ + thick]} />
        <meshStandardMaterial color={night ? "#100e0c" : "#f1ebe3"} roughness={1} />
      </mesh>
      {[-1, 1].map((side) => {
        const x = side * (roomX + thick / 2)
        const rearLen = doorZ0 - backZ
        const frontLen = frontZ - doorZ1
        const lintelH = ceilY - doorTop
        const sideWall = side < 0 ? leftWall : rightWall
        return (
          <group key={side}>
            <mesh receiveShadow position={[x, (floorY + ceilY) / 2, backZ + rearLen / 2]}>
              <boxGeometry args={[thick, spanY + 0.02, rearLen + thick]} />
              <meshStandardMaterial color={sideWall} roughness={0.95} />
            </mesh>
            <mesh receiveShadow position={[x, (floorY + ceilY) / 2, doorZ1 + frontLen / 2]}>
              <boxGeometry args={[thick, spanY + 0.02, frontLen]} />
              <meshStandardMaterial color={sideWall} roughness={0.95} />
            </mesh>
            <mesh receiveShadow position={[x, doorTop + lintelH / 2, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[thick, lintelH + 0.02, doorZ1 - doorZ0]} />
              <meshStandardMaterial color={sideWall} roughness={0.95} />
            </mesh>
            <mesh position={[side * (roomX - 0.02), (floorY + doorTop) / 2, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[0.04, doorTop - floorY, doorZ1 - doorZ0]} />
              <meshStandardMaterial color={door} />
            </mesh>
            <mesh position={[side * roomX, (floorY + doorTop) / 2, doorZ0]}>
              <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
              <meshStandardMaterial color={trim} />
            </mesh>
            <mesh position={[side * roomX, (floorY + doorTop) / 2, doorZ1]}>
              <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
              <meshStandardMaterial color={trim} />
            </mesh>
            <mesh position={[side * roomX, doorTop, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[0.06, 0.06, doorZ1 - doorZ0]} />
              <meshStandardMaterial color={trim} />
            </mesh>
          </group>
        )
      })}
      {[
        [-4.05, 2.05, -2.4, 0.8],
        [4.05, 2.05, -2.4, -0.8],
        [-4.05, 2.05, 2.15, 2.4],
        [4.05, 2.05, 2.15, -2.4],
      ].map(([x, y, z, turn]) => (
        <mesh key={`${x}${z}`} position={[x, y, z]} rotation={[0, turn, 0]}>
          <circleGeometry args={[0.32, 7]} />
          <meshStandardMaterial color="#f4f4f4" transparent opacity={night ? 0.16 : 0.32} side={2} />
        </mesh>
      ))}
      <WallPosters night={night} />
      <Peel position={[-4.34, 1.45, -2.6]} rotation={[0, 0, 0.1]} paint={night ? "#4a4036" : "#f0e6d8"} under={night ? "#120e0b" : "#8a7d6c"} size={0.36} />
      <Peel position={[3.55, 1.35, -2.6]} rotation={[0, 0, -0.08]} paint={night ? "#4a4036" : "#f0e6d8"} under={night ? "#120e0b" : "#8a7d6c"} />
      <Peel position={[-4.34, 0.15, -1.1]} rotation={[0, Math.PI / 2, 0.15]} paint={night ? "#3a332c" : "#ddd4c6"} under={night ? "#100e0c" : "#7d7366"} />
      <Peel position={[4.34, 0.2, 0.5]} rotation={[0, -Math.PI / 2, -0.1]} paint={night ? "#4e453c" : "#f4ece2"} under={night ? "#1a1612" : "#b3a894"} />
      {[
        [-3.85, -2.15],
        [3.85, -2.15],
        [-3.85, 2.25],
        [3.85, 2.25],
      ].map(([x, z]) => (
        <mesh key={`dust${x}${z}`} position={[x, floorY + 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 16]} />
          <meshStandardMaterial color={night ? "#1a120c" : "#6b5c4a"} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function DeskPanel({ id, night, onClose }: { id: DeskId; night: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const kill = getResource("killReport")
  const quest = getResource("questReport")
  const board = getResource("questBoard")
  const points = getResource("pointsList")
  const population = getResource("populationList")
  const graveyard = getResource("graveyard")

  useEffect(() => {
    closeRef.current?.focus()
  }, [id])

  const title =
    id === "rules"
      ? "Game Rules"
      : id === "zones"
        ? "Safe Zones"
        : id === "clock"
          ? "Countdown"
          : id === "bounty"
            ? "Bounty"
            : id === "board"
              ? board.label
              : id === "kill"
                ? kill.label
                : id === "quest"
                  ? quest.label
                  : id === "points"
                    ? points.label
                    : id === "population"
                      ? population.label
                      : graveyard.label

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-desk-title"
      className={`absolute inset-3 z-20 flex flex-col p-3 md:inset-10 ${night ? "bg-[#1a1612]/95" : "bg-[#f3ead7]/95"}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="lab-desk-title" className={`font-mono text-sm ${night ? "text-[#f3ead7]" : "text-[#2a2118]"}`}>
          {title}
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`min-h-11 cursor-pointer px-3 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6a860] ${night ? "text-[#f3ead7]" : "text-[#2a2118]"}`}
        >
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-[#f3ead7] text-[#2a2118]">
        <PanelBody id={id} />
      </div>
    </div>
  )
}

function LinkedBody({ label, detail, href }: { label: string; detail?: string; href: string }) {
  if (!href) {
    return (
      <div className="p-6" aria-disabled="true">
        <p className="font-mono text-lg font-bold">{label}</p>
        {detail ? <p className="mt-2 max-w-[36rem] font-mono text-sm leading-relaxed text-[#5c4a38]">{detail}</p> : null}
      </div>
    )
  }
  return (
    <div>
      <iframe title={label} src={href} className="h-[60dvh] w-full bg-white" />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center px-4 font-mono text-sm font-bold underline"
      >
        {label}
      </a>
    </div>
  )
}

function PanelBody({ id }: { id: DeskId }) {
  if (id === "rules") {
    return <iframe title="Game Rules" src="/rules" className="h-[70dvh] w-full bg-white" />
  }
  if (id === "zones") {
    return <iframe title="Safe Zones" src="/safe-zones" className="h-[70dvh] w-full bg-white" />
  }
  if (id === "board") return <QuestBoardEmbed resource={getResource("questBoard")} />
  if (id === "bounty") return <div className="p-4"><BountyCard /></div>
  if (id === "clock") return <div className="p-4"><GameCountdown /></div>
  if (id === "kill") {
    const resource = getResource("killReport")
    return <LinkedBody label={resource.label} detail={resource.description} href={resource.href} />
  }
  if (id === "quest") {
    const resource = getResource("questReport")
    return <LinkedBody label={resource.label} detail={resource.description} href={resource.href} />
  }
  if (id === "points") {
    const resource = getResource("pointsList")
    return <LinkedBody label={resource.label} detail={resource.description} href={resource.href} />
  }
  if (id === "population") {
    const resource = getResource("populationList")
    return <LinkedBody label={resource.label} detail={resource.description} href={resource.href} />
  }
  const resource = getResource("graveyard")
  return <LinkedBody label={resource.label} detail={resource.description} href={resource.href} />
}

function LockedCamera() {
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    camera.position.set(0.12, 1.7, 3.35)
    camera.lookAt(0, 0.45, 0.05)
    camera.updateProjectionMatrix()
  }, [camera])
  return null
}

function Scene({
  lit,
  night,
  reduced,
  marker,
  onOver,
  onOut,
  onPick,
}: {
  lit: DeskId | null
  night: boolean
  reduced: boolean
  marker: React.RefObject<HTMLDivElement | null>
  onOver: (id: DeskId) => void
  onOut: (id: DeskId) => void
  onPick: (id: DeskId) => void
}) {
  return (
    <>
      <OfficeShell night={night} />
      <group position={[0, -0.5, 0.95]}>
        <Room reduced={reduced} night={night} />
        {ITEMS.map((item) => (
          <DeskObject
            key={item.id}
            url={item.url}
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            glow={lit === item.id}
            marker={marker}
            onOver={() => onOver(item.id)}
            onOut={() => onOut(item.id)}
            onPick={() => onPick(item.id)}
          />
        ))}
        <SecurityWall lit={lit} marker={marker} onOver={onOver} onOut={onOut} onPick={onPick} />
        <DeskNote />
        <CsaLogo />
      </group>
      <HangingSign night={night} />
      <LockedCamera />
    </>
  )
}

export function LabDesk() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const [lit, setLit] = useState<DeskId | null>(null)
  const [open, setOpen] = useState<DeskId | null>(null)
  const marker = useRef<HTMLDivElement>(null)
  const night = !mounted || resolvedTheme !== "light"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-[calc(100dvh-4.25rem)]">
      <div className="absolute inset-0 touch-none">
        <Canvas
          shadows={{ type: PCFSoftShadowMap }}
          gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1 }}
          camera={{ position: [0.12, 1.7, 3.35], fov: 42 }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene
              lit={lit}
              night={night}
              reduced={reducedMotion}
              marker={marker}
              onOver={setLit}
              onOut={(id) => setLit((current) => (current === id ? null : current))}
              onPick={(id) => {
                setLit(id)
                setOpen(id)
              }}
            />
          </Suspense>
        </Canvas>
      </div>
      <SignOverlay night={night} reduced={reducedMotion} />
      {lit ? (
        <div
          ref={marker}
          className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] px-4 py-2 font-mono text-4xl leading-none ${night ? "bg-black/75 text-[#f3ead7]" : "bg-[#f7f1e6]/95 text-[#2a2118]"}`}
        >
          {ITEMS.find((item) => item.id === lit)?.label ?? FEEDS.find((feed) => feed.id === lit)?.label}
        </div>
      ) : null}
      {open ? <DeskPanel id={open} night={night} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}
