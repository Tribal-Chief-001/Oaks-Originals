import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Copy formula functions from page.tsx to compute fields during seed

const getStatRating = (value: number) => {
  if (value >= 150) return 'Exceptional'
  if (value >= 120) return 'High'
  if (value >= 90) return 'Above Average'
  if (value >= 70) return 'Average'
  if (value >= 50) return 'Below Average'
  return 'Low'
}

const getStrengths = (types: string[], stats: any[]) => {
  const strengths: string[] = []
  const totalStats = stats.reduce((sum: number, stat: any) => sum + stat.value, 0)
  
  if (totalStats > 500) strengths.push('High base stat total')
  if (types.includes('dragon')) strengths.push('Dragon type advantage')
  if (types.includes('steel')) strengths.push('Steel type defensive utility')
  if ((stats.find((s: any) => s.name === 'speed')?.value || 0) > 100) strengths.push('High Speed')
  if ((stats.find((s: any) => s.name === 'hp')?.value || 0) > 100) strengths.push('High HP')
  
  return strengths.length > 0 ? strengths : ['Balanced stat distribution']
}

const getWeaknesses = (types: string[]) => {
  const typeWeaknesses: Record<string, string[]> = {
    normal: ['fighting'],
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    electric: ['ground'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    fairy: ['poison', 'steel']
  }
  
  const weaknesses = new Set<string>()
  types.forEach(type => {
    if (typeWeaknesses[type]) {
      typeWeaknesses[type].forEach(weakness => weaknesses.add(weakness))
    }
  })
  
  return Array.from(weaknesses)
}

const getSmogonTier = (id: number, totalStats: number) => {
  if (id === 144 || id === 145 || id === 150) return 'Uber'
  if (id === 143 || id === 146) return 'OU'
  if (totalStats > 600) return 'OU'
  if (totalStats > 500) return 'UU'
  if (totalStats > 400) return 'RU'
  return 'NU'
}

const getCommonRoles = (types: string[], stats: any[]) => {
  const roles: string[] = []
  const attack = stats.find((s: any) => s.name === 'attack')?.value || 0
  const spAtk = stats.find((s: any) => s.name === 'special-attack')?.value || 0
  const speed = stats.find((s: any) => s.name === 'speed')?.value || 0
  const defense = stats.find((s: any) => s.name === 'defense')?.value || 0
  const spDef = stats.find((s: any) => s.name === 'special-defense')?.value || 0
  
  if (speed > 100 && (attack > 100 || spAtk > 100)) roles.push('Sweeper')
  if (defense > 100 && spDef > 100) roles.push('Wall')
  if (types.includes('psychic') && spAtk > 90) roles.push('Special Attacker')
  if (types.includes('fighting') && attack > 90) roles.push('Physical Attacker')
  if (types.includes('steel') || types.includes('rock')) roles.push('Tank')
  
  return roles.length > 0 ? roles : ['Support']
}

const getOptimalMovesets = (name: string, types: string[]) => {
  const movesets: Record<string, string[]> = {
    'Charizard': ['Flamethrower', 'Fire Blast', 'Earthquake', 'Slash'],
    'Blastoise': ['Surf', 'Ice Beam', 'Body Slam', 'Rest'],
    'Venusaur': ['Razor Leaf', 'Sleep Powder', 'Body Slam', 'Hyper Beam'],
    'Pikachu': ['Thunderbolt', 'Thunder', 'Quick Attack', 'Double Team'],
    'Alakazam': ['Psychic', 'Recover', 'Seismic Toss', 'Reflect'],
    'Machamp': ['Submission', 'Body Slam', 'Hyper Beam', 'Submission'],
    'Golem': ['Earthquake', 'Rock Slide', 'Body Slam', 'Explosion'],
    'Gengar': ['Psychic', 'Thunderbolt', 'Mega Drain', 'Hypnosis'],
    'Dragonite': ['Thunderbolt', 'Ice Beam', 'Body Slam', 'Hyper Beam']
  }
  
  return movesets[name] || ['STAB move', 'Coverage move', 'Status move', 'Recovery move']
}

const getCounters = (types: string[], stats: any[]) => {
  const counters: string[] = []
  const weaknesses = getWeaknesses(types)
  
  weaknesses.forEach(weakness => {
    switch(weakness) {
      case 'ice':
        counters.push('Ice-type moves (Articuno, Lapras)')
        break
      case 'ground':
        counters.push('Ground-type moves (Golem, Rhydon)')
        break
      case 'psychic':
        counters.push('Psychic-type moves (Alakazam, Mewtwo)')
        break
      case 'fire':
        counters.push('Fire-type moves (Charizard, Arcanine)')
        break
      default:
        counters.push(`${weakness}-type moves`)
    }
  })
  
  return counters.length > 0 ? counters : ['No specific counters']
}

const getTeamSynergy = (types: string[]) => {
  const synergies: Record<string, string> = {
    'water': 'Works well with Grass and Electric types',
    'fire': 'Works well with Water and Rock types',
    'grass': 'Works well with Fire and Water types',
    'electric': 'Works well with Water and Ground types',
    'psychic': 'Works well with Fighting and Dark types',
    'fighting': 'Works well with Flying and Psychic types',
    'poison': 'Works well with Ground and Psychic types',
    'ground': 'Works well with Water and Grass types',
    'flying': 'Works well with Electric and Rock types',
    'bug': 'Works well with Fire and Flying types',
    'rock': 'Works well with Water and Grass types',
    'ghost': 'Works well with Dark and Psychic types',
    'dragon': 'Works well with Ice and Fairy types',
    'dark': 'Works well with Fighting and Bug types',
    'steel': 'Works well with Fire and Fighting types',
    'fairy': 'Works well with Poison and Steel types'
  }
  
  return types.map(type => synergies[type] || 'Standard team synergy').join('; ')
}

const getDesignOrigin = (id: number, name: string) => {
  const origins: Record<string, string> = {
    'Bulbasaur': 'Based on a frog or dinosaur with a plant bulb',
    'Charmander': 'Based on a salamander with fire characteristics',
    'Squirtle': 'Based on a turtle with water squirting ability',
    'Pikachu': 'Based on a mouse or pika with electrical abilities',
    'Jigglypuff': 'Based on a balloon with singing abilities',
    'Meowth': 'Based on a cat with coin fascination',
    'Psyduck': 'Based on a duck with psychic headaches',
    'Machamp': 'Based on a four-armed wrestler',
    'Golem': 'Based on a golem or rock monster',
    'Dragonite': 'Based on European dragons with friendly demeanor'
  }
  
  return origins[name] || 'Design based on real-world animals and mythological creatures'
}

const getNameEtymology = (name: string) => {
  const etymologies: Record<string, string> = {
    'Bulbasaur': 'Bulb (plant) + Dinosaur',
    'Charmander': 'Char (burn) + Salamander',
    'Squirtle': 'Squirt (water) + Turtle',
    'Pikachu': 'Pika (mouse sound) + Chu (kiss sound)',
    'Jigglypuff': 'Jiggly (soft) + Puff (inflate)',
    'Meowth': 'Meow (cat sound) + Mouth',
    'Psyduck': 'Psychic + Duck',
    'Machamp': 'Machine + Champion',
    'Golem': 'Hebrew mythological creature',
    'Dragonite': 'Dragon + Knight (suffix)'
  }
  
  return etymologies[name] || 'Name derived from characteristics or abilities'
}

const getNotableAppearances = (id: number) => {
  const appearances: Record<number, string[]> = {
    1: ['Original 151 starter', 'Main character in Pokémon anime', 'Numerous game appearances'],
    4: ['Original 151 starter', 'Ash\'s main Pokémon in anime', 'Mascot for franchise'],
    7: ['Original 151 starter', 'Popular in competitive play', 'Featured in movies'],
    25: ['Series mascot', 'Most recognizable Pokémon', 'Featured in Super Smash Bros'],
    39: ['Popular singing Pokémon', 'Anime regular', 'Super Smash Bros fighter'],
    52: ['Team Rocket\'s Pokémon', 'Anime antagonist', 'Can speak human language'],
    54: ['Comic relief Pokémon', 'Anime regular', 'Known for headaches'],
    68: ['Four-armed fighter', 'Popular in competitive', 'Evolution of Machop'],
    76: ['Rock-type powerhouse', 'Popular in competitive', 'Evolution of Geodude'],
    149: ['Pseudo-legendary', 'Powerful dragon type', 'Fan favorite']
  }
  
  return appearances[id] || ['Appears in main series games', 'Part of original 151', 'Popular among fans']
}

const getHistoricalContext = (id: number) => {
  if (id <= 151) {
    return 'Part of the original Generation I Pokémon, designed by Ken Sugimori and the Game Freak team. These Pokémon established the foundation for the entire franchise.'
  }
  return 'Part of the expanded Pokémon universe, building upon the original concepts.'
}

const getDeveloperTrivia = (id: number) => {
  const trivia: Record<number, string> = {
    1: 'Originally designed to be the mascot before Pikachu was chosen',
    4: 'Designed to appeal to Western audiences with dragon-like appearance',
    7: 'Design influenced by Japanese turtle monsters',
    25: 'Created to be cute and marketable internationally',
    39: 'Designed to be simple and easy to animate',
    52: 'One of the few Pokémon that can speak human language',
    54: 'Designed to express constant confusion',
    68: 'Four arms added to emphasize fighting prowess',
    76: 'Designed to look like a boulder come to life',
    149: 'Originally much larger in concept art'
  }
  
  return trivia[id] || 'Designed as part of the original 151 Pokémon roster'
}

const getHiddenPowerRange = (stats: any[]) => {
  const hp = stats.find((s: any) => s.name === 'hp')?.value || 0
  const attack = stats.find((s: any) => s.name === 'attack')?.value || 0
  const defense = stats.find((s: any) => s.name === 'defense')?.value || 0
  const speed = stats.find((s: any) => s.name === 'speed')?.value || 0
  const spAtk = stats.find((s: any) => s.name === 'special-attack')?.value || 0
  const spDef = stats.find((s: any) => s.name === 'special-defense')?.value || 0
  
  const types = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark']
  const typeIndex = ((hp % 2) + (attack % 2) * 2 + (defense % 2) * 4 + (speed % 2) * 8 + (spAtk % 2) * 16 + (spDef % 2) * 32) % 16
  
  return `${types[typeIndex]} type, Power 30-70`
}

const getBreedingQuirks = (speciesData: any) => {
  const quirks: string[] = []
  if (speciesData.gender_rate === -1) quirks.push('Genderless - can only breed with Ditto')
  if (speciesData.egg_groups.length > 1) quirks.push('Multiple egg groups increase breeding options')
  if (speciesData.hatch_counter > 20) quirks.push('Long hatching time')
  if (speciesData.base_happiness < 70) quirks.push('Low base friendship affects breeding')
  
  return quirks.length > 0 ? quirks.join('; ') : 'Standard breeding mechanics'
}

const getFormChangeTriggers = (id: number) => {
  const formChanges: Record<number, string> = {
    25: 'Cannot evolve in Generation I',
    143: 'Requires trade to evolve',
    144: 'Requires trade with item to evolve',
    150: 'No evolution - final form',
    151: 'No evolution - mythical Pokémon'
  }
  
  return formChanges[id] || 'No special form changes in Generation I'
}

const getEventExclusive = (id: number) => {
  const events: Record<number, string> = {
    151: 'Originally only available through special events',
    144: 'Required special item in later generations',
    145: 'Required special item in later generations'
  }
  
  return events[id] || 'Available through normal gameplay in Generation I'
}

const getStatChanges = (name: string) => {
  const changes: Record<string, string> = {
    'Pikachu': 'Special stat split in Generation II',
    'Eevee': 'Multiple evolution options added in later generations',
    'Porygon': 'Evolution methods changed in later generations',
    'Magmar': 'Special stat split affected its role',
    'Electabuzz': 'Special stat split affected its role'
  }
  
  return changes[name] || 'Stat system remained consistent in Generation I'
}

// In-memory cache for parsed evolution chains
const evolutionChainCache = new Map<string, any[]>()

const parseEvolutionChain = async (chainUrl: string) => {
  if (evolutionChainCache.has(chainUrl)) {
    return evolutionChainCache.get(chainUrl)!
  }

  const response = await fetch(chainUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain at ${chainUrl}`)
  }
  const evolutionData = await response.json()
  const chain = evolutionData.chain

  const evolutions: any[] = []
  
  const parseChainNode = async (currentNode: any, method: string = 'Start') => {
    if (!currentNode) return
    
    // Fetch basic details for the name to get ID and official artwork
    const pokemonName = currentNode.species.name
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    if (pokemonResponse.ok) {
      const pokemonData = await pokemonResponse.json()
      evolutions.push({
        id: pokemonData.id,
        name: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
        image: pokemonData.sprites.other['official-artwork'].front_default,
        method: method
      })
    }
    
    if (currentNode.evolves_to.length > 0) {
      for (const evolution of currentNode.evolves_to) {
        let evolutionMethod = 'Level up'
        if (evolution.evolution_details.length > 0) {
          const details = evolution.evolution_details[0]
          if (details.min_level) {
            evolutionMethod = `Level ${details.min_level}`
          } else if (details.item) {
            evolutionMethod = details.item.name.replace('-', ' ').charAt(0).toUpperCase() + details.item.name.replace('-', ' ').slice(1)
          } else if (details.trigger.name === 'trade') {
            evolutionMethod = 'Trade'
          } else if (details.happiness) {
            evolutionMethod = 'High Friendship'
          }
        }
        await parseChainNode(evolution, evolutionMethod)
      }
    }
  }

  await parseChainNode(chain)
  evolutionChainCache.set(chainUrl, evolutions)
  return evolutions
}

async function main() {
  console.log('Starting seed process for 151 Pokémon...')
  
  // Clear any existing cached Pokémon
  await prisma.pokemon.deleteMany()
  console.log('Cleared existing cached Pokémon entries.')

  // Fetch all 151 Pokémon names and species URLs
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  const listData = await response.json()
  
  let count = 0
  for (const item of listData.results) {
    count++
    console.log(`[${count}/151] Fetching ${item.name}...`)
    try {
      const pokemonResponse = await fetch(item.url)
      const pokemonData = await pokemonResponse.json()
      
      const speciesResponse = await fetch(pokemonData.species.url)
      const speciesData = await speciesResponse.json()
      
      // Parse evolution chain
      let evolutionChain: any[] = []
      if (speciesData.evolution_chain?.url) {
        try {
          evolutionChain = await parseEvolutionChain(speciesData.evolution_chain.url)
        } catch (e) {
          console.warn(`Could not fetch evolution chain for ${item.name}:`, e)
        }
      }
      
      // Map base stats
      const stats = pokemonData.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat
      }))
      
      const totalStats = stats.reduce((sum: number, stat: any) => sum + stat.value, 0)
      
      // Extract abilities
      const abilities = pokemonData.abilities
        .filter((a: any) => !a.is_hidden)
        .map((a: any) => a.ability.name)
        
      const hiddenAbilities = pokemonData.abilities
        .filter((a: any) => a.is_hidden)
        .map((a: any) => a.ability.name)

      // Learnsets
      const learnset = {
        levelUp: pokemonData.moves
          .filter((move: any) => 
            move.version_group_details.some((detail: any) => 
              detail.version_group.name === 'red-blue' && detail.move_learn_method.name === 'level-up'
            )
          )
          .map((move: any) => {
            const detail = move.version_group_details.find((d: any) => 
              d.version_group.name === 'red-blue' && d.move_learn_method.name === 'level-up'
            )
            return {
              level: detail.level_learned_at,
              name: move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1),
              type: move.move.type?.name || 'normal',
              category: 'Physical',
              power: 0,
              accuracy: 0
            }
          })
          .sort((a: any, b: any) => a.level - b.level),
        tmMoves: pokemonData.moves
          .filter((move: any) => 
            move.version_group_details.some((detail: any) => 
              detail.version_group.name === 'red-blue' && detail.move_learn_method.name === 'machine'
            )
          )
          .map((move: any) => move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1)),
        eggMoves: pokemonData.moves
          .filter((move: any) => 
            move.version_group_details.some((detail: any) => 
              detail.move_learn_method.name === 'egg'
            )
          )
          .map((move: any) => move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1))
      }

      // Flavor Text
      const flavorTexts = speciesData.flavor_text_entries
        .filter((entry: any) => entry.language.name === 'en')
        .reduce((acc: any, entry: any) => {
          const version = entry.version.name
          const text = entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
          if (version.includes('red')) acc.red = text
          if (version.includes('blue')) acc.blue = text
          if (version.includes('yellow')) acc.yellow = text
          return acc
        }, {})

      // Gender Ratio
      const genderRate = speciesData.gender_rate
      let genderRatio = 'Genderless'
      if (genderRate !== -1) {
        const femalePercentage = (genderRate / 8) * 100
        const malePercentage = 100 - femalePercentage
        genderRatio = `${malePercentage}% male, ${femalePercentage}% female`
      }

      // Ratings & Competitive Analysis
      const statRatings = {
        hp: getStatRating(stats.find((s: any) => s.name === 'hp')?.value || 0),
        attack: getStatRating(stats.find((s: any) => s.name === 'attack')?.value || 0),
        defense: getStatRating(stats.find((s: any) => s.name === 'defense')?.value || 0),
        spAtk: getStatRating(stats.find((s: any) => s.name === 'special-attack')?.value || 0),
        spDef: getStatRating(stats.find((s: any) => s.name === 'special-defense')?.value || 0),
        speed: getStatRating(stats.find((s: any) => s.name === 'speed')?.value || 0),
        total: getStatRating(totalStats / 6)
      }

      const competitive = {
        strengths: getStrengths(pokemonData.types.map((t: any) => t.type.name), stats),
        weaknesses: getWeaknesses(pokemonData.types.map((t: any) => t.type.name)),
        smogonTier: getSmogonTier(pokemonData.id, totalStats),
        commonRoles: getCommonRoles(pokemonData.types.map((t: any) => t.type.name), stats),
        optimalMovesets: getOptimalMovesets(pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1), pokemonData.types.map((t: any) => t.type.name)),
        counters: getCounters(pokemonData.types.map((t: any) => t.type.name), stats),
        teamSynergy: getTeamSynergy(pokemonData.types.map((t: any) => t.type.name))
      }

      const trivia = {
        designOrigin: getDesignOrigin(pokemonData.id, pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)),
        nameEtymology: getNameEtymology(pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)),
        notableAppearances: getNotableAppearances(pokemonData.id),
        historicalContext: getHistoricalContext(pokemonData.id),
        developerTrivia: getDeveloperTrivia(pokemonData.id)
      }

      const advancedMechanics = {
        hiddenPowerRange: getHiddenPowerRange(stats),
        breedingQuirks: getBreedingQuirks(speciesData),
        formChangeTriggers: getFormChangeTriggers(pokemonData.id),
        eventExclusive: getEventExclusive(pokemonData.id),
        statChanges: getStatChanges(pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1))
      }

      // Save to database
      await prisma.pokemon.create({
        data: {
          id: pokemonData.id,
          name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
          types: pokemonData.types.map((type: any) => type.type.name),
          height: pokemonData.height,
          weight: pokemonData.weight,
          image: pokemonData.sprites.other['official-artwork'].front_default || '',
          shinyImage: pokemonData.sprites.other['official-artwork'].front_shiny || '',
          category: speciesData.genera.find((g: any) => g.language.name === 'en')?.genus || 'Pokémon',
          baseFriendship: speciesData.base_happiness,
          baseExperience: pokemonData.base_experience,
          catchRate: Math.round((255 - speciesData.capture_rate) / 255 * 100),
          genderRatio,
          eggCycles: speciesData.hatch_counter,
          stats: stats as any,
          abilities: abilities as any,
          hiddenAbilities: hiddenAbilities as any,
          eggGroups: speciesData.egg_groups.map((g: any) => g.name) as any,
          naturalHabitat: [speciesData.habitat?.name || 'unknown'] as any,
          statRatings: statRatings as any,
          learnset: learnset as any,
          competitive: competitive as any,
          flavorText: flavorTexts as any,
          trivia: trivia as any,
          advancedMechanics: advancedMechanics as any,
          evolutionChain: evolutionChain as any
        }
      })

    } catch (error) {
      console.error(`Failed to seed ${item.name}:`, error)
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
