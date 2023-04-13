import { expect, test } from 'vitest'
import { getDailyWaterML } from './../src/utils/water'

test('getDailyWaterML should return the correct value according to age and weight', () => {
    expect(getDailyWaterML(9, 30)).toBe(30 * 40)
    expect(getDailyWaterML(16, 60)).toBe(60 * 40)
    expect(getDailyWaterML(17, 70)).toBe(70 * 40)
    expect(getDailyWaterML(55, 70)).toBe(70 * 35)
    expect(getDailyWaterML(36, 75)).toBe(75 * 35)
    expect(getDailyWaterML(60, 75)).toBe(75 * 30)
    expect(getDailyWaterML(66, 75)).toBe(75 * 25)
})
