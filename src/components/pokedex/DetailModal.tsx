import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Heart, Plus, X, Info, Users, Zap, BarChart3, BookOpen, MapPin, ChevronDown, Loader2, Sparkles, Scale, Ruler, Star, ShieldAlert, Volume2
} from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'
import { HolographicFoil } from './HolographicFoil'

const kantoMapLocations: Record<string, { x: number; y: number; label: string }> = {
  "Pallet Town": { x: 2, y: 7, label: "Pallet Town" },
  "Viridian City": { x: 2, y: 5, label: "Viridian City" },
  "Pewter City": { x: 2, y: 2, label: "Pewter City" },
  "Cerulean City": { x: 5, y: 2, label: "Cerulean City" },
  "Vermilion City": { x: 6, y: 6, label: "Vermilion City" },
  "Lavender Town": { x: 8, y: 4, label: "Lavender Town" },
  "Celadon City": { x: 4, y: 4, label: "Celadon City" },
  "Fuchsia City": { x: 5, y: 8, label: "Fuchsia City" },
  "Saffron City": { x: 6, y: 4, label: "Saffron City" },
  "Cinnabar Island": { x: 2, y: 9, label: "Cinnabar Island" },
  "Indigo Plateau": { x: 1, y: 1, label: "Indigo Plateau" },
  "Viridian Forest": { x: 2, y: 3, label: "Viridian Forest" },
  "Mt Moon": { x: 3.5, y: 2, label: "Mt Moon" },
  "Rock Tunnel": { x: 8, y: 2.5, label: "Rock Tunnel" },
  "Seafoam Islands": { x: 3.5, y: 9, label: "Seafoam Islands" },
  "Power Plant": { x: 9, y: 3, label: "Power Plant" },
  "Safari Zone": { x: 5, y: 7.2, label: "Safari Zone" },
  "Victory Road": { x: 1, y: 2, label: "Victory Road" },
  "Cerulean Cave": { x: 5, y: 1.2, label: "Cerulean Cave" },
  "Route 1": { x: 2, y: 6, label: "Route 1" },
  "Route 2": { x: 2, y: 4, label: "Route 2" },
  "Route 3": { x: 3, y: 2, label: "Route 3" },
  "Route 4": { x: 4.2, y: 2, label: "Route 4" },
  "Route 5": { x: 6, y: 3, label: "Route 5" },
  "Route 6": { x: 6, y: 5, label: "Route 6" },
  "Route 7": { x: 5, y: 4, label: "Route 7" },
  "Route 8": { x: 7, y: 4, label: "Route 8" },
  "Route 9": { x: 6.5, y: 2, label: "Route 9" },
  "Route 10": { x: 8, y: 3.2, label: "Route 10" },
  "Route 11": { x: 7, y: 6, label: "Route 11" },
  "Route 12": { x: 8, y: 5, label: "Route 12" },
  "Route 13": { x: 8, y: 6.2, label: "Route 13" },
  "Route 14": { x: 7, y: 7.2, label: "Route 14" },
  "Route 15": { x: 6, y: 8, label: "Route 15" },
  "Route 16": { x: 3, y: 4, label: "Route 16" },
  "Route 17": { x: 3, y: 6, label: "Route 17" },
  "Route 18": { x: 4, y: 8, label: "Route 18" },
  "Route 19": { x: 5, y: 9, label: "Route 19" },
  "Route 20": { x: 4.2, y: 9, label: "Route 20" },
  "Route 21": { x: 2, y: 8, label: "Route 21" },
  "Route 22": { x: 1.2, y: 5, label: "Route 22" },
  "Route 23": { x: 1, y: 3, label: "Route 23" },
  "Route 24": { x: 5, y: 1.5, label: "Route 24" },
  "Route 25": { x: 5.5, y: 1.5, label: "Route 25" }
}

export const DetailModal: React.FC = () => {
  const {
    selectedPokemon,
    setSelectedPokemon,
    favorites,
    toggleFavorite,
    compareMode,
    compareList,
    addToCompare,
    darkMode,
    activeTab,
    setActiveTab,
    showShiny,
    setShowShiny,
    setCalculatorAttackerId,
    setCalculatorMoveName,
    setShowDamageCalculator,
    playClickSound,
    playSuccessSound,
    playCry
  } = usePokedexStore()

  const [selectedMoveName, setSelectedMoveName] = useState<string | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isArtworkHovered, setIsArtworkHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = (e.clientX - box.left - box.width / 2) / (box.width / 2)
    const y = (e.clientY - box.top - box.height / 2) / (box.height / 2)
    setTilt({ x: x * 8, y: y * -8 })
  }

  const handleMouseLeave = () => {
    setIsArtworkHovered(false)
    setTilt({ x: 0, y: 0 })
  }
  const [moveDetails, setMoveDetails] = useState<any | null>(null)
  const [loadingMove, setLoadingMove] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset'
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedMoveName) {
      setMoveDetails(null)
      return
    }
    const fetchMove = async () => {
      setLoadingMove(true)
      try {
        const res = await fetch(`/api/moves?name=${encodeURIComponent(selectedMoveName)}`)
        if (res.ok) {
          const data = await res.json()
          setMoveDetails(data)
        }
      } catch (err) {
        console.error('Failed to fetch move:', err)
      } finally {
        setLoadingMove(false)
      }
    }
    fetchMove()
  }, [selectedMoveName])

  if (!selectedPokemon) return null

  const isFav = favorites.includes(selectedPokemon.id)

  const formatHeight = (height: number) => {
    const meters = height / 10
    const feet = Math.floor(meters * 3.28084)
    const inches = Math.round((meters * 3.28084 - feet) * 12)
    return `${meters}m (${feet}'${inches}")`
  }

  const formatWeight = (weight: number) => {
    const kg = weight / 10
    const lbs = Math.round(kg * 2.20462)
    return `${kg}kg (${lbs}lbs)`
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      grass: "bg-green-500/10 text-green-500 border-green-500/30",
      poison: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      fire: "bg-red-500/10 text-red-500 border-red-500/30",
      flying: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      water: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
      bug: "bg-lime-500/10 text-lime-500 border-lime-500/30",
      normal: "bg-gray-500/10 text-gray-500 border-gray-500/30",
      electric: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
      ground: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      fairy: "bg-pink-500/10 text-pink-500 border-pink-500/30",
      fighting: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      psychic: "bg-rose-500/10 text-rose-500 border-rose-500/30",
      rock: "bg-stone-500/10 text-stone-500 border-stone-500/30",
      ghost: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
      ice: "bg-sky-500/10 text-sky-500 border-sky-500/30",
      dragon: "bg-violet-500/10 text-violet-500 border-violet-500/30",
      dark: "bg-zinc-500/10 text-zinc-500 border-zinc-500/30",
      steel: "bg-slate-500/10 text-slate-500 border-slate-500/30"
    }
    return colors[type] || "bg-gray-500/10 text-gray-500 border-gray-500/30"
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
      fighting: '👊', poison: '☠️', ground: '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '🧚'
    }
    return icons[type] || '❓'
  }

  const getStatRating = (value: number) => {
    if (value >= 150) return "Exceptional"
    if (value >= 120) return "High"
    if (value >= 90) return "Above Average"
    if (value >= 70) return "Average"
    if (value >= 50) return "Below Average"
    return "Low"
  }

  const getTypeAccentColor = (type: string) => {
    const colors: Record<string, string> = {
      grass: "rgba(34,197,94,0.12)",
      poison: "rgba(168,85,247,0.12)",
      fire: "rgba(239,68,68,0.12)",
      flying: "rgba(59,130,246,0.12)",
      water: "rgba(6,182,212,0.12)",
      bug: "rgba(132,204,22,0.12)",
      normal: "rgba(156,163,175,0.12)",
      electric: "rgba(234,179,8,0.12)",
      ground: "rgba(245,158,11,0.12)",
      fairy: "rgba(244,114,182,0.12)",
      fighting: "rgba(249,115,22,0.12)",
      psychic: "rgba(244,63,94,0.12)",
      rock: "rgba(120,113,108,0.12)",
      ghost: "rgba(99,102,241,0.12)",
      ice: "rgba(14,165,233,0.12)",
      dragon: "rgba(139,92,246,0.12)",
      dark: "rgba(63,63,70,0.12)",
      steel: "rgba(100,116,139,0.12)"
    };
    return colors[type] || "rgba(59,130,246,0.12)";
  }

  const getTypeEffectiveness = (attackingType: string, defendingTypes: string[]) => {
    const effectiveness: Record<string, Record<string, number>> = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 2 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 2, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
      poison: { grass: 2, poison: 0.5, ground: 2, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
      rock: { fire: 2, ice: 2, fighting: 2, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
      ghost: { psychic: 2, ghost: 2, dark: 0.5, fighting: 1 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0, ice: 2 },
      dark: { fighting: 2, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
      fairy: { fire: 0.5, poison: 2, fighting: 2, dragon: 2, dark: 2, steel: 0.5 }
    }

    let total = 1
    defendingTypes.forEach(defType => {
      const row = effectiveness[attackingType]
      if (row && row[defType] !== undefined) {
        total *= row[defType]
      }
    })
    return total
  }

  const getComprehensiveTypeEffectiveness = (defendingTypes: string[]) => {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    const results = allTypes.map(type => ({
      type,
      multiplier: getTypeEffectiveness(type, defendingTypes),
      icon: getTypeIcon(type)
    }))

    return {
      weaknesses: results.filter(r => r.multiplier > 1),
      resistances: results.filter(r => r.multiplier < 1 && r.multiplier > 0),
      immunities: results.filter(r => r.multiplier === 0)
    }
  }

  const getEffectivenessColor = (m: number) => {
    if (m === 0) return 'text-gray-500 bg-gray-150/40 dark:bg-gray-800/40'
    if (m === 0.25) return 'text-green-700 bg-green-100/40 dark:bg-green-950/40 dark:text-green-300'
    if (m === 0.5) return 'text-green-600 bg-green-50/40 dark:bg-green-900/20 dark:text-green-400'
    if (m === 2) return 'text-red-600 bg-red-50/40 dark:bg-red-900/20 dark:text-red-400'
    if (m === 4) return 'text-red-700 bg-red-100/40 dark:bg-red-950/40 dark:text-red-300'
    return 'text-gray-500 bg-gray-50/40 dark:bg-gray-850/40'
  }

  const totalBaseStats = selectedPokemon.stats?.reduce((sum, stat) => sum + stat.value, 0) || 0
  const primaryType = selectedPokemon.types[0] || 'normal'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      
      {/* Johnny Ive Split Card Container */}
      <Card className={`max-w-6xl w-full h-[92vh] lg:h-[86vh] flex flex-col overflow-hidden border border-zinc-200/20 dark:border-zinc-800/80 shadow-2xl rounded-2xl ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-800'
      }`}>
        
        {/* TOP-LEVEL HEADER AREA (Full-Width) */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/80 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold capitalize tracking-tight">{selectedPokemon.name}</h2>
                <button
                  onClick={() => playCry(selectedPokemon.id)}
                  title="Play Cry"
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-semibold text-zinc-450 dark:text-zinc-400 mt-1">
                #{selectedPokemon.id.toString().padStart(3, '0')} • {selectedPokemon.category || 'Pokémon'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { playSuccessSound(); toggleFavorite(selectedPokemon.id); }}
                className={`h-9 w-9 p-0 rounded-full ${isFav ? 'text-red-500' : 'text-zinc-500'}`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </Button>
              {compareMode && compareList.length < 2 && !compareList.find(p => p.id === selectedPokemon.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { playSuccessSound(); addToCompare(selectedPokemon); }}
                  className="h-9 w-9 p-0 rounded-full text-zinc-500"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { playClickSound(); setSelectedPokemon(null); }}
                className="h-9 w-9 p-0 rounded-full hover:bg-red-500/10 text-zinc-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Sleek Horizontal Tab Bar Carousel */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none mt-4 -mx-2 px-2 pb-1 shrink-0">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'biology', label: 'Biology', icon: Users },
              { id: 'abilities', label: 'Abilities', icon: Zap },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              { id: 'evolution', label: 'Evolution', icon: ChevronDown },
              { id: 'moves', label: 'Moves', icon: Zap },
              { id: 'competitive', label: 'Competitive', icon: BarChart3 },
              { id: 'flavor', label: 'Flavor Text', icon: BookOpen },
              { id: 'encounters', label: 'Encounters', icon: MapPin },
              { id: 'trivia', label: 'Trivia', icon: Info },
              { id: 'mechanics', label: 'Mechanics', icon: Zap }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { playClickSound(); setActiveTab(id); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border shrink-0 ${
                  activeTab === id
                    ? 'bg-indigo-650 text-white dark:bg-indigo-650 dark:text-white border-transparent shadow-sm'
                    : 'text-zinc-500 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM CONTENT AREA (Split Layout) */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* LEFT PORTRAIT SIDEBAR (1/3 Width) */}
          <div className="w-full lg:w-1/3 p-6 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800/80 relative overflow-y-auto overflow-x-hidden scrollbar-none shrink-0 bg-gradient-to-b from-transparent to-zinc-100/10 dark:to-zinc-900/5">
            
            {/* Accent Glow Backdrops */}
            <div 
              className="absolute inset-0 pointer-events-none blur-3xl opacity-30 rounded-full scale-125" 
              style={{ backgroundColor: getTypeAccentColor(primaryType) }}
            />

            {/* Left Column Content */}
            <div className="relative z-10 flex flex-col space-y-5">
              
              {/* Premium Floating Holographic Artwork Frame */}
              <div 
                className="relative w-full aspect-square max-w-[260px] mx-auto rounded-2xl border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/10 dark:bg-zinc-950/20 backdrop-blur-md shadow-inner flex items-center justify-center group overflow-hidden cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsArtworkHovered(true)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Shiny Sparkle ambient backdrops */}
                {showShiny && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.1)_0%,_transparent_70%)] animate-pulse" />
                )}
                
                {/* Holographic foil Reacting to cursor tilt */}
                <HolographicFoil isHovered={isArtworkHovered} mousePos={{ x: tilt.x / 8, y: tilt.y / 8 }} />

                <img
                  src={showShiny ? selectedPokemon.shinyImage : selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="w-[82%] h-[82%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300 relative z-20"
                />
              </div>

              {/* Segmented control for Normal vs Shiny */}
              <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/80 p-0.5 rounded-full mt-2 mx-auto max-w-[180px] w-full text-xxs">
                <button
                  onClick={() => { playClickSound(); setShowShiny(false); }}
                  className={`flex-1 py-1 px-3 rounded-full font-bold transition-all duration-200 ${
                    !showShiny 
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => { playClickSound(); setShowShiny(true); }}
                  className={`flex-1 py-1 px-3 rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-1 ${
                    showShiny 
                      ? 'bg-yellow-500 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-yellow-500'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Shiny
                </button>
              </div>

              {/* Types Indicators */}
              <div className="pt-2">
                <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-505 mb-2.5 uppercase tracking-widest">Types</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPokemon.types.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className={`capitalize text-xs font-semibold py-1.5 px-3.5 rounded-full border ${getTypeColor(type)}`}
                    >
                      <span className="mr-1.5">{getTypeIcon(type)}</span>
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Physical Characteristics Cards */}
              <div className="pt-2">
                <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 mb-2.5 uppercase tracking-widest">Physical Characteristics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3.5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20 flex flex-col justify-between min-h-[68px]">
                    <span className="text-xxs font-bold text-zinc-550 flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      HEIGHT
                    </span>
                    <span className="text-xs font-extrabold mt-1.5">{formatHeight(selectedPokemon.height)}</span>
                  </div>
                  <div className="rounded-xl p-3.5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20 flex flex-col justify-between min-h-[68px]">
                    <span className="text-xxs font-bold text-zinc-555 flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      WEIGHT
                    </span>
                    <span className="text-xs font-extrabold mt-1.5">{formatWeight(selectedPokemon.weight)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT DETAILS TAB INTERFACE (2/3 Width) */}
          <div className="w-full lg:w-2/3 flex flex-col h-full overflow-hidden bg-zinc-50/20 dark:bg-zinc-950/5">
            
            {/* Tab Content Body (Scroll Isolated) */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-6"
              >
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Row 1: Core ID & Stats rating side-by-side */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className={`rounded-xl p-5 border ${
                        darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Core Identification</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center border-b border-zinc-200/10 dark:border-zinc-800/50 pb-2">
                            <span className="text-zinc-500 font-medium">National Dex</span>
                            <span className="font-extrabold font-mono">#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-zinc-200/10 dark:border-zinc-800/50 pb-2">
                            <span className="text-zinc-500 font-medium">Kanto Dex</span>
                            <span className="font-extrabold font-mono">#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                          </div>
                          {selectedPokemon.category && (
                            <div className="flex justify-between items-center border-b border-zinc-200/10 dark:border-zinc-800/50 pb-2">
                              <span className="text-zinc-505 font-medium">Category</span>
                              <span className="font-extrabold capitalize">{selectedPokemon.category}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-550 font-medium">Egg Groups</span>
                            <span className="font-extrabold capitalize">{selectedPokemon.eggGroups?.join(" / ") || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-xl p-5 border flex flex-col justify-between ${
                        darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Base Stats Total</h4>
                          <div className="text-center py-2">
                            <span className="text-5xl font-black tracking-tight">{totalBaseStats}</span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-zinc-455 dark:text-zinc-400 border-t border-zinc-200/10 dark:border-zinc-800/50 pt-3 flex justify-between items-center">
                          <span>Classification:</span>
                          <span className="text-red-505 font-extrabold">{getStatRating(totalBaseStats / 6)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Abilities Summary */}
                    <div className={`rounded-xl p-5 border ${
                      darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Abilities</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xxs font-bold text-zinc-550 block mb-2 uppercase tracking-wide">Standard Combat Abilities</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedPokemon.abilities.map((ability) => (
                              <Badge
                                key={ability}
                                variant="outline"
                                className={`capitalize text-xs font-semibold py-1.5 px-3 rounded-xl border ${
                                  darkMode ? 'border-zinc-800 text-zinc-200 bg-zinc-950/40' : 'border-zinc-200 text-zinc-800 bg-white'
                                }`}
                              >
                                {ability.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedPokemon.hiddenAbilities && selectedPokemon.hiddenAbilities.length > 0 && (
                          <div>
                            <span className="text-xxs font-bold text-zinc-550 block mb-2 uppercase tracking-wide">Hidden Ability</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedPokemon.hiddenAbilities.map((ability) => (
                                <Badge
                                  key={ability}
                                  className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-600/30 capitalize text-xs font-semibold py-1.5 px-3 rounded-xl"
                                >
                                  {ability.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* 2. BIOLOGY TAB */}
              {activeTab === 'biology' && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Biological Profile
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-zinc-200/10 pb-2">
                        <span className="text-zinc-455">Gender Distribution:</span>
                        <span className="font-bold">{selectedPokemon.genderRatio || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200/10 pb-2">
                        <span className="text-zinc-455">Base Friendship Stat:</span>
                        <span className="font-bold">{selectedPokemon.baseFriendship ?? 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200/10 pb-2">
                        <span className="text-zinc-455">Wild Catch Rate:</span>
                        <span className="font-bold">{selectedPokemon.catchRate ? `${selectedPokemon.catchRate}%` : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-zinc-200/10 pb-2">
                        <span className="text-zinc-455">Egg Cycles (Incubation):</span>
                        <span className="font-bold">{selectedPokemon.eggCycles ? `${selectedPokemon.eggCycles} (${selectedPokemon.eggCycles * 255} steps)` : 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-455 block mb-1.5">Natural Habitats:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedPokemon.naturalHabitat?.map(h => (
                            <Badge key={h} variant="secondary" className="capitalize text-xxs px-2 py-0.5">{h}</Badge>
                          )) || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ABILITIES TAB */}
              {activeTab === 'abilities' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-md flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Abilities & Combat Traits
                  </h3>
                  <div className="space-y-3">
                    {selectedPokemon.abilities.map((ability, index) => (
                      <div key={ability} className="p-4 rounded-xl border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold capitalize text-xs">{ability.replace('-', ' ')}</h4>
                          <Badge variant="outline" className="text-xxs uppercase">{index === 0 ? 'Primary' : 'Secondary'}</Badge>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                          {selectedPokemon.abilityDescriptions?.primary || 'Standard combat ability providing various battle effects.'}
                        </p>
                      </div>
                    ))}
                    {selectedPokemon.hiddenAbilities.map(ability => (
                      <div key={ability} className="p-4 rounded-xl border-2 border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/5">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold capitalize text-xs text-purple-600 dark:text-purple-400">{ability.replace('-', ' ')}</h4>
                          <Badge className="bg-purple-500 text-xxs uppercase">Hidden</Badge>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                          {selectedPokemon.abilityDescriptions?.hidden || 'Rare ability obtained through specific breeding or transfer events.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. STATS TAB */}
              {activeTab === 'stats' && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    Base Statistics
                  </h3>
                  <div className="space-y-4.5">
                    {selectedPokemon.stats?.map(stat => {
                      const maxValue = 255
                      const percentage = (stat.value / maxValue) * 100
                      return (
                        <div key={stat.name} className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="capitalize font-bold text-zinc-400">{stat.name.replace('-', ' ')}</span>
                            <span className="font-mono font-extrabold">{stat.value}</span>
                          </div>
                          <div className="w-full rounded-full h-2 bg-zinc-200 dark:bg-zinc-800">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-red-600 to-red-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    <div className="pt-3 border-t border-zinc-200/10 flex justify-between font-extrabold text-xs">
                      <span>Stat Total:</span>
                      <span className="text-red-500">{totalBaseStats} ({getStatRating(totalBaseStats / 6)})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. EVOLUTION TAB */}
              {activeTab === 'evolution' && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20 text-center">
                  <h3 className="font-bold text-md mb-6 text-left flex items-center gap-2">
                    <ChevronDown className="w-5 h-5 text-green-500 rotate-270" />
                    Evolution Chain Timeline
                  </h3>
                  {selectedPokemon.evolutionChain && selectedPokemon.evolutionChain.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-5 py-4">
                      {selectedPokemon.evolutionChain.map((evo, idx) => (
                        <React.Fragment key={evo.id}>
                          <div className="rounded-xl p-4 text-center min-w-[120px] border border-zinc-200/20 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-sm flex flex-col items-center">
                            <img src={evo.image} alt={evo.name} className="w-16 h-16 object-contain mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]" />
                            <p className="font-bold text-xs capitalize">{evo.name}</p>
                            <p className="text-xxs text-zinc-500 font-mono mt-0.5">#{evo.id.toString().padStart(3, '0')}</p>
                          </div>
                          {idx < (selectedPokemon.evolutionChain?.length || 0) - 1 && (
                            <div className="text-center flex flex-col items-center justify-center">
                              <span className="text-lg text-zinc-400 font-extrabold leading-none animate-pulse">➔</span>
                              <Badge className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 text-xxs scale-90 mt-1 whitespace-nowrap font-bold border border-zinc-200/20">
                                {selectedPokemon.evolutionChain?.[idx + 1]?.method || 'Level Up'}
                              </Badge>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 py-6">This Pokémon has no known evolution stages.</p>
                  )}
                </div>
              )}

              {/* 6. MOVES TAB */}
              {activeTab === 'moves' && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-500" />
                    Moves Learndirectory
                  </h3>
                  <p className="text-xxs text-zinc-400 mb-4">Click any move to view parameters, power, accuracy, and load it into the Damage Calculator.</p>
                  <div className="space-y-5">
                    {selectedPokemon.learnset?.levelUp && selectedPokemon.learnset.levelUp.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-zinc-500 uppercase mb-2">Level Up Learnset</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {selectedPokemon.learnset.levelUp.map((m, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedMoveName(m.name)}
                              className="p-2.5 rounded-lg border border-zinc-200/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs capitalize flex justify-between items-center cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-150"
                            >
                              <span className="font-bold">{m.name}</span>
                              <Badge variant="outline" className="text-xxs tracking-wider border-zinc-200/20 font-bold">Lv.{m.level}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedPokemon.learnset?.tmMoves && selectedPokemon.learnset.tmMoves.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-zinc-500 uppercase mb-2">TM/HM Learnset</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedPokemon.learnset.tmMoves.map((m, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              onClick={() => setSelectedMoveName(m)}
                              className="capitalize text-xxs cursor-pointer hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              {m}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. COMPETITIVE TAB */}
              {activeTab === 'competitive' && selectedPokemon.competitive && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-500" />
                    Competitive Analysis (Gen I OU Meta)
                  </h3>
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-6 text-xs">
                      
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 border-b border-zinc-200/10 pb-3">
                          <div>
                            <span className="text-zinc-500 block mb-1">Smogon Tier</span>
                            <Badge className="font-extrabold uppercase tracking-wide">{selectedPokemon.competitive.smogonTier}</Badge>
                          </div>
                          {selectedPokemon.competitive.usageRank && (
                            <div>
                              <span className="text-zinc-500 block mb-1">Live Usage Stats</span>
                              <Badge variant="secondary" className="font-extrabold bg-green-500/10 text-green-500 border border-green-500/30">
                                Rank #{selectedPokemon.competitive.usageRank} ({selectedPokemon.competitive.usagePercentage}%)
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-zinc-550 block mb-1 font-bold">Standard Meta Roles:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedPokemon.competitive.commonRoles.map((r, i) => (
                              <Badge key={i} variant="outline" className="border-zinc-200/20">{r}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-550 block mb-1 font-bold">Optimal Attack Moves:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedPokemon.competitive.optimalMovesets.map((m, i) => (
                              <Badge key={i} variant="secondary" className="capitalize text-xxs">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-zinc-200/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl">
                        <span className="font-bold block mb-2 text-zinc-400">Defense Effectiveness:</span>
                        {(() => {
                          const matrix = getComprehensiveTypeEffectiveness(selectedPokemon.types)
                          return (
                            <div className="space-y-3 text-xxs">
                              {matrix.weaknesses.length > 0 && (
                                <div>
                                  <p className="text-red-500 font-bold mb-1.5">Weaknesses (Takes 2x/4x):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {matrix.weaknesses.map(w => (
                                      <span key={w.type} className={`px-2 py-0.5 rounded capitalize font-bold ${getEffectivenessColor(w.multiplier)}`}>
                                        {w.icon} {w.type} {w.multiplier}x
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {matrix.resistances.length > 0 && (
                                <div>
                                  <p className="text-green-500 font-bold mb-1.5">Resistances (Takes 0.5x/0.25x):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {matrix.resistances.map(r => (
                                      <span key={r.type} className={`px-2 py-0.5 rounded capitalize font-bold ${getEffectivenessColor(r.multiplier)}`}>
                                        {r.icon} {r.type} {r.multiplier}x
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {matrix.immunities.length > 0 && (
                                <div>
                                  <p className="text-zinc-500 font-bold mb-1.5">Immunities (Takes 0x):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {matrix.immunities.map(i => (
                                      <span key={i.type} className={`px-2 py-0.5 rounded capitalize font-bold ${getEffectivenessColor(i.multiplier)}`}>
                                        {i.icon} {i.type} 0x
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t border-zinc-200/10 pt-4 text-xs">
                      <div>
                        <h4 className="font-bold text-zinc-500 mb-1">Rival Counters</h4>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                          {selectedPokemon.competitive.counters.map((c, i) => (
                            <li key={i} className="capitalize">{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-500 mb-1">Team Synergies</h4>
                        <p className="text-zinc-400 leading-relaxed">{selectedPokemon.competitive.teamSynergy}</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 8. FLAVOR TEXT TAB */}
              {activeTab === 'flavor' && selectedPokemon.flavorText && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    Pokedex Logs (Original Gen I Journals)
                  </h3>
                  <div className="space-y-4 text-xs italic leading-relaxed">
                    {selectedPokemon.flavorText.red && (
                      <div className="p-3.5 border-l-4 border-red-500 bg-red-500/5 rounded-r">
                        <p className="font-bold text-red-550 not-italic mb-1 font-mono text-xxs uppercase">Red / Blue Entry</p>
                        "{selectedPokemon.flavorText.red}"
                      </div>
                    )}
                    {selectedPokemon.flavorText.yellow && (
                      <div className="p-3.5 border-l-4 border-yellow-500 bg-yellow-500/5 rounded-r">
                        <p className="font-bold text-yellow-550 not-italic mb-1 font-mono text-xxs uppercase">Yellow Entry</p>
                        "{selectedPokemon.flavorText.yellow}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 9. ENCOUNTERS TAB */}
              {activeTab === 'encounters' && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    Kanto Spawn Locations & Routes Map
                  </h3>
                  
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column: Interactive SVG Map */}
                    <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-950 rounded-xl p-4 shadow-inner relative overflow-hidden border border-gray-800 min-h-[280px]">
                      <div className="absolute top-2 left-2 text-xxs font-semibold text-gray-500 bg-gray-900/80 px-2 py-0.5 rounded">
                        Interactive Kanto Map Visualizer
                      </div>
                      
                      <svg viewBox="0 0 520 420" className="w-full max-w-[480px] h-auto bg-transparent">
                        {/* Connection Paths (Roads / Water routes) */}
                        {[
                          { from: "Pallet Town", to: "Route 1" },
                          { from: "Route 1", to: "Viridian City" },
                          { from: "Viridian City", to: "Route 2" },
                          { from: "Route 2", to: "Viridian Forest" },
                          { from: "Viridian Forest", to: "Pewter City" },
                          { from: "Pewter City", to: "Route 3" },
                          { from: "Route 3", to: "Mt Moon" },
                          { from: "Mt Moon", to: "Route 4" },
                          { from: "Route 4", to: "Cerulean City" },
                          { from: "Cerulean City", to: "Route 24" },
                          { from: "Route 24", to: "Route 25" },
                          { from: "Cerulean City", to: "Route 5" },
                          { from: "Route 5", to: "Saffron City" },
                          { from: "Saffron City", to: "Route 6" },
                          { from: "Route 6", to: "Vermilion City" },
                          { from: "Celadon City", to: "Route 7" },
                          { from: "Route 7", to: "Saffron City" },
                          { from: "Saffron City", to: "Route 8" },
                          { from: "Route 8", to: "Lavender Town" },
                          { from: "Cerulean City", to: "Route 9" },
                          { from: "Route 9", to: "Rock Tunnel" },
                          { from: "Rock Tunnel", to: "Route 10" },
                          { from: "Route 10", to: "Lavender Town" },
                          { from: "Vermilion City", to: "Route 11" },
                          { from: "Route 11", to: "Route 12" },
                          { from: "Lavender Town", to: "Route 12" },
                          { from: "Route 12", to: "Route 13" },
                          { from: "Route 13", to: "Route 14" },
                          { from: "Route 14", to: "Route 15" },
                          { from: "Route 15", to: "Fuchsia City" },
                          { from: "Celadon City", to: "Route 16" },
                          { from: "Route 16", to: "Route 17" },
                          { from: "Route 17", to: "Route 18" },
                          { from: "Route 18", to: "Fuchsia City" },
                          { from: "Fuchsia City", to: "Route 19" },
                          { from: "Route 19", to: "Seafoam Islands" },
                          { from: "Seafoam Islands", to: "Route 20" },
                          { from: "Route 20", to: "Cinnabar Island" },
                          { from: "Cinnabar Island", to: "Route 21" },
                          { from: "Route 21", to: "Pallet Town" },
                          { from: "Viridian City", to: "Route 22" },
                          { from: "Route 22", to: "Route 23" },
                          { from: "Route 23", to: "Victory Road" },
                          { from: "Victory Road", to: "Indigo Plateau" },
                        ].map((path, idx) => {
                          const start = kantoMapLocations[path.from]
                          const end = kantoMapLocations[path.to]
                          if (!start || !end) return null
                          
                          const encountersList = (selectedPokemon.encounters as any[]) || []
                          const isActive = encountersList.some(e => e.locationName === path.from) || encountersList.some(e => e.locationName === path.to)
                          
                          return (
                            <line
                              key={idx}
                              x1={start.x * 50}
                              y1={start.y * 40}
                              x2={end.x * 50}
                              y2={end.y * 40}
                              stroke={isActive ? "#10B981" : "#374151"}
                              strokeWidth={isActive ? 3 : 2}
                              className="transition-all duration-300"
                            />
                          )
                        })}

                        {/* Map Nodes */}
                        {Object.entries(kantoMapLocations).map(([locName, coord]) => {
                          const encountersList = (selectedPokemon.encounters as any[]) || []
                          const encounter = encountersList.find(e => e.locationName.toLowerCase().trim() === locName.toLowerCase().trim())
                          const isActive = !!encounter
                          const isCity = !locName.includes("Route") && !locName.includes("Forest") && !locName.includes("Tunnel") && !locName.includes("Islands") && !locName.includes("Cave") && !locName.includes("Road")
                          
                          return (
                            <g key={locName}>
                              <circle
                                cx={coord.x * 50}
                                cy={coord.y * 40}
                                r={isCity ? 8 : 5}
                                fill={isActive ? "#10B981" : isCity ? "#3B82F6" : "#4B5563"}
                                className="transition-all duration-300 hover:scale-150 hover:stroke-white hover:stroke-2 cursor-pointer"
                              />
                              <title>{locName}{isActive ? " (Active spawn location)" : ""}</title>
                            </g>
                          )
                        })}

                        {/* Map Labels */}
                        {Object.entries(kantoMapLocations).map(([locName, coord]) => {
                          const isCity = !locName.includes("Route") && !locName.includes("Forest") && !locName.includes("Tunnel") && !locName.includes("Islands") && !locName.includes("Cave") && !locName.includes("Road")
                          if (!isCity) return null
                          
                          return (
                            <text
                              key={locName}
                              x={coord.x * 50}
                              y={coord.y * 40 - 12}
                              textAnchor="middle"
                              fill="#9CA3AF"
                              fontSize="8"
                              fontWeight="bold"
                              className="pointer-events-none select-none"
                            >
                              {coord.label}
                            </text>
                          )
                        })}
                      </svg>
                    </div>
                    
                    {/* Right Column: Detailed spawn statistics */}
                    <div className="lg:col-span-5 space-y-3.5 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase">Wild Spawn Details</h4>
                      
                      {(!selectedPokemon.encounters || (selectedPokemon.encounters as any[]).length === 0) ? (
                        <div className="p-4 rounded-xl text-center text-xs border border-zinc-200/20 bg-white dark:bg-zinc-900 text-zinc-450">
                          {selectedPokemon.id === 150 ? 'Cerulean Cave (Post-Game, Direct interaction)' :
                           selectedPokemon.id === 151 ? 'Special Event Distribution Only' :
                           selectedPokemon.id <= 9 ? 'Starter choices from Professor Oak' :
                           'No standard wild encounters available.'}
                        </div>
                      ) : (
                        ((selectedPokemon.encounters as any[])).map((enc: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-zinc-250/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xxs">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-extrabold capitalize text-xs">
                                📍 {enc.locationName}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {enc.versions.map((v: any, vIdx: number) => (
                                <div key={vIdx} className="border-t border-zinc-200/10 pt-2 first:border-0 first:pt-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge className={
                                      v.version === 'Red' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/30' :
                                      v.version === 'Blue' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/30' :
                                      'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/30'
                                    } variant="outline">
                                      {v.version} version
                                    </Badge>
                                    <span className="text-zinc-500 font-bold">Max Chance: {v.maxChance}%</span>
                                  </div>
                                  
                                  <div className="pl-2 space-y-1 text-zinc-400">
                                    {v.methods.map((m: any, mIdx: number) => (
                                      <div key={mIdx} className="flex justify-between">
                                        <span className="capitalize">• {m.method} (Lv. {m.minLevel === m.maxLevel ? m.minLevel : `${m.minLevel}-${m.maxLevel}`})</span>
                                        <span>Chance: {m.chance}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 10. TRIVIA TAB */}
              {activeTab === 'trivia' && selectedPokemon.trivia && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20 text-xs space-y-4">
                  <h3 className="font-bold text-md flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Trivia & Species Origins
                  </h3>
                  <div>
                    <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Design Origin</h4>
                    <p className="leading-relaxed text-zinc-400">{selectedPokemon.trivia.designOrigin}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Name Etymology</h4>
                    <p className="capitalize leading-relaxed text-zinc-400">{selectedPokemon.trivia.nameEtymology}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Developer Trivia Logs</h4>
                    <p className="leading-relaxed text-zinc-400">{selectedPokemon.trivia.developerTrivia}</p>
                  </div>
                </div>
              )}

              {/* 11. MECHANICS TAB */}
              {activeTab === 'mechanics' && selectedPokemon.advancedMechanics && (
                <div className="rounded-xl p-5 border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-100/5 dark:bg-zinc-950/20 text-xs">
                  <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-500" />
                    Advanced Combat Mechanics
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 leading-relaxed">
                    <div>
                      <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Hidden Power Calculations</h4>
                      <p className="text-zinc-400">{selectedPokemon.advancedMechanics.hiddenPowerRange}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Breeding Quirks</h4>
                      <p className="text-zinc-400">{selectedPokemon.advancedMechanics.breedingQuirks}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Form Triggers</h4>
                      <p className="text-zinc-400">{selectedPokemon.advancedMechanics.formChangeTriggers}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-500 uppercase text-xxs mb-1">Generation Stat Shifts</h4>
                      <p className="text-zinc-400">{selectedPokemon.advancedMechanics.statChanges}</p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>

    </Card>

      {/* Move Details Drawer */}
      {selectedMoveName && (
        <div className={`fixed inset-y-0 right-0 w-80 border-l shadow-2xl p-6 z-50 flex flex-col transition-all duration-300 ${
          darkMode ? 'bg-zinc-950 border-zinc-850 text-white animate-in slide-in-from-right' : 'bg-white border-zinc-200 text-zinc-800 animate-in slide-in-from-right'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-md capitalize">
              {selectedMoveName}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMoveName(null)}
              className="w-8 h-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {loadingMove ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
          ) : moveDetails ? (
            <div className="flex-1 space-y-5 text-xs overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200/50'}`}>
                  <span className="text-zinc-500 block text-xxs font-bold uppercase mb-1">Type</span>
                  <Badge className="capitalize text-xxs">{moveDetails.type}</Badge>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200/50'}`}>
                  <span className="text-zinc-500 block text-xxs font-bold uppercase mb-1">Class</span>
                  <span className="font-extrabold capitalize block mt-1">
                    {moveDetails.damageClass}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200/50'}`}>
                  <span className="text-zinc-500 block text-xxs font-bold uppercase mb-1">Power</span>
                  <span className="font-extrabold block mt-1">
                    {moveDetails.power !== null ? moveDetails.power : '—'}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200/50'}`}>
                  <span className="text-zinc-500 block text-xxs font-bold uppercase mb-1">Accuracy</span>
                  <span className="font-extrabold block mt-1">
                    {moveDetails.accuracy !== null ? `${moveDetails.accuracy}%` : '—'}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 animate-in' : 'bg-zinc-50 border-zinc-200/50'} col-span-2`}>
                  <span className="text-zinc-500 block text-xxs font-bold uppercase mb-1">PP</span>
                  <span className="font-extrabold block mt-1">
                    {moveDetails.pp}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block text-xxs font-bold uppercase mb-2">Battle Description</span>
                <p className={`p-3.5 rounded-xl border leading-relaxed ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200/50 text-zinc-700'}`}>
                  {moveDetails.description}
                </p>
              </div>

              {moveDetails.power && (
                <Button
                  onClick={() => {
                    setCalculatorAttackerId(selectedPokemon.id)
                    setCalculatorMoveName(moveDetails.name)
                    setShowDamageCalculator(true)
                    setSelectedMoveName(null)
                  }}
                  className="w-full bg-red-650 hover:bg-red-600 text-white flex items-center justify-center gap-1.5 mt-2 font-bold py-5 rounded-xl shadow-lg shadow-red-500/10"
                >
                  <Zap className="w-4 h-4 animate-bounce" />
                  Load into Calculator
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              Move data not available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
