"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { ACESFilmicToneMapping, Box3, CanvasTexture, Color, Group, Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap, RepeatWrapping, SpotLight, SRGBColorSpace, TextureLoader, Vector3 } from "three"
import { BountyCard } from "@/components/bounty-card"
import { GameCountdown } from "@/components/game-countdown"
import { RulesContent } from "@/components/rules-content"
import { SafeZonesContent } from "@/components/safe-zones-content"
import { resourceEmbedUrl } from "@/content/links"
import { useGameLiveOverride } from "@/hooks/game-live-override"
import { useGameLive } from "@/hooks/use-game-live"
import { easternDay, getTimeUntilGameStart } from "@/lib/game-start"
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
  | "feedback"

const ITEMS: {
  id: DeskId
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}[] = [
  { id: "points", url: "/lab/models/computerScreen.glb", position: [0, 0.73, -1.08], rotation: [0, 0, 0], scale: 2.6 },
  { id: "kill", url: "/lab/models/cooking-knife.glb", position: [1.06, 0.73, 0.12], rotation: [0, -1.15, 0], scale: 2.2 },
  { id: "quest", url: "/lab/models/cardboardBoxOpen.glb", position: [0.95, 0.73, -0.71], rotation: [0, -0.9, 0], scale: 1.45 },
  { id: "zones", url: "/lab/models/computerKeyboard.glb", position: [0, 0.73, -0.05], rotation: [0, 0, 0], scale: 4.2 },
  { id: "feedback", url: "/lab/models/books.glb", position: [1.38, 0.73, -0.28], rotation: [0, 0.4, 0], scale: 3.4 },
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
    const center = (world.x * 0.5 + 0.5) * size.width
    const half = el.offsetWidth / 2
    const margin = 12
    const min = margin + half
    const max = size.width - margin - half
    el.style.left = `${min <= max ? Math.min(max, Math.max(min, center)) : size.width / 2}px`
    let top = (-world.y * 0.5 + 0.5) * size.height
    // Resting sign band only. Do not read the swinging sign, or the title follows it.
    const floor = size.height * 0.06 + 116
    const lift = el.offsetHeight + 12
    if (top - lift < floor) top = floor + lift
    el.style.top = `${top}px`
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

type DeskPointerEvent = { stopPropagation: () => void }

function deskPointerHandlers(hover: boolean, onOver: () => void, onOut: () => void, onPick: () => void) {
  return {
    onPointerOver: (event: DeskPointerEvent) => {
      event.stopPropagation()
      if (!hover) {
        document.body.style.cursor = "auto"
        return
      }
      onOver()
    },
    onPointerOut: (event: DeskPointerEvent) => {
      event.stopPropagation()
      if (!hover) return
      onOut()
    },
    onClick: (event: DeskPointerEvent) => {
      event.stopPropagation()
      if (!hover) return
      onPick()
    },
  }
}

function DeskObject({
  url,
  position,
  rotation,
  scale,
  glow,
  marker,
  hover,
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
  hover: boolean
  onOver: () => void
  onOut: () => void
  onPick: () => void
}) {
  return (
    <group position={position} rotation={rotation} scale={scale} {...deskPointerHandlers(hover, onOver, onOut, onPick)}>
      <OfficeModel url={url} glow={glow} marker={marker} />
    </group>
  )
}

const TV_URL = "/lab/models/televisionVintage.glb"
useGLTF.preload(TV_URL)

const FEEDS: { id: DeskId; col: number; row: number }[] = [
  { id: "population", col: 1, row: 1 },
  { id: "rules", col: 2, row: 1 },
  { id: "graveyard", col: 1, row: 0 },
  { id: "board", col: 2, row: 0 },
]

function SecurityWall({
  lit,
  marker,
  hover,
  onOver,
  onOut,
  onPick,
}: {
  lit: DeskId | null
  marker: React.RefObject<HTMLDivElement | null>
  hover: boolean
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
      {FEEDS.map((feed) => (
        <group
          key={`${feed.col}-${feed.row}`}
          position={[(feed.col - 1) * pitchX, feed.row * pitchY, 0]}
          scale={scale}
          {...deskPointerHandlers(
            hover,
            () => onOver(feed.id),
            () => onOut(feed.id),
            () => onPick(feed.id),
          )}
        >
          <OfficeModel url={TV_URL} glow={lit === feed.id} marker={marker} />
        </group>
      ))}
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

// Night neon on the hanging sign. Each letter is a source.
const NIGHT_DESK = {
  y: 1.55,
  z: -0.25,
  span: 2.4,
  intensity: 22,
  color: "#ff9a3c",
  /** Reaches the desktop under the sign and dies before the back wall. */
  distance: 2.35,
}

function LetterGlow({ x }: { x: number }) {
  return (
    <pointLight
      position={[x, NIGHT_DESK.y, NIGHT_DESK.z]}
      color={NIGHT_DESK.color}
      intensity={NIGHT_DESK.intensity}
      distance={NIGHT_DESK.distance}
      decay={2}
    />
  )
}

function HangingSign() {
  const letters = [...SIGN_TEXT]
  return (
    <>
      {letters.map((char, index) => {
        if (char === " ") return null
        const x = ((index + 0.5) / letters.length - 0.5) * NIGHT_DESK.span
        return <LetterGlow key={index} x={x} />
      })}
    </>
  )
}

function SignOverlay({ reduced }: { reduced: boolean }) {
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
  const rope = "#b0b0b0"

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[6%] z-10 flex justify-center">
      <div ref={swing} style={{ transformOrigin: "top center" }}>
        <div className="hero-sign__panel" style={{ position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: "100%", height: "4.5rem" }}>
            <span style={{ position: "absolute", top: 0, left: "-0.15rem", right: "-0.15rem", height: 5, background: "linear-gradient(180deg, #4a4a4a 0%, #1a1a1a 100%)", border: "1px solid #000" }} />
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

/** Desk-top footprints. ponytail: padded guesses, not measured model bounds; widen a box if a prop grows into the logo. */
const DESK_BLOCKS: { x: number; z: number; hw: number; hd: number }[] = [
  { x: 0, z: -1.08, hw: 0.7, hd: 0.45 },
  { x: 0, z: -0.62, hw: 0.4, hd: 0.25 },
  { x: 0, z: -0.05, hw: 1.15, hd: 0.32 },
  { x: 0.95, z: -0.71, hw: 0.45, hd: 0.4 },
  { x: 1.06, z: 0.12, hw: 0.55, hd: 0.28 },
  { x: -1.7, z: -0.7, hw: 1.2, hd: 0.55 },
  { x: -1.62, z: 0.28, hw: 0.4, hd: 0.4 },
  { x: -0.95, z: 0.42, hw: 0.42, hd: 0.32 },
  { x: 1.38, z: -0.28, hw: 0.78, hd: 0.6 },
]

function dayUnit(day: string, salt: number) {
  let hash = salt + 1
  for (let i = 0; i < day.length; i += 1) hash = Math.imul(hash ^ day.charCodeAt(i), 16777619)
  return ((hash >>> 0) % 10000) / 10000
}

function logoSpot(day: string) {
  const yaw = (dayUnit(day, 7) - 0.5) * 0.12
  const half = 0.19 * (Math.abs(Math.cos(yaw)) + Math.abs(Math.sin(yaw))) + 0.05
  // In front of the keyboard and right of the note. Both edges stay inside the frame.
  const x0 = 0
  const x1 = 0.4
  const z0 = 0.52
  const z1 = 0.62
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const x = x0 + dayUnit(day, attempt * 2 + 1) * (x1 - x0)
    const z = z0 + dayUnit(day, attempt * 2 + 2) * (z1 - z0)
    const clear = DESK_BLOCKS.every(
      (block) => Math.abs(x - block.x) >= block.hw + half || Math.abs(z - block.z) >= block.hd + half,
    )
    if (clear) return { x, z, yaw }
  }
  return { x: 0.2, z: 0.56, yaw: 0 }
}

function CsaLogo() {
  const override = useGameLiveOverride()
  const clock = override?.simulatedNow
  const [day, setDay] = useState(() => easternDay(Date.now()))
  useEffect(() => {
    const read = () => easternDay(clock ?? Date.now())
    setDay(read())
    if (clock != null) return
    const id = window.setInterval(() => setDay(read()), 60_000)
    return () => window.clearInterval(id)
  }, [clock])
  const spot = useMemo(() => logoSpot(day), [day])
  const map = useMemo(() => {
    const texture = new TextureLoader().load("/images/csa_square_logo.png")
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={[spot.x, 0.734, spot.z]} rotation={[0, spot.yaw, 0]} receiveShadow>
      <boxGeometry args={[0.38, 0.004, 0.38]} />
      <meshStandardMaterial attach="material-0" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-1" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-2" map={map} roughness={0.72} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      <meshStandardMaterial attach="material-3" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-4" color="#7a1f1a" roughness={0.9} />
      <meshStandardMaterial attach="material-5" color="#7a1f1a" roughness={0.9} />
    </mesh>
  )
}

function WallPosters() {
  const maps = useMemo(
    () => [
      posterMap("STAY IN", "#1a120c", "#c9ae6a"),
      posterMap("REPORT", "#1a120c", "#c9ae6a"),
    ],
    [],
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

function Room({ reduced }: { reduced: boolean }) {
  const { scene } = useThree()
  useEffect(() => {
    const bg = new Color("#070605")
    scene.background = bg
    return () => {
      scene.background = null
    }
  }, [scene])
  return (
    <>
      <hemisphereLight args={["#ffb070", "#1a120c", 0.38]} />
      <DeskModel />
      <DeskFan reduced={reduced} />
    </>
  )
}

function HallFluorescent({
  x,
  y,
  z,
  floorY,
  dead = false,
  flicker = false,
  flash,
}: {
  x: number
  y: number
  z: number
  floorY: number
  dead?: boolean
  flicker?: boolean
  flash?: React.RefObject<{ bunny: boolean; bear: boolean }>
}) {
  const hall = useGameLiveOverride()?.hallPreview ?? "auto"
  const lit = !dead && hall !== "off"
  const flickering = hall === "flicker" || (hall === "auto" && flicker)
  const light = useRef<SpotLight>(null)
  const bulb = useRef<MeshStandardMaterial>(null)
  const target = useRef<Object3D>(null)
  const seed = useRef(Math.random() * 1000)
  const hold = useRef(0)
  const wasDim = useRef(false)
  useEffect(() => {
    if (light.current && target.current) light.current.target = target.current
  }, [lit])
  useFrame(({ clock }) => {
    if (dead || !lit || !light.current) return
    if (!flickering) {
      light.current.intensity = 400
      if (bulb.current) bulb.current.emissiveIntensity = 1.6
      wasDim.current = false
      if (flash) {
        flash.current.bunny = false
        flash.current.bear = false
      }
      return
    }
    const step = Math.floor(clock.elapsedTime * 14 + seed.current)
    const n = Math.sin(step * 127.1 + seed.current) * 43758.5453
    const h = n - Math.floor(n)
    const k = h > 0.96 ? 0.2 : h > 0.9 ? 0.5 : 1
    light.current.intensity = 400 * k
    if (bulb.current) bulb.current.emissiveIntensity = 1.6 * k
    const dim = k < 1
    if (dim && !wasDim.current && flash) {
      const roll = Math.random()
      flash.current.bunny = roll < 0.25
      flash.current.bear = roll >= 0.25 && roll < 0.5
      hold.current = clock.elapsedTime + 0.4
    }
    wasDim.current = dim
    if (flash && clock.elapsedTime >= hold.current) {
      flash.current.bunny = false
      flash.current.bear = false
    }
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
          color={dead || !lit ? "#6a6e72" : "#e7f3ff"}
          emissive={dead || !lit ? "#000000" : "#c5ddff"}
          emissiveIntensity={dead || !lit ? 0 : 1.6}
        />
      </mesh>
      {lit && (
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

function CostumeSilhouette({
  kind,
  x,
  y,
  z,
}: {
  kind: "bunny" | "bear"
  x: number
  y: number
  z: number
}) {
  const bunny = kind === "bunny"
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[bunny ? 0.42 : 0.56, 1.1, 0.28]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      <mesh position={[-0.14, 0.28, 0]}>
        <boxGeometry args={[0.14, 0.56, 0.16]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      <mesh position={[0.14, 0.28, 0]}>
        <boxGeometry args={[0.14, 0.56, 0.16]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[bunny ? 0.2 : 0.24, 12, 10]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      {bunny ? (
        <>
          <mesh position={[-0.08, 2.05, 0]}>
            <boxGeometry args={[0.07, 0.46, 0.04]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
          <mesh position={[0.08, 2.05, 0]}>
            <boxGeometry args={[0.07, 0.46, 0.04]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.16, 1.88, 0]}>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
          <mesh position={[0.16, 1.88, 0]}>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
        </>
      )}
    </group>
  )
}

function HallFigures({
  y0,
  z,
  flash,
}: {
  y0: number
  z: number
  flash: React.RefObject<{ bunny: boolean; bear: boolean }>
}) {
  const hall = useGameLiveOverride()?.hallPreview ?? "auto"
  const bunny = useRef<Group>(null)
  const bear = useRef<Group>(null)
  useFrame(() => {
    const show = hall === "flicker" || hall === "auto"
    if (bunny.current) bunny.current.visible = show && flash.current.bunny
    if (bear.current) bear.current.visible = show && flash.current.bear
  })
  return (
    <group>
      <group ref={bunny} visible={false}>
        <CostumeSilhouette kind="bunny" x={-3.55} y={y0} z={z} />
      </group>
      <group ref={bear} visible={false}>
        <CostumeSilhouette kind="bear" x={-0.55} y={y0} z={z} />
      </group>
    </group>
  )
}

function Hallway({
  flicker,
  y0,
  y1,
  z0,
  checker,
  floorX0,
  floorZ0,
  floorW,
  floorD,
}: {
  flicker: boolean
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
  const midX = (left + right) / 2
  const midY = (y0 + y1) / 2
  const midZ = (z0 + z1) / 2
  const span = right - left
  const flash = useRef({ bunny: false, bear: false })
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
        <meshStandardMaterial color="#1c2830" roughness={0.95} />
      </mesh>
      <mesh position={[left, midY, midZ]}>
        <boxGeometry args={[0.08, y1 - y0, depth]} />
        <meshStandardMaterial color="#141c22" roughness={0.95} />
      </mesh>
      <mesh position={[right, midY, midZ]}>
        <boxGeometry args={[0.08, y1 - y0, depth]} />
        <meshStandardMaterial color="#141c22" roughness={0.95} />
      </mesh>
      <mesh position={[midX, midY, z1]}>
        <boxGeometry args={[span, y1 - y0, 0.08]} />
        <meshStandardMaterial color="#1c2830" roughness={0.95} />
      </mesh>
      {[-5.4, -3.35, -0.9].map((x) => (
        <HallFluorescent
          key={x}
          dead={x !== -3.35}
          flicker={flicker}
          flash={x === -3.35 ? flash : undefined}
          x={x}
          y={y1 - 0.1}
          z={z0 - 1.15}
          floorY={y0}
        />
      ))}
      <HallFigures y0={y0} z={z0 - 1.8} flash={flash} />
    </group>
  )
}

function BackWall({
  flicker,
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
  flicker: boolean
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
    <mesh key={key} castShadow position={[(x0 + x1) / 2, (y0 + y1) / 2, z]}>
      <boxGeometry args={[x1 - x0, y1 - y0, thick]} />
      <meshStandardMaterial color="#2a241e" roughness={0.95} />
    </mesh>
  )
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
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <mesh position={[doorX1, (floorY + doorTop) / 2, backZ + 0.02]}>
        <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <group position={[doorX0 + 0.04, (floorY + doorTop) / 2, backZ]} rotation={[0, -0.75, 0]}>
        <mesh castShadow position={[(doorX1 - doorX0) / 2, 0, 0]}>
          <boxGeometry args={[doorX1 - doorX0 - 0.1, doorTop - floorY - 0.08, 0.05]} />
          <meshStandardMaterial color="#8a5a32" roughness={0.72} />
        </mesh>
      </group>
      <Hallway
        flicker={flicker}
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
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, (winY0 + winY1) / 2, backZ + 0.02]}>
        <boxGeometry args={[winX1 - winX0 - 0.08, winY1 - winY0 - 0.06, 0.03]} />
        <meshStandardMaterial
          color="#7eb6d6"
          transparent
          opacity={0.34}
          roughness={0.04}
          metalness={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, winY1, backZ + 0.03]}>
        <boxGeometry args={[winX1 - winX0, 0.05, 0.05]} />
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <mesh position={[(winX0 + winX1) / 2, winY0, backZ + 0.03]}>
        <boxGeometry args={[winX1 - winX0, 0.05, 0.05]} />
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <mesh position={[winX0, (winY0 + winY1) / 2, backZ + 0.03]}>
        <boxGeometry args={[0.05, winY1 - winY0, 0.05]} />
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
      <mesh position={[winX1, (winY0 + winY1) / 2, backZ + 0.03]}>
        <boxGeometry args={[0.05, winY1 - winY0, 0.05]} />
        <meshStandardMaterial color="#2a2118" roughness={0.95} />
      </mesh>
    </group>
  )
}

function paintPeel(canvas: HTMLCanvasElement, paint: string, under: string) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
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
  const map = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    paintPeel(canvas, paint, under)
    texture.needsUpdate = true
    return texture
  }, [paint, under])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={map} transparent alphaTest={0.2} roughness={0.95} depthWrite={false} />
    </mesh>
  )
}

function paintChecker(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const tile = 32
  const light = "#e4dcc8"
  const dark = "#070707"
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? light : dark
      ctx.fillRect(x * tile, y * tile, tile, tile)
    }
  }
  ctx.strokeStyle = "#3a342c"
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
  ctx.fillStyle = "#4a341c"
  ctx.globalAlpha = 0.55
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
  ctx.globalAlpha = 1
}

function OfficeShell({ flicker }: { flicker: boolean }) {
  const checker = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    paintChecker(canvas)
    texture.needsUpdate = true
    return texture
  }, [])
  useEffect(() => () => checker.dispose(), [checker])

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
        flicker={flicker}
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
        <meshStandardMaterial color="#100e0c" roughness={1} />
      </mesh>
      {[-1, 1].map((side) => {
        const x = side * (roomX + thick / 2)
        const rearLen = doorZ0 - backZ
        const frontLen = frontZ - doorZ1
        const lintelH = ceilY - doorTop
        const wallTo = side < 0 ? "#1e1916" : "#342c26"
        return (
          <group key={side}>
            <mesh receiveShadow position={[x, (floorY + ceilY) / 2, backZ + rearLen / 2]}>
              <boxGeometry args={[thick, spanY + 0.02, rearLen + thick]} />
              <meshStandardMaterial color={wallTo} roughness={0.95} />
            </mesh>
            <mesh receiveShadow position={[x, (floorY + ceilY) / 2, doorZ1 + frontLen / 2]}>
              <boxGeometry args={[thick, spanY + 0.02, frontLen]} />
              <meshStandardMaterial color={wallTo} roughness={0.95} />
            </mesh>
            <mesh receiveShadow position={[x, doorTop + lintelH / 2, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[thick, lintelH + 0.02, doorZ1 - doorZ0]} />
              <meshStandardMaterial color={wallTo} roughness={0.95} />
            </mesh>
            <mesh position={[side * (roomX - 0.02), (floorY + doorTop) / 2, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[0.04, doorTop - floorY, doorZ1 - doorZ0]} />
              <meshStandardMaterial color="#050505" roughness={1} />
            </mesh>
            <mesh position={[side * roomX, (floorY + doorTop) / 2, doorZ0]}>
              <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
              <meshStandardMaterial color="#2a2118" roughness={0.95} />
            </mesh>
            <mesh position={[side * roomX, (floorY + doorTop) / 2, doorZ1]}>
              <boxGeometry args={[0.06, doorTop - floorY, 0.06]} />
              <meshStandardMaterial color="#2a2118" roughness={0.95} />
            </mesh>
            <mesh position={[side * roomX, doorTop, (doorZ0 + doorZ1) / 2]}>
              <boxGeometry args={[0.06, 0.06, doorZ1 - doorZ0]} />
              <meshStandardMaterial color="#2a2118" roughness={0.95} />
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
          <meshStandardMaterial color="#f4f4f4" transparent opacity={0.16} side={2} />
        </mesh>
      ))}
      <WallPosters />
      <Peel position={[-4.34, 1.45, -2.6]} rotation={[0, 0, 0.1]} paint="#4a4036" under="#120e0b" size={0.36} />
      <Peel position={[3.55, 1.35, -2.6]} rotation={[0, 0, -0.08]} paint="#4a4036" under="#120e0b" />
      <Peel position={[-4.34, 0.15, -1.1]} rotation={[0, Math.PI / 2, 0.15]} paint="#3a332c" under="#100e0c" />
      <Peel position={[4.34, 0.2, 0.5]} rotation={[0, -Math.PI / 2, -0.1]} paint="#4e453c" under="#1a1612" />
      {[
        [-3.85, -2.15],
        [3.85, -2.15],
        [-3.85, 2.25],
        [3.85, 2.25],
      ].map(([x, z]) => (
        <mesh key={`dust${x}${z}`} position={[x, floorY + 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 16]} />
          <meshStandardMaterial color="#1a120c" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

const LINKED_DESK: Partial<Record<DeskId, Parameters<typeof getResource>[0]>> = {
  kill: "killReport",
  quest: "questReport",
  points: "questBoard",
  population: "populationList",
  graveyard: "graveyard",
  board: "pointsList",
  feedback: "feedback",
}

const PAGE_DESK: Partial<Record<DeskId, { label: string; description?: string }>> = {
  rules: { label: "Game Rules", description: "Basic rules, specific rules, and things to note" },
  zones: { label: "Safe Zones", description: "Residences, classes, gym, CSA events, and more" },
  clock: { label: "Countdown" },
  bounty: { label: "Bounty" },
}

function deskCopy(id: DeskId): { label: string; description?: string } {
  const linkId = LINKED_DESK[id]
  if (linkId) {
    const resource = getResource(linkId)
    return { label: resource.label, description: resource.description }
  }
  return PAGE_DESK[id] ?? { label: id }
}

function canOpenDesk(id: DeskId) {
  const linkId = LINKED_DESK[id]
  if (!linkId) return true
  return Boolean(getResource(linkId).href)
}

function CountdownTab({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const ink = "#f3ead7"
  const paper = "#1a1612"
  const edge = "#d6a860"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Countdown"
      className="absolute bottom-4 left-1/2 z-20 w-[min(42rem,calc(100%-1.5rem))] md:bottom-8"
      style={{ transform: "translateX(-50%) rotate(-0.6deg)" }}
    >
      <div
        className="relative ml-8 inline-block border border-b-0 px-4 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: ink, backgroundColor: "#3a2a18", borderColor: edge }}
      >
        <span
          aria-hidden="true"
          className="absolute -left-3 top-1 h-3 w-8 -rotate-6 opacity-70"
          style={{ backgroundColor: "rgba(80, 60, 40, 0.55)" }}
        />
        Countdown
      </div>
      <div
        className="desk-prop-manila relative border px-3 py-3 shadow-[8px_10px_0_rgba(0,0,0,0.35)] md:px-5 md:py-4"
        style={{ backgroundColor: paper, borderColor: edge, color: ink }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 right-10 h-4 w-14 rotate-3 opacity-80"
          style={{ backgroundColor: "rgba(90, 70, 45, 0.6)" }}
        />
        <div className="mb-1 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer px-3 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6a860]"
            style={{ color: ink }}
          >
            Close
          </button>
        </div>
        <GameCountdown />
      </div>
    </div>
  )
}

function DeskPanel({ id, onClose }: { id: DeskId; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const copy = deskCopy(id)

  useEffect(() => {
    closeRef.current?.focus()
  }, [id])

  const title = copy.label

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="desk-popup absolute inset-x-3 bottom-3 top-[5.25rem] z-20 flex flex-col p-2 md:inset-x-10 md:bottom-10"
      style={{ backgroundColor: "#1a1612" }}
    >
      <div className="mb-2 flex justify-end">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="min-h-11 cursor-pointer px-3 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6a860]"
          style={{ color: "#f3ead7" }}
        >
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <PanelBody id={id} />
      </div>
    </div>
  )
}

function LinkedBody({ label, href }: { label: string; href: string }) {
  const src = resourceEmbedUrl(href)
  const form = Boolean(src?.includes("/forms/") && src.includes("viewform"))
  return (
    <div>
      {form || !src ? null : (
        <iframe title={label} src={src} className="h-[60dvh] w-full border bg-white" />
      )}
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
  if (id === "rules") return <RulesContent />
  if (id === "zones") return <SafeZonesContent />
  if (id === "bounty") return <div className="p-4"><BountyCard /></div>
  const linkId = LINKED_DESK[id]
  if (!linkId) return null
  const resource = getResource(linkId)
  return <LinkedBody label={resource.label} href={resource.href} />
}

function countdownParts(now: number) {
  const totalSeconds = Math.max(0, Math.floor(getTimeUntilGameStart(now) / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function paintClockFace(
  canvas: HTMLCanvasElement,
  parts: { days: number; hours: number; minutes: number; seconds: number },
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.fillStyle = "#140e0a"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#e7c27a"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const units = [
    [parts.days, "D"],
    [parts.hours, "H"],
    [parts.minutes, "M"],
    [parts.seconds, "S"],
  ] as const
  units.forEach(([value, label], index) => {
    const x = 64 + index * 128
    ctx.font = "700 84px monospace"
    ctx.fillText(value.toString().padStart(2, "0"), x, 78)
    ctx.font = "700 28px monospace"
    ctx.fillText(label, x, 156)
    if (index === units.length - 1) return
    ctx.font = "700 72px monospace"
    ctx.fillText(":", x + 64, 74)
  })
}

function DeskClock({
  glow,
  marker,
  onOver,
  onOut,
  onPick,
}: {
  glow: boolean
  marker: React.RefObject<HTMLDivElement | null>
  onOver: () => void
  onOut: () => void
  onPick: () => void
}) {
  const live = useGameLive()
  const override = useGameLiveOverride()
  const face = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 200
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return { canvas, texture }
  }, [])

  useEffect(() => () => face.texture.dispose(), [face])

  useEffect(() => {
    if (live) return
    const draw = () => {
      paintClockFace(face.canvas, countdownParts(override?.simulatedNow ?? Date.now()))
      face.texture.needsUpdate = true
    }
    draw()
    if (override?.simulatedNow != null) return
    const id = window.setInterval(draw, 1000)
    return () => window.clearInterval(id)
  }, [live, face, override?.simulatedNow])

  if (live) return null

  return (
    <group
      position={[0, 0.73, -0.62]}
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
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.14, 0.12]} />
        <meshStandardMaterial
          color="#3c3228"
          emissive={glow ? "#e0b15a" : "#000000"}
          emissiveIntensity={glow ? 0.3 : 0}
          roughness={0.86}
        />
      </mesh>
      <mesh position={[0, 0.07, 0.061]}>
        <planeGeometry args={[0.4, 0.09]} />
        <meshStandardMaterial map={face.texture} emissive="#e7c27a" emissiveMap={face.texture} emissiveIntensity={0.45} roughness={0.45} />
      </mesh>
      {glow ? <HoverPoint y={0.16} marker={marker} /> : null}
    </group>
  )
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
  flicker,
  reduced,
  live,
  marker,
  onOver,
  onOut,
  onPick,
}: {
  lit: DeskId | null
  flicker: boolean
  reduced: boolean
  live: boolean
  marker: React.RefObject<HTMLDivElement | null>
  onOver: (id: DeskId) => void
  onOut: (id: DeskId) => void
  onPick: (id: DeskId) => void
}) {
  return (
    <>
      <OfficeShell flicker={flicker} />
      <group position={[0, -0.5, 0.95]}>
        <Room reduced={reduced} />
        {ITEMS.map((item) => (
          <DeskObject
            key={item.id}
            url={item.url}
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            glow={lit === item.id}
            marker={marker}
            hover={live}
            onOver={() => onOver(item.id)}
            onOut={() => onOut(item.id)}
            onPick={() => onPick(item.id)}
          />
        ))}
        <SecurityWall lit={lit} marker={marker} hover={live} onOver={onOver} onOut={onOut} onPick={onPick} />
        <DeskClock
          glow={lit === "clock"}
          marker={marker}
          onOver={() => onOver("clock")}
          onOut={() => onOut("clock")}
          onPick={() => onPick("clock")}
        />
        <DeskNote />
        <CsaLogo />
      </group>
      <HangingSign />
      <LockedCamera />
    </>
  )
}

export function LabDesk() {
  const flicker = useGameLiveOverride()?.flicker ?? false
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const [lit, setLit] = useState<DeskId | null>(null)
  const [open, setOpen] = useState<DeskId | null>(null)
  const marker = useRef<HTMLDivElement>(null)
  const live = useGameLive()
  const litCopy = lit ? deskCopy(lit) : null

  useEffect(() => {
    if (live) setOpen((current) => (current === "clock" ? null : current))
    else setLit((current) => (current && current !== "clock" ? null : current))
  }, [live])

  return (
    <div className="relative h-dvh">
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
              flicker={flicker}
              reduced={reducedMotion}
              live={live}
              marker={marker}
              onOver={setLit}
              onOut={(id) => setLit((current) => (current === id ? null : current))}
              onPick={(id) => {
                if (!live && id !== "clock") return
                setLit(id)
                const external = id === "kill" || id === "quest" || id === "points"
                if (external) {
                  const linkId = id === "kill" ? "killReport" : id === "quest" ? "questReport" : "questBoard"
                  const href = getResource(linkId).href
                  if (href) window.open(href, "_blank", "noopener,noreferrer")
                  return
                }
                if (canOpenDesk(id)) setOpen(id)
              }}
            />
          </Suspense>
        </Canvas>
      </div>
      <SignOverlay reduced={reducedMotion} />
      {litCopy ? (
        <div
          ref={marker}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] px-4 py-2 font-mono text-4xl leading-none"
          style={{ color: "#f3ead7", backgroundColor: "#000000" }}
        >
          <div>{litCopy.label}</div>
          {litCopy.description ? (
            <div className="mt-1 text-base leading-tight">{litCopy.description}</div>
          ) : null}
        </div>
      ) : null}
      {open === "clock" ? (
        <CountdownTab onClose={() => setOpen(null)} />
      ) : open ? (
        <DeskPanel id={open} onClose={() => setOpen(null)} />
      ) : null}
    </div>
  )
}
