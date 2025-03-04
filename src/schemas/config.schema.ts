import { z } from 'zod'
import { notifications } from '../core/notifications'
import { theme } from '../core/theme'
import { AvailableVolumes, AvailableWeights, units } from '../core/units'
import { i18n } from '../i18n'

export const ageSchema = z.number().int().positive().min(1).max(120)
export const weightSchema = z.number().positive().min(3).max(350)

export const configSchema = z.object({
    language: z
        .enum(Object.keys(i18n.availableLanguages) as [string, ...string[]])
        .default('en-US'), // Idioma do aplicativo
    notifications: z
        .object({
            enabled: z.boolean().default(true),
            interval: z.number().int().positive().default(60), // Minutos, deve ser um número inteiro positivo
            sound: z
                .enum(Object.keys(notifications.sounds) as [string, ...string[]])
                .default('default'), // Som da notificação
        })
        .default({}),
    units: z
        .object({
            weight: z
                .custom<AvailableWeights>((value) => units.availableWeights.includes(value))
                .default('kg'),
            volume: z
                .custom<AvailableVolumes>((value) => units.availableVolumes.includes(value))
                .default('ml'),
        })
        .default({}),
    theme: z
        .object({
            mode: z.enum(theme.themes).default('system'), // Modo do tema
            accentColor: z.string().regex(theme.hexRegex).optional(), // Hex color validation
            font: z.string().default('default'), // Fonte do aplicativo
        })
        .default({}),
    age: ageSchema,
    weight: weightSchema,
    climate: z
        .object({
            enabled: z.boolean().default(false), // Usar detecção de condições climáticas
            latitude: z.number().min(-90).max(90).optional(), // Latitude válida
            longitude: z.number().min(-180).max(180).optional(), // Longitude válida
        })
        .default({}),
})

export type Config = z.infer<typeof configSchema>
export type ConfigInitOptions = z.input<typeof configSchema>
