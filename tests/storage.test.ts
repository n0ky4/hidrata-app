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
        records: [
            {
                date: '2023-01-01',
                settings: {
                    age: 35,
                    weight: 70,
                },
                items: [
                    { type: 'glass', createdAt: '2023-05-03T19:00:20.000Z' },
                    { type: 'custom', ml: 500, createdAt: '2023-05-03T22:00:00.000Z' },
                ],
            },
        ],
    }

    const result = storage.isDataValid(validData)
    expect(result).toBe(true)
})

test('isDataValid() should return false when data is invalid', () => {
    const storage = new Storage(true)
    const invalidData = {
        settings: {
            age: 'this is a string',
            weight: '50',
            notify: {
                enabled: 10,
                everyMinutes: 'zzzzzzzzzz',
            },
        },
        records: [
            {
                date: new Date(),
                settings: {
                    banana: true,
                },
                items: ['glass', { type: 'custom', ml: 500 }],
            },
        ],
    }

    const result = storage.isDataValid(invalidData)
    expect(result).toBe(false)
})
