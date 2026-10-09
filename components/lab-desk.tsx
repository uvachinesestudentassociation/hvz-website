"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useTheme } from "next-themes"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { ACESFilmicToneMapping, Box3, CanvasTexture, Group, Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap, SpotLight, SRGBColorSpace, Vector3 } from "three"
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
  { id: "board", label: "Quest Board", url: "/lab/models/televisionVintage.glb", position: [0, 0.73, -1.08], rotation: [0, 0, 0], scale: 2.6 },
  { id: "points", label: "Points", url: "/lab/models/computerScreen.glb", position: [-0.95, 0.73, -1.02], rotation: [0, 0.35, 0], scale: 1.55 },
  { id: "bounty", label: "Bounty", url: "/lab/models/sign.glb", position: [0.95, 0.73, -1.02], rotation: [0, Math.PI - 0.35, 0], scale: 1.5 },
  { id: "graveyard", label: "Graveyard", url: "/lab/models/graveyard/gravestone-round.glb", position: [-1.72, 0.73, -0.72], rotation: [0, 0.9, 0], scale: 1 },
  { id: "rules", label: "Game Rules", url: "/lab/models/books.glb", position: [-1.68, 0.73, -0.12], rotation: [0, 1.15, 0.02], scale: 2.1 },
  { id: "kill", label: "Kill Report", url: "/lab/models/laptop.glb", position: [-1.58, 0.73, 0.28], rotation: [0, 1.25, 0], scale: 1.6 },
  { id: "population", label: "Population", url: "/lab/models/cardboardBoxOpen.glb", position: [1.72, 0.73, -0.72], rotation: [0, -0.9, 0], scale: 1.45 },
  { id: "quest", label: "Quest Report", url: "/lab/models/radio.glb", position: [1.68, 0.73, -0.08], rotation: [0, -1.15, 0], scale: 1.7 },
  { id: "zones", label: "Safe Zones", url: "/lab/models/computerKeyboard.glb", position: [0, 0.73, -0.28], rotation: [0, 0, 0], scale: 2.3 },
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
        position={[0, 1.55, 0.25]}
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
      <object3D ref={target} position={[0, 0.2, 0.25]} />
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
  texture.needsUpdate = true
  return texture
}

function WallPosters({ night }: { night: boolean }) {
  const maps = useMemo(
    () => [
      posterMap("STAY IN", night ? "#1a120c" : "#3c3228", night ? "#e7c56a" : "#f3e2b0"),
      posterMap("REPORT", night ? "#f4efe6" : "#3c3228", night ? "#c4493a" : "#f6d2c8"),
    ],
    [night],
  )
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps])
  return (
    <>
      {maps.map((map, index) => (
        <mesh key={index} position={[index === 0 ? -2.45 : 2.45, 1.05, -2.64]}>
          <planeGeometry args={[0.95, 1.15]} />
          <meshStandardMaterial map={map} roughness={0.9} />
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
    <group ref={fan} position={[1.62, 0.73, 0.28]} rotation={[0, -1.2, 0]}>
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

function DeskCup() {
  const cup = useRef<Group>(null)
  useEffect(() => {
    if (cup.current) markShadows(cup.current)
  }, [])
  return (
    <group ref={cup} position={[-1.52, 0.73, 0.62]}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.07, 0.055, 0.18, 12]} />
        <meshStandardMaterial color="#c4372f" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
        <meshStandardMaterial color="#f4f4f4" />
      </mesh>
    </group>
  )
}

function StripedCup() {
  const map = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 128
    const ctx = canvas.getContext("2d")
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    if (!ctx) return texture
    for (let band = 0; band < 8; band += 1) {
      ctx.fillStyle = band % 2 === 0 ? "#d32626" : "#f7f7f7"
      ctx.fillRect(0, band * 16, 64, 16)
    }
    texture.needsUpdate = true
    return texture
  }, [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh castShadow receiveShadow position={[1.55, 0.84, 0.62]}>
      <cylinderGeometry args={[0.045, 0.045, 0.22, 12]} />
      <meshStandardMaterial map={map} roughness={0.6} />
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
      <DeskCup />
      <StripedCup />
    </>
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
        ctx.fillStyle = night ? (light ? "#d9d3c8" : "#141414") : light ? "#efe8dc" : "#b7aea0"
        ctx.fillRect(x * tile, y * tile, tile, tile)
      }
    }
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
  return (
    <group>
      <mesh receiveShadow position={[0, floorY - thick / 2, (backZ + frontZ) / 2]}>
        <boxGeometry args={[roomX * 2 + thick * 2, thick, spanZ + thick]} />
        <meshStandardMaterial map={checker} roughness={0.92} />
      </mesh>
      <mesh receiveShadow position={[0, (floorY + ceilY) / 2, backZ - thick / 2]}>
        <boxGeometry args={[roomX * 2 + thick * 2, spanY + 0.02, thick]} />
        <meshStandardMaterial color={backWall} roughness={0.95} />
      </mesh>
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
          {ITEMS.find((item) => item.id === lit)?.label}
        </div>
      ) : null}
      {open ? <DeskPanel id={open} night={night} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}
