import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, RotateCcw, SortAsc, SortDesc } from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'

export const FilterPanel: React.FC = () => {
  const {
    pokemon,
    filteredPokemon,
    searchTerm,
    selectedType,
    sortBy,
    sortOrder,
    darkMode,
    showAdvancedFilters,
    selectedTypes,
    statRanges,
    heightRange,
    weightRange,
    abilityFilter,
    typeFilterMode,
    
    setSearchTerm,
    setSelectedType,
    setSortBy,
    setSortOrder,
    setShowAdvancedFilters,
    toggleTypeFilter,
    setTypeFilterMode,
    setStatRanges,
    setHeightRange,
    setWeightRange,
    setAbilityFilter,
    clearAllFilters
  } = usePokedexStore()

  const allTypes = Array.from(new Set(pokemon.flatMap(p => p.types)))

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
      fighting: '👊', poison: '☠️', ground: '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '🧚'
    }
    return icons[type] || '❓'
  }

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

  const isAnyFilterActive = selectedTypes.length > 0 ||
    Object.values(statRanges).some(range => range.min !== 0 || range.max !== 255) ||
    heightRange.min !== 0 || heightRange.max !== 1000 ||
    weightRange.min !== 0 || weightRange.max !== 5000 ||
    abilityFilter

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        <Input
          type="text"
          placeholder="Search Pokémon by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : ''}`}
        />
      </div>

      {/* Results Counter */}
      <div className="text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredPokemon.length} of {pokemon.length} Pokémon
        </p>
      </div>

      {/* Type Tags Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Button
          variant={selectedType === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("")}
          className={darkMode ? 'border-gray-600' : ''}
        >
          All Types
        </Button>
        {allTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className={`capitalize ${darkMode ? 'border-gray-600' : ''}`}
          >
            <span className="mr-2">{getTypeIcon(type)}</span>
            {type}
          </Button>
        ))}
      </div>

      {/* Advanced Filters Toggler */}
      <div className="flex justify-center mb-4">
        <Button
          variant={showAdvancedFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
          {isAnyFilterActive && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Advanced Filters
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Multi-Type Filter */}
            <div>
              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Types ({selectedTypes.length}/2)
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={typeFilterMode === 'any' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilterMode('any')}
                    className="text-xs"
                  >
                    Any
                  </Button>
                  <Button
                    variant={typeFilterMode === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilterMode('all')}
                    className="text-xs"
                  >
                    All
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {allTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTypeFilter(type)}
                      className={`text-xs capitalize ${selectedTypes.includes(type) ? '' : darkMode ? 'border-gray-600' : ''}`}
                      disabled={selectedTypes.length >= 2 && !selectedTypes.includes(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stat Ranges */}
            <div>
              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Stat Ranges
              </h4>
              <div className="space-y-2">
                {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map((stat) => {
                  const range = statRanges[stat as keyof typeof statRanges]
                  return (
                    <div key={stat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.replace('special', 'Sp. ')}
                        </span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {range.min} - {range.max}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={range.min}
                          onChange={(e) => setStatRanges({
                            [stat]: { ...range, min: parseInt(e.target.value) || 0 }
                          })}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={range.max}
                          onChange={(e) => setStatRanges({
                            [stat]: { ...range, max: parseInt(e.target.value) || 255 }
                          })}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Physical Characteristics */}
            <div>
              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Physical Characteristics
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height (cm)</span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {heightRange.min} - {heightRange.max}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      value={heightRange.min}
                      onChange={(e) => setHeightRange({ ...heightRange, min: parseInt(e.target.value) || 0 })}
                      className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      value={heightRange.max}
                      onChange={(e) => setHeightRange({ ...heightRange, max: parseInt(e.target.value) || 1000 })}
                      className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight (kg)</span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {weightRange.min} - {weightRange.max}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="5000"
                      value={weightRange.min}
                      onChange={(e) => setWeightRange({ ...weightRange, min: parseInt(e.target.value) || 0 })}
                      className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="5000"
                      value={weightRange.max}
                      onChange={(e) => setWeightRange({ ...weightRange, max: parseInt(e.target.value) || 5000 })}
                      className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ability</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Filter by ability..."
                    value={abilityFilter}
                    onChange={(e) => setAbilityFilter(e.target.value)}
                    className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sorting Parameters */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-3 py-1 border rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
            <option value="hp">HP</option>
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="special-attack">Sp. Attack</option>
            <option value="special-defense">Sp. Defense</option>
            <option value="speed">Speed</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
        >
          {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
    </div>
  )
}
