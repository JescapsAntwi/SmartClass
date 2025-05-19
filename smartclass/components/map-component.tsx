"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { africaCountries } from "@/data/map-data"

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface MapComponentProps {
  onCountryClick: (country: any) => void
  selectedCountry?: any
}

// Component to handle map center and zoom changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

export default function MapComponent({ onCountryClick, selectedCountry }: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  // Center on Africa
  const defaultCenter: [number, number] = [5, 20]
  const defaultZoom = 3

  // Fix Leaflet icon issue on component mount
  useEffect(() => {
    fixLeafletIcon()
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return (
      <div className="w-full h-[70vh] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading map...</span>
      </div>
    )
  }

  // Create custom icon for markers
  const createIcon = (country: any, isSelected: boolean) => {
    return L.divIcon({
      className: "country-marker",
      html: `<div class="w-8 h-8 ${
        isSelected ? "bg-yellow-500" : "bg-black"
      } text-white rounded-full flex items-center justify-center font-bold shadow-md">${country.code}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "70vh", width: "100%" }}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {africaCountries.map((country) => {
        // Convert the percentage-based positions to approximate lat/lng
        // This is a simplified conversion - in a real app, you'd use actual coordinates
        const lat = 40 - (country.position.y / 100) * 80 // Convert y% to latitude (roughly)
        const lng = -20 + (country.position.x / 100) * 80 // Convert x% to longitude (roughly)

        const isSelected = selectedCountry?.id === country.id

        return (
          <Marker
            key={country.id}
            position={[lat, lng]}
            icon={createIcon(country, isSelected)}
            eventHandlers={{
              click: () => onCountryClick(country),
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{country.name}</h3>
                <p>{country.capital}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Region labels */}
      <div className="leaflet-top leaflet-left mt-10 ml-10">
        <div className="leaflet-control bg-white/80 px-3 py-1 rounded shadow-sm">North Africa</div>
      </div>

      <div className="leaflet-top leaflet-right mt-10 mr-10">
        <div className="leaflet-control bg-white/80 px-3 py-1 rounded shadow-sm">East Africa</div>
      </div>

      <div className="leaflet-bottom leaflet-left mb-10 ml-10">
        <div className="leaflet-control bg-white/80 px-3 py-1 rounded shadow-sm">West Africa</div>
      </div>

      <div className="leaflet-bottom leaflet-right mb-10 mr-10">
        <div className="leaflet-control bg-white/80 px-3 py-1 rounded shadow-sm">Southern Africa</div>
      </div>

      {/* Map controller for programmatic control */}
      <MapController center={defaultCenter} zoom={defaultZoom} />

      {/* Zoom controls */}
      <div className="leaflet-bottom leaflet-right mb-4 mr-4">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">
            +
          </a>
          <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">
            −
          </a>
        </div>
      </div>

      {/* Map legend */}
      <div className="leaflet-bottom leaflet-left mb-4 ml-4">
        <div className="leaflet-control bg-white p-3 rounded-md shadow-md border border-gray-200">
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
      </div>
    </MapContainer>
  )
}
