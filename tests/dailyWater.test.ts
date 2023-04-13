import { expect, test } from 'vitest'
import { getRecommendedWaterIntake } from './../src/utils/water'

test('getRecommendedWaterIntake should return the correct value according to age and weight', () => {
    expect(getRecommendedWaterIntake(9, 30)).toBe(30 * 40)
    expect(getRecommendedWaterIntake(16, 60)).toBe(60 * 40)
    expect(getRecommendedWaterIntake(17, 70)).toBe(70 * 40)
    expect(getRecommendedWaterIntake(55, 70)).toBe(70 * 35)
    expect(getRecommendedWaterIntake(36, 75)).toBe(75 * 35)
    expect(getRecommendedWaterIntake(60, 75)).toBe(75 * 30)
    expect(getRecommendedWaterIntake(66, 75)).toBe(75 * 25)
})
