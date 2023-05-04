import { z } from 'zod'

export const StorageSchema = z.object({
    settings: z.object({
        age: z.coerce.number().int().positive(),
        weight: z.coerce.number().int().positive(),
        notify: z
            .object({
                enabled: z.coerce.boolean(),
                everyMinutes: z.coerce.number().int().positive(),
                sound: z.union([z.literal('bells'), z.literal('drop'), z.literal('marimba')]),
            })
            .default({
                enabled: false,
                everyMinutes: 120,
                sound: 'bells',
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
                age: z.coerce.number().int().positive(),
                weight: z.coerce.number().int().positive(),
            }),
            items: z
                .object({
                    id: z.string().uuid(),
                    type: z.union([z.literal('glass'), z.literal('bottle'), z.literal('custom')]),
                    ml: z.coerce.number().int().positive().optional(),
                    createdAt: z.coerce.string(),
                })
                .array(),
        })
        .array()
        .optional(),
})

export type StorageType = z.infer<typeof StorageSchema>
