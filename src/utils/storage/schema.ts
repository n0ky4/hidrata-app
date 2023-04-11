import { z } from 'zod'

export const StorageSchema = z.object({
    settings: z.object({
        height: z.coerce.number().int().positive(),
        weight: z.coerce.number().int().positive(),
        notify: z.object({
            enabled: z.coerce.boolean().default(false),
            everyMinutes: z.coerce.number().int().positive().default(120),
            sound: z.union([z.literal('bells'), z.literal('drop'), z.literal('marimba')]),
        }),
    }),
    records: z
        .object({
            date: z.coerce.string().refine((x) => {
                const [year, month, day] = x.split('-').map((x) => parseInt(x))
                if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day))
                    return false
                if (month < 1 || month > 12) return false
                if (day < 0 || day > 31) return false
                return true
            }),
            settings: z.object({
                height: z.coerce.number().int().positive(),
                weight: z.coerce.number().int().positive(),
            }),
            items: z
                .union([
                    z.literal('glass'),
                    z.object({ type: z.literal('custom'), ml: z.number().int().positive() }),
                ])
                .array(),
        })
        .array(),
})

export type StorageType = z.infer<typeof StorageSchema>

export const defaultData = {
    settings: {
        notify: {
            enabled: false,
            everyMinutes: 30,
            sound: 'bells',
        },
    },
    records: [],
}
