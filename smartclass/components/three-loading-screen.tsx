"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ThreeLoadingScreenProps {
  progress: number
  onComplete?: () => void
}

export default function ThreeLoadingScreen({ progress, onComplete }: ThreeLoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const frameIdRef = useRef<number | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Load starfield texture
    const textureLoader = new THREE.TextureLoader()
    const starfieldTexture = textureLoader.load("/loadingimage.png")

    // Create stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 1500
    const positions = new Float32Array(starsCount * 3)
    const sizes = new Float32Array(starsCount)

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      sizes[i] = Math.random() * 2
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      map: starfieldTexture,
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Add point light
    const pointLight = new THREE.PointLight(0x4287f5, 2, 10)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    // Animation loop
    const animate = () => {
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0005
        starsRef.current.rotation.x += 0.0002
      }

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

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
