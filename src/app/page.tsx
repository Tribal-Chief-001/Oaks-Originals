"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Loader2, SortAsc, SortDesc, Github, Twitter } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  height: number
  weight: number
  abilities: string[]
  hiddenAbilities: string[]
  image: string
  stats?: Array<{
    name: string
    value: number
  }>
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [sortBy, setSortBy] = useState<"id" | "name" | "height" | "weight">("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(true)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Mock data for demonstration - in real app this would come from API
  const mockPokemon: Pokemon[] = [
    {
      id: 1,
      name: "Bulbasaur",
      types: ["grass", "poison"],
      height: 7,
      weight: 69,
      abilities: ["overgrow"],
      hiddenAbilities: ["chlorophyll"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    },
    {
      id: 2,
      name: "Ivysaur",
      types: ["grass", "poison"],
      height: 10,
      weight: 130,
      abilities: ["overgrow"],
      hiddenAbilities: ["chlorophyll"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png"
    },
    {
      id: 3,
      name: "Venusaur",
      types: ["grass", "poison"],
      height: 20,
      weight: 1000,
      abilities: ["overgrow"],
      hiddenAbilities: ["chlorophyll"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
    },
    {
      id: 4,
      name: "Charmander",
      types: ["fire"],
      height: 6,
      weight: 85,
      abilities: ["blaze"],
      hiddenAbilities: ["solar-power"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
    },
    {
      id: 5,
      name: "Charmeleon",
      types: ["fire"],
      height: 11,
      weight: 190,
      abilities: ["blaze"],
      hiddenAbilities: ["solar-power"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png"
    },
    {
      id: 6,
      name: "Charizard",
      types: ["fire", "flying"],
      height: 17,
      weight: 905,
      abilities: ["blaze"],
      hiddenAbilities: ["solar-power"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
    },
    {
      id: 7,
      name: "Squirtle",
      types: ["water"],
      height: 5,
      weight: 90,
      abilities: ["torrent"],
      hiddenAbilities: ["rain-dish"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
    },
    {
      id: 8,
      name: "Wartortle",
      types: ["water"],
      height: 10,
      weight: 225,
      abilities: ["torrent"],
      hiddenAbilities: ["rain-dish"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png"
    },
    {
      id: 9,
      name: "Blastoise",
      types: ["water"],
      height: 16,
      weight: 855,
      abilities: ["torrent"],
      hiddenAbilities: ["rain-dish"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
    }
  ]

  const handlePokemonClick = async (pokemon: Pokemon) => {
    setLoadingDetails(true)
    try {
      const response = await fetch(`/api/pokemon/${pokemon.id}`)
      if (response.ok) {
        const detailedPokemon = await response.json()
        setSelectedPokemon(detailedPokemon)
      } else {
        // Fallback to basic pokemon data if API fails
        setSelectedPokemon(pokemon)
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
      setSelectedPokemon(pokemon)
    } finally {
      setLoadingDetails(false)
    }
  }

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('/api/pokemon?limit=151')
        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon')
        }
        const data = await response.json()
        setPokemon(data.pokemon)
        setFilteredPokemon(data.pokemon)
      } catch (error) {
        console.error('Error fetching Pokemon:', error)
        // Fallback to mock data if API fails
        setPokemon(mockPokemon)
        setFilteredPokemon(mockPokemon)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  useEffect(() => {
    let filtered = pokemon

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
      )
    }

    if (selectedType) {
      filtered = filtered.filter(p => p.types.includes(selectedType))
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "id":
          comparison = a.id - b.id
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "height":
          comparison = a.height - b.height
          break
        case "weight":
          comparison = a.weight - b.weight
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredPokemon(filtered)
  }, [searchTerm, selectedType, sortBy, sortOrder, pokemon])

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      grass: "bg-green-100 text-green-800",
      poison: "bg-purple-100 text-purple-800",
      fire: "bg-red-100 text-red-800",
      flying: "bg-blue-100 text-blue-800",
      water: "bg-cyan-100 text-cyan-800",
      bug: "bg-lime-100 text-lime-800",
      normal: "bg-gray-100 text-gray-800",
      electric: "bg-yellow-100 text-yellow-800",
      ground: "bg-amber-100 text-amber-800",
      fairy: "bg-pink-100 text-pink-800",
      fighting: "bg-orange-100 text-orange-800",
      psychic: "bg-rose-100 text-rose-800",
      rock: "bg-stone-100 text-stone-800",
      ghost: "bg-indigo-100 text-indigo-800",
      ice: "bg-sky-100 text-sky-800",
      dragon: "bg-violet-100 text-violet-800",
      dark: "bg-zinc-100 text-zinc-800",
      steel: "bg-slate-100 text-slate-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const allTypes = Array.from(new Set(pokemon.flatMap(p => p.types)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Right Social Links */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-3">
            <a
              href="https://github.com/Tribal-Chief-001/Oaks-Originals"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50 group"
              title="View on GitHub"
            >
              <Github className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
            </a>
            <a
              href="https://x.com/Nighlok__King" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 group"
              title="Follow on X (Twitter)"
            >
              <Twitter className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-colors" />
            </a>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
            Oak's Originals
          </h1>
          <p className="text-lg text-gray-600">
            Professor Oak's personal collection of the original 151 Pokémon
          </p>
        </div>

          {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search Pokémon by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Counter */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredPokemon.length} of {pokemon.length} Pokémon
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant={selectedType === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("")}
            >
              All Types
            </Button>
            {allTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm bg-white"
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="height">Height</option>
                <option value="weight">Weight</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>

            {/* Pokemon Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((pokemon) => (
              <Card
                key={pokemon.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-200"
                onClick={() => handlePokemonClick(pokemon)}
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg" />
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="relative w-full h-48 object-contain bg-transparent rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold shadow-md">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 capitalize text-center">
                    {pokemon.name}
                  </CardTitle>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className={`capitalize ${getTypeColor(type)} text-xs font-medium`}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                  
                  <CardDescription className="text-sm text-center">
                    <span className="inline-block mx-1">📏 {pokemon.height / 10}m</span>
                    <span className="inline-block mx-1">⚖️ {pokemon.weight / 10}kg</span>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPokemon.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No Pokémon found matching your search.
            </p>
          </div>
        )}

        {/* Pokemon Detail Modal */}
        {selectedPokemon && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl capitalize text-gray-800">
                      {selectedPokemon.name}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      #{selectedPokemon.id.toString().padStart(3, '0')}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPokemon(null)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingDetails ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-4">
                        <img
                          src={selectedPokemon.image}
                          alt={selectedPokemon.name}
                          className="w-full h-64 object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">Types</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPokemon.types.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className={`capitalize ${getTypeColor(type)} text-sm py-1 px-3`}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">Physical Characteristics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Height</p>
                            <p className="font-semibold">{selectedPokemon.height / 10}m</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="font-semibold">{selectedPokemon.weight / 10}kg</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">Abilities</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {selectedPokemon.abilities.map((ability) => (
                                <Badge key={ability} variant="outline" className="capitalize">
                                  {ability.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {selectedPokemon.hiddenAbilities && selectedPokemon.hiddenAbilities.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Hidden Abilities:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedPokemon.hiddenAbilities.map((ability) => (
                                  <Badge key={ability} variant="secondary" className="capitalize text-xs">
                                    {ability.replace('-', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedPokemon.stats && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-gray-800">Base Stats</h3>
                          <div className="space-y-3">
                            {selectedPokemon.stats.map((stat) => (
                              <div key={stat.name} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="capitalize text-sm font-medium text-gray-700">
                                    {stat.name.replace('-', ' ')}
                                  </span>
                                  <span className="text-sm font-bold text-gray-800">
                                    {stat.value}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
      {/* Credits Section */}
      <div className="mt-16 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">Made with ❤️ by Xandred</h3>
          <p className="text-sm text-gray-600 mb-4">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <a
              href="https://github.com/Tribal-Chief-001/Oak-s-Originals"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              View Source
            </a>
            <span>•</span>
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Data by PokéAPI
            </a>
          </div>
        </div>
      </div>
  )
}
