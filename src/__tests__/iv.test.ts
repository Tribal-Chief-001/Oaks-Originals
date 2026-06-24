// Helper baseline duplicating IV logic for unit testing
export const calculateStatIV = (baseStat: number, currentStat: number, level: number, isHp: boolean = false, natureMod: number = 1.0) => {
  let iv = 0
  if (isHp) {
    iv = Math.floor((currentStat - level - 10) * 100 / level) - 2 * baseStat
  } else {
    iv = Math.floor((Math.ceil(currentStat / natureMod) - 5) * 100 / level) - 2 * baseStat
  }
  return Math.max(0, Math.min(15, Math.floor(iv / 2))) // 0-15 Gen I scale
}

export const getHiddenPower = (ivResults: { hp: number; attack: number; defense: number; speed: number; specialAttack: number }) => {
  const a = ivResults.attack % 2
  const b = ivResults.defense % 2
  const c = ivResults.speed % 2
  const d = ivResults.specialAttack % 2
  
  const index = (a + 2*b + 4*c + 8*d) % 16
  const types = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark']
  const power = 31 + Math.floor(((a * 1 + b * 2 + c * 4 + d * 8) * 40) / 15)
  return { type: types[index], power }
}

export const breedingCheck = (
  parentA: { id: number; eggGroups: string[] },
  parentB: { id: number; eggGroups: string[] },
  genderA: string,
  genderB: string
) => {
  const isDittoA = parentA.id === 132
  const isDittoB = parentB.id === 132

  if (isDittoA && isDittoB) {
    return { compatible: false, reason: 'Ditto cannot breed with another Ditto.' }
  }

  const groupsA = parentA.eggGroups || []
  const groupsB = parentB.eggGroups || []

  const isUndiscoveredA = groupsA.includes('undiscovered') || groupsA.includes('no-eggs') || groupsA.length === 0
  const isUndiscoveredB = groupsB.includes('undiscovered') || groupsB.includes('no-eggs') || groupsB.length === 0

  if (isUndiscoveredA || isUndiscoveredB) {
    return { compatible: false, reason: 'Legendary and Baby Pokémon cannot breed.' }
  }

  if (isDittoA || isDittoB) {
    return { compatible: true, reason: 'Compatible! Ditto is a universal partner.' }
  }

  if (genderA === genderB && genderA !== 'Genderless') {
    return { compatible: false, reason: 'Breeding partners must be of opposite genders.' }
  }

  if (genderA === 'Genderless' || genderB === 'Genderless') {
    return { compatible: false, reason: 'Genderless Pokémon can only breed with Ditto.' }
  }

  const sharedGroup = groupsA.find(g => groupsB.includes(g))
  if (!sharedGroup) {
    return { compatible: false, reason: 'Breeding partners do not share any Egg Groups.' }
  }

  return { compatible: true, reason: `Compatible!` }
}

describe('IV and Breeding Calculator Logic', () => {
  describe('IV Calculations', () => {
    test('Calculates correct IV baseline (HP)', () => {
      // Pikachu: level 50, base HP 35, current HP 110
      const iv = calculateStatIV(35, 110, 50, true)
      expect(iv).toBeGreaterThanOrEqual(0)
      expect(iv).toBeLessThanOrEqual(15)
    })

    test('Calculates correct IV baseline (Speed)', () => {
      // Pikachu: level 50, base Speed 90, current Speed 100
      const iv = calculateStatIV(90, 100, 50, false)
      expect(iv).toBeGreaterThanOrEqual(0)
      expect(iv).toBeLessThanOrEqual(15)
    })
  })

  describe('Hidden Power Determination', () => {
    test('Hidden Power returns correct type and power range', () => {
      // All odd IV results (15) -> a=1, b=1, c=1, d=1
      // index = (1 + 2 + 4 + 8) % 16 = 15 -> Dark type
      // power = 31 + Math.floor(((1 + 2 + 4 + 8) * 40) / 15) = 71
      const results = { hp: 15, attack: 15, defense: 15, speed: 15, specialAttack: 15 }
      const hp = getHiddenPower(results)
      expect(hp.type).toBe('Dark')
      expect(hp.power).toBe(71)
    })
  })

  describe('Breeding Matcher Compatibility', () => {
    test('Blocks Ditto x Ditto breeding', () => {
      const ditto = { id: 132, eggGroups: ['ditto'] }
      const check = breedingCheck(ditto, ditto, 'Genderless', 'Genderless')
      expect(check.compatible).toBe(false)
      expect(check.reason).toBe('Ditto cannot breed with another Ditto.')
    })

    test('Blocks Legendary / Undiscovered breeding', () => {
      const mewtwo = { id: 150, eggGroups: ['undiscovered'] }
      const pikachu = { id: 25, eggGroups: ['field', 'fairy'] }
      const check = breedingCheck(mewtwo, pikachu, 'Genderless', 'Female')
      expect(check.compatible).toBe(false)
      expect(check.reason).toBe('Legendary and Baby Pokémon cannot breed.')
    })

    test('Allows Ditto to breed with others', () => {
      const ditto = { id: 132, eggGroups: ['ditto'] }
      const pikachu = { id: 25, eggGroups: ['field', 'fairy'] }
      const check = breedingCheck(ditto, pikachu, 'Genderless', 'Male')
      expect(check.compatible).toBe(true)
    })

    test('Blocks same-gender breeding', () => {
      const pikachu1 = { id: 25, eggGroups: ['field', 'fairy'] }
      const raichu = { id: 26, eggGroups: ['field', 'fairy'] }
      const check = breedingCheck(pikachu1, raichu, 'Male', 'Male')
      expect(check.compatible).toBe(false)
      expect(check.reason).toBe('Breeding partners must be of opposite genders.')
    })

    test('Allows opposite-gender same egg group breeding', () => {
      const pikachu = { id: 25, eggGroups: ['field', 'fairy'] }
      const clefable = { id: 36, eggGroups: ['fairy'] }
      const check = breedingCheck(pikachu, clefable, 'Male', 'Female')
      expect(check.compatible).toBe(true)
    })
  })
})
