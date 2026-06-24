import { getTypeEffectiveness } from '@/components/tools/DamageCalculator'

describe('Damage Calculator Type Effectiveness', () => {
  test('Super effective attacking (Fire vs Grass)', () => {
    expect(getTypeEffectiveness('fire', ['grass'])).toBe(2)
  })

  test('Not very effective attacking (Fire vs Water)', () => {
    expect(getTypeEffectiveness('fire', ['water'])).toBe(0.5)
  })

  test('Immune attacking (Normal vs Ghost)', () => {
    expect(getTypeEffectiveness('normal', ['ghost'])).toBe(0)
  })

  test('Neutral effectiveness (Normal vs Grass)', () => {
    expect(getTypeEffectiveness('normal', ['grass'])).toBe(1)
  })

  test('Dual-type defending effectiveness (Fire vs Grass/Steel)', () => {
    // Fire is 2x vs Grass and 2x vs Steel -> should be 4x total!
    expect(getTypeEffectiveness('fire', ['grass', 'steel'])).toBe(4)
  })

  test('Dual-type defending effectiveness (Ground vs Poison/Flying)', () => {
    // Ground is 2x vs Poison but 0x vs Flying -> should be 0x total!
    expect(getTypeEffectiveness('ground', ['poison', 'flying'])).toBe(0)
  })
})
