"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Country {
  id: string
  code: string
  name: string
  capital: string
  population: number
  area: number
  currency: string
  description: string
  facts: string[]
  position: { x: number; y: number }
}

interface SimpleMapComponentProps {
  countries: Country[]
  onCountryClick: (country: Country) => void
  zoom: number
  selectedCountry: Country | null
}

export default function SimpleMapComponent({
  countries,
  onCountryClick,
  zoom,
  selectedCountry,
}: SimpleMapComponentProps) {
  const [mapImage, setMapImage] = useState<string>("/placeholder.svg?height=800&width=1200")

  useEffect(() => {
    // In a real app, you would load an actual map image
    // For this demo, we'll use a placeholder
    setMapImage("/placeholder.svg?height=800&width=1200")
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          scale: zoom,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Map background */}
        <div className="relative w-full h-full">
          <img src={mapImage || "/placeholder.svg"} alt="Africa Map" className="w-full h-full object-contain" />

          {/* Country markers */}
          {countries.map((country) => (
            <button
              key={country.id}
              className={`absolute p-2 rounded-full transition-all duration-300 ${
                selectedCountry?.id === country.id
                  ? "bg-yellow-500 text-white scale-125 z-20"
                  : "bg-black text-white hover:bg-gray-800 z-10"
              }`}
              style={{
                left: `${country.position.x}%`,
                top: `${country.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onCountryClick(country)}
            >
              <span className="font-bold">{country.code}</span>
              {selectedCountry?.id === country.id && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded whitespace-nowrap shadow-md">
                  {country.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md z-30 border border-gray-200">
        <h4 className="font-bold text-sm mb-2">Map Legend</h4>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded-full bg-black"></div>
          <span>Country Marker</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Selected Country</span>
        </div>
        <p className="text-xs mt-2">Click on a marker to view country details</p>
      </div>

      {/* Region labels */}
      <div className="absolute top-10 left-10 text-lg font-bold bg-white/80 px-3 py-1 rounded shadow-sm">
        North Africa
      </div>
      <div className="absolute top-40 left-40 text-lg font-bold bg-white/80 px-3 py-1 rounded shadow-sm">
        West Africa
      </div>
      <div className="absolute bottom-40 right-40 text-lg font-bold bg-white/80 px-3 py-1 rounded shadow-sm">
        Southern Africa
      </div>
      <div className="absolute top-40 right-40 text-lg font-bold bg-white/80 px-3 py-1 rounded shadow-sm">
        East Africa
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold bg-white/80 px-3 py-1 rounded shadow-sm">
        Central Africa
      </div>
    </div>
  )
}
