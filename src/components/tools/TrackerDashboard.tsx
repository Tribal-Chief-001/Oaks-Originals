import React from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'

export const TrackerDashboard: React.FC = () => {
  const {
    showPokedexTracker,
    setShowPokedexTracker,
    pokedexData,
    toggleTrackerStatus,
    pokemon,
    darkMode
  } = usePokedexStore()

  if (!showPokedexTracker) return null

  const caughtCount = Object.values(pokedexData).filter(x => x.caught).length
  const seenCount = Object.values(pokedexData).filter(x => x.seen).length
  const shinyCount = Object.values(pokedexData).filter(x => x.shiny).length

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-purple-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-50 to-pink-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Pokedex Completion Tracker</CardTitle>
              <CardDescription>Monitor your trainer progress catching all 151 Kanto Pokemon</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPokedexTracker(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Tracker Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-3xl font-bold text-green-500">{caughtCount}/151</p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Caught</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-3xl font-bold text-blue-500">{seenCount}/151</p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Seen</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-3xl font-bold text-yellow-500">{shinyCount}/151</p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Shiny Found</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Checklist Directory</h3>
            <p className="text-xxs text-gray-400 mb-4">Click on any Pokemon entry to cycle its status: Not Seen ➔ Seen ➔ Caught ➔ Caught + Shiny ➔ Reset</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
              {pokemon.map((p) => {
                const status = pokedexData[p.id] || { caught: false, seen: false, shiny: false }
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleTrackerStatus(p.id)}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-all hover:scale-105 select-none ${
                      status.caught
                        ? 'border-green-500 bg-green-500/10'
                        : status.seen
                        ? 'border-blue-500 bg-blue-500/10'
                        : darkMode
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Image src={p.image} alt={p.name} width={40} height={40} className="mx-auto object-contain mb-1" />
                    <p className="font-bold text-xxs truncate capitalize leading-none">{p.name}</p>
                    <p className="text-xxs text-gray-400 mt-0.5 font-semibold">#{p.id.toString().padStart(3, '0')}</p>
                    
                    <div className="flex justify-center gap-1 mt-1">
                      {status.seen && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="Seen"></span>}
                      {status.caught && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Caught"></span>}
                      {status.shiny && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" title="Shiny"></span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
