import { expect, test } from 'vitest'
import { Storage } from './../src/utils/storage'

test('isDataValid() should return true when data is valid', (t) => {
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
