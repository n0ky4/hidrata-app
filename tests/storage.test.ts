import { expect, test } from 'vitest'
import { Storage } from './../src/utils/storage'

test('isDataValid() should return true when data is valid', () => {
    const storage = new Storage(true)
    const validData = {
        settings: {
            age: 35,
            weight: 70,
            notify: { enabled: false, everyMinutes: 120, sound: 'bells' },
        },
    }

    const result = storage.isDataValid(validData)
    expect(result).toBe(true)
})

test('isDataValid() should return false when data is invalid', () => {
    const storage = new Storage(true)
    const invalidData = { banana: true }

    const result = storage.isDataValid(invalidData)
    expect(result).toBe(false)
})
