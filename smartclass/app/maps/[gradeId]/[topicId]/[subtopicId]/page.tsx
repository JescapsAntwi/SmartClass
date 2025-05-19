"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { grades } from "@/data/grades"
import { topics } from "@/data/topics"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe, Info, ZoomIn, ZoomOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubjectIcon from "@/components/subject-icon"
import dynamic from "next/dynamic"

// Dynamically import the MapComponent with no SSR to avoid Leaflet issues
const DynamicMapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400">Loading map...</span>
    </div>
  ),
})

export default function MapsPage({
  params,
}: {
  params: { gradeId: string; topicId: string; subtopicId: string }
}) {
  const router = useRouter()
  const { gradeId, topicId, subtopicId } = params

  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("map")
  const [zoom, setZoom] = useState(3)
  const [isLoading, setIsLoading] = useState(true)

  const grade = grades.find((g) => g.id === gradeId)
  const topic = topics.find((t) => t.id === topicId)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleCountryClick = (country: any) => {
    setSelectedCountry(country)
    setActiveTab("info")
  }

  const handleBackToTopics = () => {
    router.push(`/topics/${gradeId}/maps`)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 8))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 2))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl dark:text-white">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={handleBackToTopics}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ChevronLeft size={20} className="mr-2" />
          <span>Back to Topics</span>
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <SubjectIcon subject="maps" />
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {topic?.title || "World Geography"}
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">Interactive Map</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Globe size={16} /> Map View
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info size={16} /> Country Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-0 overflow-hidden rounded-b-lg">
                <div className="relative bg-blue-50 dark:bg-blue-900/20 w-full h-[70vh] overflow-hidden">
                  <DynamicMapComponent onCountryClick={handleCountryClick} selectedCountry={selectedCountry} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={handleZoomOut}
                className="flex items-center gap-1 border-gray-300 dark:border-gray-700 dark:text-white"
              >
                <ZoomOut size={16} /> Zoom Out
              </Button>
              <Button
                variant="outline"
                onClick={handleZoomIn}
                className="flex items-center gap-1 border-gray-300 dark:border-gray-700 dark:text-white"
              >
                <ZoomIn size={16} /> Zoom In
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="info">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>{selectedCountry ? selectedCountry.name : "Select a Country"}</CardTitle>
                <CardDescription>
                  {selectedCountry
                    ? `Learn about ${selectedCountry.name}`
                    : "Click on a country on the map to view information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCountry ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Capital</h3>
                        <p className="dark:text-white">{selectedCountry.capital}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Population</h3>
                        <p className="dark:text-white">{selectedCountry.population.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Area</h3>
                        <p className="dark:text-white">{selectedCountry.area.toLocaleString()} km²</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Currency</h3>
                        <p className="dark:text-white">{selectedCountry.currency}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">About</h3>
                      <p className="text-gray-600 dark:text-gray-300">{selectedCountry.description}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Key Facts</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedCountry.facts.map((fact: string, index: number) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300">
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a country on the map to view detailed information
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
