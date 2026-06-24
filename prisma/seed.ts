import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const formatName = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

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
  const ubers = [150, 151] // Mewtwo, Mew
  const ou = [65, 113, 91, 103, 94, 76, 124, 131, 112, 143, 121, 128, 135, 145] // Alakazam, Chansey, Cloyster, Exeggutor, Gengar, Golem, Jynx, Lapras, Rhydon, Snorlax, Starmie, Tauros, Jolteon, Zapdos
  const uu = [144, 6, 36, 85, 149, 130, 93, 97, 141, 64, 115, 146, 34, 31, 139, 53, 26, 73, 134] // Articuno, Charizard, Clefable, Dodrio, Dragonite, Gyarados, Haunter, Hypno, Kabutops, Kadabra, Kangaskhan, Moltres, Nidoking, Nidoqueen, Omastar, Persian, Raichu, Tentacruel, Vaporeon

  if (ubers.includes(id)) return 'Uber'
  if (ou.includes(id)) return 'OU'
  if (uu.includes(id)) return 'UU'
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
    'Venusaur': ['Razor Leaf', 'Sleep Powder', 'Swords Dance', 'Body Slam'],
    'Charizard': ['Fire Blast', 'Slash', 'Earthquake', 'Swords Dance'],
    'Blastoise': ['Surf', 'Blizzard', 'Body Slam', 'Rest'],
    'Butterfree': ['Sleep Powder', 'Stun Spore', 'Psychic', 'Mega Drain'],
    'Beedrill': ['Twineedle', 'Swords Dance', 'Agility', 'Hyper Beam'],
    'Pidgeot': ['Double-Edge', 'Fly', 'Quick Attack', 'Mirror Move'],
    'Raticate': ['Super Fang', 'Body Slam', 'Bubblebeam', 'Blizzard'],
    'Fearow': ['Drill Peck', 'Double-Edge', 'Agility', 'Mirror Move'],
    'Arbok': ['Glare', 'Wrap', 'Earthquake', 'Hyper Beam'],
    'Pikachu': ['Thunderbolt', 'Thunder Wave', 'Surf', 'Quick Attack'],
    'Raichu': ['Thunderbolt', 'Thunder Wave', 'Surf', 'Hyper Beam'],
    'Sandslash': ['Earthquake', 'Rock Slide', 'Swords Dance', 'Body Slam'],
    'Nidoqueen': ['Earthquake', 'Blizzard', 'Thunder', 'Body Slam'],
    'Nidoking': ['Earthquake', 'Blizzard', 'Thunderbolt', 'Body Slam'],
    'Clefable': ['Blizzard', 'Body Slam', 'Thunder Wave', 'Sing'],
    'Ninetales': ['Fire Spin', 'Flamethrower', 'Confuse Ray', 'Body Slam'],
    'Wigglytuff': ['Body Slam', 'Blizzard', 'Thunder Wave', 'Sing'],
    'Golbat': ['Confuse Ray', 'Haze', 'Mega Drain', 'Double-Edge'],
    'Vileplume': ['Sleep Powder', 'Razor Leaf', 'Stun Spore', 'Swords Dance'],
    'Parasect': ['Spore', 'Slash', 'Mega Drain', 'Swords Dance'],
    'Venomoth': ['Sleep Powder', 'Psychic', 'Stun Spore', 'Double-Edge'],
    'Dugtrio': ['Earthquake', 'Rock Slide', 'Slash', 'Substitute'],
    'Persian': ['Slash', 'Bubblebeam', 'Thunderbolt', 'Hyper Beam'],
    'Golduck': ['Surf', 'Blizzard', 'Amnesia', 'Submission'],
    'Primeape': ['Submission', 'Rock Slide', 'Body Slam', 'Focus Energy'],
    'Arcanine': ['Fire Blast', 'Body Slam', 'Hyper Beam', 'Reflect'],
    'Poliwrath': ['Blizzard', 'Submission', 'Hypnosis', 'Amnesia'],
    'Alakazam': ['Psychic', 'Recover', 'Thunder Wave', 'Reflect'],
    'Machamp': ['Submission', 'Earthquake', 'Rock Slide', 'Body Slam'],
    'Victreebel': ['Razor Leaf', 'Sleep Powder', 'Wrap', 'Swords Dance'],
    'Tentacruel': ['Blizzard', 'Surf', 'Wrap', 'Barrier'],
    'Golem': ['Earthquake', 'Rock Slide', 'Body Slam', 'Explosion'],
    'Rapidash': ['Fire Spin', 'Fire Blast', 'Body Slam', 'Agility'],
    'Slowbro': ['Surf', 'Amnesia', 'Thunder Wave', 'Rest'],
    'Magneton': ['Thunderbolt', 'Thunder Wave', 'Double-Edge', 'Flash'],
    'Farfetch\'d': ['Slash', 'Swords Dance', 'Agility', 'Body Slam'],
    'Dodrio': ['Drill Peck', 'Body Slam', 'Hyper Beam', 'Agility'],
    'Dewgong': ['Blizzard', 'Surf', 'Body Slam', 'Rest'],
    'Muk': ['Sludge', 'Body Slam', 'Screech', 'Explosion'],
    'Cloyster': ['Clamp', 'Blizzard', 'Surf', 'Explosion'],
    'Gastly': ['Night Shade', 'Confuse Ray', 'Toxic', 'Psychic'],
    'Haunter': ['Psychic', 'Thunderbolt', 'Confuse Ray', 'Explosion'],
    'Gengar': ['Hypnosis', 'Explosion', 'Thunderbolt', 'Psychic'],
    'Onix': ['Earthquake', 'Rock Slide', 'Bind', 'Explosion'],
    'Hypno': ['Psychic', 'Thunder Wave', 'Hypnosis', 'Rest'],
    'Kingler': ['Crabhammer', 'Swords Dance', 'Body Slam', 'Blizzard'],
    'Electrode': ['Thunderbolt', 'Thunder Wave', 'Screen', 'Explosion'],
    'Exeggutor': ['Psychic', 'Sleep Powder', 'Stun Spore', 'Explosion'],
    'Marowak': ['Earthquake', 'Blizzard', 'Body Slam', 'Swords Dance'],
    'Hitmonlee': ['High Jump Kick', 'Body Slam', 'Double-Edge', 'Meditate'],
    'Hitmonchan': ['Fire Punch', 'Ice Punch', 'Thunder Punch', 'Submission'],
    'Lickitung': ['Swords Dance', 'Body Slam', 'Earthquake', 'Hyper Beam'],
    'Weezing': ['Sludge', 'Thunderbolt', 'Explosion', 'Haze'],
    'Rhyhorn': ['Earthquake', 'Rock Slide', 'Body Slam', 'Substitute'],
    'Rhydon': ['Earthquake', 'Rock Slide', 'Body Slam', 'Substitute'],
    'Chansey': ['Ice Beam', 'Soft-Boiled', 'Thunder Wave', 'Sing'],
    'Tangela': ['Sleep Powder', 'Stun Spore', 'Bind', 'Growth'],
    'Kangaskhan': ['Body Slam', 'Earthquake', 'Rock Slide', 'Hyper Beam'],
    'Horsea': ['Surf', 'Blizzard', 'Hydro Pump', 'Agility'],
    'Seadra': ['Surf', 'Blizzard', 'Hydro Pump', 'Agility'],
    'Goldeen': ['Waterfall', 'Blizzard', 'Agility', 'Double-Edge'],
    'Seaking': ['Surf', 'Blizzard', 'Agility', 'Double-Edge'],
    'Staryu': ['Surf', 'Thunderbolt', 'Recover', 'Minimize'],
    'Starmie': ['Blizzard', 'Thunderbolt', 'Thunder Wave', 'Recover'],
    'Mr. Mime': ['Psychic', 'Thunder Wave', 'Thunderbolt', 'Barrier'],
    'Scyther': ['Slash', 'Swords Dance', 'Agility', 'Double-Edge'],
    'Jynx': ['Blizzard', 'Psychic', 'Lovely Kiss', 'Body Slam'],
    'Electabuzz': ['Thunderbolt', 'Thunder Wave', 'Psychic', 'Submission'],
    'Magmar': ['Fire Blast', 'Confuse Ray', 'Body Slam', 'Psychic'],
    'Pinsir': ['Swords Dance', 'Body Slam', 'Submission', 'Slash'],
    'Tauros': ['Body Slam', 'Hyper Beam', 'Blizzard', 'Earthquake'],
    'Gyarados': ['Hydro Pump', 'Thunderbolt', 'Body Slam', 'Hyper Beam'],
    'Lapras': ['Blizzard', 'Thunderbolt', 'Body Slam', 'Sing'],
    'Ditto': ['Transform'],
    'Eevee': ['Double-Edge', 'Quick Attack', 'Reflect', 'Bite'],
    'Vaporeon': ['Surf', 'Blizzard', 'Body Slam', 'Rest'],
    'Jolteon': ['Thunderbolt', 'Thunder Wave', 'Double Kick', 'Pin Missile'],
    'Flareon': ['Fire Blast', 'Body Slam', 'Hyper Beam', 'Quick Attack'],
    'Porygon': ['Blizzard', 'Thunderbolt', 'Recover', 'Thunder Wave'],
    'Omanyte': ['Surf', 'Blizzard', 'Ice Beam', 'Rest'],
    'Omastar': ['Surf', 'Blizzard', 'Ice Beam', 'Rest'],
    'Kabuto': ['Surf', 'Slash', 'Blizzard', 'Rest'],
    'Kabutops': ['Swords Dance', 'Body Slam', 'Surf', 'Blizzard'],
    'Aerodactyl': ['Sky Attack', 'Double-Edge', 'Fire Blast', 'Agility'],
    'Snorlax': ['Body Slam', 'Hyper Beam', 'Earthquake', 'Self-Destruct'],
    'Articuno': ['Blizzard', 'Agility', 'Double-Edge', 'Reflect'],
    'Zapdos': ['Thunderbolt', 'Drill Peck', 'Thunder Wave', 'Agility'],
    'Moltres': ['Fire Blast', 'Agility', 'Fire Spin', 'Double-Edge'],
    'Dratini': ['Thunder Wave', 'Thunderbolt', 'Blizzard', 'Wrap'],
    'Dragonair': ['Thunder Wave', 'Thunderbolt', 'Blizzard', 'Wrap'],
    'Dragonite': ['Wrap', 'Agility', 'Blizzard', 'Hyper Beam'],
    'Mewtwo': ['Psychic', 'Amnesia', 'Recover', 'Thunderbolt'],
    'Mew': ['Swords Dance', 'Earthquake', 'Body Slam', 'Soft-Boiled']
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
    52: ['Team Rocket\'s Pokémon', 'Anime regular', 'Can speak human language'],
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
    
    const pokemonName = currentNode.species.name
    await delay(50)
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    if (pokemonResponse.ok) {
      const pokemonData = await pokemonResponse.json()
      evolutions.push({
        id: pokemonData.id,
        name: formatName(pokemonName),
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
            evolutionMethod = formatName(details.item.name)
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
  console.log('Clearing database tables...')
  await prisma.pokemon.deleteMany()
  await prisma.move.deleteMany()
  await prisma.item.deleteMany()
  console.log('Cleared Pokemon, Move, and Item tables.')

  // ==========================================
  // 1. Seed Moves (Generation 1: Moves 1 to 165)
  // ==========================================
  console.log('Seeding 165 Generation I moves...')
  for (let id = 1; id <= 165; id++) {
    try {
      await delay(40)
      const res = await fetch(`https://pokeapi.co/api/v2/move/${id}/`)
      if (!res.ok) continue
      const data = await res.json()
      
      const englishDesc = data.flavor_text_entries
        .find((entry: any) => entry.language.name === 'en' && entry.version_group.name === 'red-blue')
        ?.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') || 'No Gen 1 description available.'

      await prisma.move.create({
        data: {
          id: data.id,
          name: formatName(data.name),
          type: data.type.name,
          power: data.power,
          accuracy: data.accuracy,
          pp: data.pp,
          damageClass: data.damage_class?.name || 'status',
          description: englishDesc
        }
      })
      if (id % 30 === 0 || id === 165) {
        console.log(`Seeded ${id}/165 moves...`)
      }
    } catch (err) {
      console.error(`Failed to seed move ID ${id}:`, err)
    }
  }

  // ==========================================
  // 2. Seed Items (Kanto Store Items List)
  // ==========================================
  const itemNames = [
    'master-ball', 'ultra-ball', 'great-ball', 'poke-ball', 'safari-ball',
    'potion', 'super-potion', 'hyper-potion', 'max-potion', 'full-restore',
    'revive', 'max-revive', 'antidote', 'burn-heal', 'ice-heal', 'awakening',
    'paralyze-heal', 'full-heal', 'escape-rope', 'repel', 'super-repel', 'max-repel',
    'fire-stone', 'water-stone', 'thunder-stone', 'leaf-stone', 'moon-stone'
  ]
  console.log(`Seeding ${itemNames.length} Kanto items...`)
  let itemIndex = 0
  for (const name of itemNames) {
    itemIndex++
    try {
      await delay(40)
      const res = await fetch(`https://pokeapi.co/api/v2/item/${name}/`)
      if (!res.ok) continue
      const data = await res.json()

      const englishDesc = data.flavor_text_entries
        .find((entry: any) => entry.language.name === 'en' && entry.version_group.name === 'red-blue')
        ?.text.replace(/\f/g, ' ').replace(/\n/g, ' ') || 
        data.effect_entries.find((entry: any) => entry.language.name === 'en')?.short_effect || 'No description.'

      await prisma.item.create({
        data: {
          id: data.id,
          name: formatName(data.name),
          category: data.category.name,
          cost: data.cost,
          description: englishDesc,
          sprite: data.sprites?.default || ''
        }
      })
    } catch (err) {
      console.error(`Failed to seed item ${name}:`, err)
    }
  }
  console.log('Seeding items complete.')

  // ==========================================
  // 3. Seed 151 Kanto Pokémon
  // ==========================================
  console.log('Seeding 151 Pokémon with animated sprites, cries, and encounters...')
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  const listData = await response.json()
  
  let count = 0
  for (const item of listData.results) {
    count++
    try {
      await delay(45)
      const pokemonResponse = await fetch(item.url)
      const pokemonData = await pokemonResponse.json()
      
      const speciesResponse = await fetch(pokemonData.species.url)
      const speciesData = await speciesResponse.json()
      
      // Fetch encounters
      await delay(40)
      const encountersResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id}/encounters`)
      const encountersData = await encountersResponse.json()
      
      // Parse Kanto encounters (Only Red, Blue, and Yellow versions)
      const encounters = encountersData
        .map((enc: any) => {
          const kantoDetails = enc.version_details.filter((vd: any) =>
            ['red', 'blue', 'yellow'].includes(vd.version.name)
          )
          if (kantoDetails.length === 0) return null
          
          return {
            locationName: formatName(enc.location_area.name.replace('-area', '')),
            versions: kantoDetails.map((vd: any) => ({
              version: formatName(vd.version.name),
              maxChance: vd.max_chance,
              methods: vd.encounter_details.map((ed: any) => ({
                method: formatName(ed.method.name),
                minLevel: ed.min_level,
                maxLevel: ed.max_level,
                chance: ed.chance
              }))
            }))
          }
        })
        .filter((e: any) => e !== null)

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
      
      const abilities = pokemonData.abilities
        .filter((a: any) => !a.is_hidden)
        .map((a: any) => formatName(a.ability.name))
        
      const hiddenAbilities = pokemonData.abilities
        .filter((a: any) => a.is_hidden)
        .map((a: any) => formatName(a.ability.name))

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
              name: formatName(move.move.name),
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
          .map((move: any) => formatName(move.move.name)),
        eggMoves: pokemonData.moves
          .filter((move: any) => 
            move.version_group_details.some((detail: any) => 
              detail.move_learn_method.name === 'egg'
            )
          )
          .map((move: any) => formatName(move.move.name))
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
        optimalMovesets: getOptimalMovesets(formatName(pokemonData.name), pokemonData.types.map((t: any) => t.type.name)),
        counters: getCounters(pokemonData.types.map((t: any) => t.type.name), stats),
        teamSynergy: getTeamSynergy(pokemonData.types.map((t: any) => t.type.name))
      }

      const trivia = {
        designOrigin: getDesignOrigin(pokemonData.id, formatName(pokemonData.name)),
        nameEtymology: getNameEtymology(formatName(pokemonData.name)),
        notableAppearances: getNotableAppearances(pokemonData.id),
        historicalContext: getHistoricalContext(pokemonData.id),
        developerTrivia: getDeveloperTrivia(pokemonData.id)
      }

      const advancedMechanics = {
        hiddenPowerRange: getHiddenPowerRange(stats),
        breedingQuirks: getBreedingQuirks(speciesData),
        formChangeTriggers: getFormChangeTriggers(pokemonData.id),
        eventExclusive: getEventExclusive(pokemonData.id),
        statChanges: getStatChanges(formatName(pokemonData.name))
      }

      // Animated images & cry URL
      const animatedImage = pokemonData.sprites.other?.showdown?.front_default ||
        pokemonData.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || ''

      const animatedShinyImage = pokemonData.sprites.other?.showdown?.front_shiny ||
        pokemonData.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_shiny || ''

      const cryUrl = pokemonData.cries?.latest || pokemonData.cries?.legacy || null

      // Save to database
      await prisma.pokemon.create({
        data: {
          id: pokemonData.id,
          name: formatName(pokemonData.name),
          types: pokemonData.types.map((type: any) => type.type.name),
          height: pokemonData.height,
          weight: pokemonData.weight,
          image: pokemonData.sprites.other['official-artwork'].front_default || '',
          shinyImage: pokemonData.sprites.other['official-artwork'].front_shiny || '',
          animatedImage,
          animatedShinyImage,
          cryUrl,
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
          evolutionChain: evolutionChain as any,
          encounters: encounters as any
        }
      })

      if (count % 20 === 0 || count === 151) {
        console.log(`Seeded ${count}/151 Pokémon...`)
      }
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
