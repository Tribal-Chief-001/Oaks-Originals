'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/input' // wait, shadcn Switch is imported from "@/components/ui/switch"
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search, Loader2, Github, Twitter, Sun, Moon, Heart, Star, X, Plus,
  BarChart3, BookOpen, Zap, Users, MapPin, SlidersHorizontal, ChevronDown,
  LogIn, LogOut, User as UserIcon
} from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'
import { PokedexGrid } from '@/components/pokedex/PokedexGrid'
import { FilterPanel } from '@/components/pokedex/FilterPanel'
import { DetailModal } from '@/components/pokedex/DetailModal'
import { TeamBuilder } from '@/components/tools/TeamBuilder'
import { DamageCalculator } from '@/components/tools/DamageCalculator'
import { IvCalculator } from '@/components/tools/IvCalculator'
import { TypeChart } from '@/components/tools/TypeChart'
import { TrackerDashboard } from '@/components/tools/TrackerDashboard'
import { AudioToggle } from '@/components/pokedex/AudioToggle'
import { ItemsDirectory } from '@/components/tools/ItemsDirectory'
import { supabase } from '@/lib/supabaseClient'
import { AuthModal } from '@/components/auth/AuthModal'
import { toast } from '@/hooks/use-toast'
import { OnboardingTour } from '@/components/ui/OnboardingTour'

export default function Home() {
  const {
    pokemon,
    filteredPokemon,
    favorites,
    compareMode,
    setCompareMode,
    compareList,
    removeFromCompare,
    showShiny,
    setShowShiny,
    darkMode,
    setDarkMode,
    activeTab,
    setActiveTab,
    
    // Tool Toggles
    showTeamBuilder,
    setShowTeamBuilder,
    showMoveDatabase,
    setShowMoveDatabase,
    showDamageCalculator,
    setShowDamageCalculator,
    showBreedingTools,
    setShowBreedingTools,
    showPokedexTracker,
    setShowPokedexTracker,
    showTypeChart,
    setShowTypeChart,
    teamBuilderMode,
    setTeamBuilderMode,
    currentTeam,
    
    // DB Sync Actions
    fetchInitialData,
    loading,

    // Auth
    user,
    setSession
  } = usePokedexStore()

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Listen to Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Manage Dark Mode Class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      grass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      poison: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      fire: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      flying: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      bug: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
      normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      electric: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ground: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      fairy: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      fighting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      psychic: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      rock: "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
      ghost: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      ice: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
      dragon: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
      dark: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
      steel: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }

  const formatHeight = (height: number) => {
    const meters = height / 10
    return `${meters}m`
  }

  const formatWeight = (weight: number) => {
    const kg = weight / 10
    return `${kg}kg`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-start mb-4">
          
          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/Tribal-Chief-001/Oaks-Originals"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50 group ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`}
              title="View on GitHub"
            >
              <Github className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`} />
            </a>
            <a
              href="https://x.com/Nighlok__King"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 group ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`}
              title="Follow on X (Twitter)"
            >
              <Twitter className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-500'}`} />
            </a>
          </div>

          {/* Quick Actions & Toggles */}
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Dark Mode Switch */}
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <ShadcnSwitch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>

            {/* Shiny Switch */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Normal</span>
              <ShadcnSwitch
                checked={showShiny}
                onCheckedChange={setShowShiny}
                className="data-[state=checked]:bg-yellow-500"
              />
              <span className="text-sm font-medium text-yellow-600">✨ Shiny</span>
            </div>

            {/* Audio Toggle */}
            <AudioToggle />

            {/* Favorites Filter */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const favs = pokemon.filter(p => favorites.includes(p.id))
                usePokedexStore.setState({ filteredPokemon: favs })
              }}
              className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="hidden sm:inline">Favorites</span>
              <span>({favorites.length})</span>
            </Button>

            {/* Comparison Mode Toggler */}
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              <span>({compareList.length}/2)</span>
            </Button>

            {/* Tools Menu Trigger */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Tools</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTeamBuilderMode(true)
                      setShowTeamBuilder(true)
                    }}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Team Builder
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDamageCalculator(true)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Damage Calculator
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTypeChart(true)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Type Chart
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowItemsDirectory(true)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Items Directory
                  </Button>
                </div>
              </div>
            </div>

            {/* Breeding & Tracker Toggles */}
            <div className="flex items-center gap-2">
              <Button
                variant={showBreedingTools ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBreedingTools(!showBreedingTools)}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Breeding</span>
              </Button>

              <Button
                variant={showPokedexTracker ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPokedexTracker(!showPokedexTracker)}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Tracker</span>
              </Button>
            </div>

            {/* Auth Button */}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut()
                  toast({
                    title: "Logged out",
                    description: "Goodbye, trainer!",
                  })
                }}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="hidden md:inline text-xs max-w-[120px] truncate">{user.email}</span>
                <span className="md:hidden">Out</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            )}

          </div>
        </div>

        {/* Dashboard Title */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Oak's Originals
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-650'}`}>
            Professor Oak's personal collection of the original 151 Pokémon
          </p>
        </div>

        {/* Search, Filter, Sort Panels */}
        <FilterPanel />

        {/* Pokemon Main Grid */}
        <PokedexGrid />

        {/* Sub-tool Modal Overlays */}
        <DetailModal />
        <TeamBuilder />
        <DamageCalculator />
        <IvCalculator />
        <TypeChart />
        <TrackerDashboard />
        <ItemsDirectory />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        <OnboardingTour />

        {/* Dual Pokemon Comparison Overlay */}
        {compareMode && compareList.length === 2 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Pokemon Comparison</CardTitle>
                    <CardDescription>Comparing {compareList[0].name} and {compareList[1].name}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompareMode(false)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {compareList.map((p) => (
                    <div key={p.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <div className="text-center">
                        <img src={showShiny ? p.shinyImage : p.image} alt={p.name} className="w-28 h-28 object-contain mx-auto mb-2" />
                        <h3 className="font-bold text-lg capitalize">{p.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">#{p.id.toString().padStart(3, '0')}</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-400">Height:</span>
                          <span className="font-semibold">{formatHeight(p.height)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-400">Weight:</span>
                          <span className="font-semibold">{formatWeight(p.weight)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-400">Types:</span>
                          <div className="flex gap-1">
                            {p.types.map(t => (
                              <Badge key={t} variant="secondary" className={`text-xxs ${getTypeColor(t)}`}>{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 text-center">
          <div className={`rounded-xl p-6 max-w-md mx-auto shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Made with ❤️ by Xandred</h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase
            </p>
            <div className={`flex justify-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <a
                href="https://github.com/Tribal-Chief-001/Oaks-Originals"
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

      </div>
    </div>
  )
}