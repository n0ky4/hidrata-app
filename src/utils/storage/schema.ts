import { z } from 'zod'

// Schema dos dados que serão salvos no localStorage
export const StorageSchema = z.object({
    settings: z.object({
        age: z.coerce.number().int().positive(),
        weight: z.coerce.number().int().positive(),
        containers: z
            .object({
                id: z.string().uuid(),
                label: z.string().optional(),
                quantity: z.coerce.number().int().positive(),
            })
            .array()
            .default([]),
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
                .union([
                    z.object({
                        id: z.string(),
                        type: z.union([z.literal('glass'), z.literal('bottle')]),
                        createdAt: z.coerce.string(),
                    }),
                    z.object({
                        id: z.string(),
                        type: z.literal('custom'),
                        quantity: z.coerce.number().int().positive(),
                        label: z.string().optional(),
                        createdAt: z.coerce.string(),
                    }),
                ])
                .array(),
        })
        .array()
        .default([]),
})

export type StorageType = z.infer<typeof StorageSchema>
export type RecordItemType = StorageType['records'][0]['items']
export type ItemsType = StorageType['records'][0]['items'][0]['type']
export type ContainerType = StorageType['settings']['containers']
export type SettingsType = StorageType['settings']
