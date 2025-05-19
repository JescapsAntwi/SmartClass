"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ImageTransitionLoaderProps {
  progress: number
  onComplete?: () => void
}

export default function ImageTransitionLoader({ progress, onComplete }: ImageTransitionLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)
  const meshesRef = useRef<THREE.Mesh[]>([])
  const materialsRef = useRef<THREE.ShaderMaterial[]>([])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      10,
      10000,
    )
    camera.position.z = 60
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create transition effect
    const width = 100
    const height = 60
    const segmentsX = 20
    const segmentsY = 12

    // Create shader materials
    const createShaderMaterial = (phase: "in" | "out") => {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uDuration: { value: 2.0 },
          uPhase: { value: phase === "in" ? 1.0 : 0.0 },
          uMap: { value: null },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uDuration;
          uniform float uPhase;
          
          varying vec2 vUv;
          
          // Cubic easing function
          float easeInOutCubic(float t) {
            return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
          }
          
          void main() {
            vUv = uv;
            
            // Calculate progress (0 to 1)
            float progress = clamp(uTime / uDuration, 0.0, 1.0);
            progress = easeInOutCubic(progress);
            
            // Calculate offset based on position
            float delay = abs(position.x) * 0.01 + abs(position.y) * 0.005;
            float adjustedProgress = clamp(progress - delay, 0.0, 1.0);
            
            // Scale and position
            vec3 pos = position;
            
            // Different behavior for in vs out
            if (uPhase > 0.5) {
              // Phase in
              pos.z = (1.0 - adjustedProgress) * 50.0;
              pos.xy *= adjustedProgress;
            } else {
              // Phase out
              pos.z = adjustedProgress * -50.0;
              pos.xy *= (1.0 - adjustedProgress);
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          
          varying vec2 vUv;
          
          void main() {
            vec4 texColor = texture2D(uMap, vUv);
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
      })
    }

    // Create geometries and meshes
    const createTransitionMesh = (phase: "in" | "out", imageUrl: string) => {
      const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY)
      const material = createShaderMaterial(phase)

      // Load texture
      const textureLoader = new THREE.TextureLoader()
      textureLoader.crossOrigin = "Anonymous"
      textureLoader.load(
        imageUrl,
        (texture) => {
          material.uniforms.uMap.value = texture
        },
        undefined,
        (err) => {
          console.error("Error loading texture:", err)
          // Fallback to a color
          material.uniforms.uMap.value = new THREE.Texture()
        },
      )

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      return { mesh, material }
    }

    // Create two transition meshes
    const { mesh: mesh1, material: material1 } = createTransitionMesh("out", "/loadingimage.png")
    const { mesh: mesh2, material: material2 } = createTransitionMesh("in", "/loadingimage.png")

    meshesRef.current = [mesh1, mesh2]
    materialsRef.current = [material1, material2]

    // Animation loop
    const animate = (timestamp: number) => {
      timeRef.current += 0.01

      // Update shader uniforms
      materialsRef.current.forEach((material) => {
        material.uniforms.uTime.value = (Math.sin(timeRef.current * 0.5) + 1) * 0.5 * 2.0
      })

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate(0)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Update progress bar
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setShowButton(true)
        if (onComplete) onComplete()
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  const handleStart = () => {
    router.push("/grade-selection")
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">SmartClass</h1>
            <p className="text-xl text-blue-200 drop-shadow-md">Your Offline Learning Companion</p>
          </div>

          <div className="w-64 h-4 bg-gray-800 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-blue-100 mb-8 drop-shadow-md">
            {progress < 100 ? "Loading educational content..." : "Ready to start learning!"}
          </p>

          {showButton && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 shadow-lg"
              >
                Start Learning
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
