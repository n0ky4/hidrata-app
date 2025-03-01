import { z } from 'zod'
import { climate } from '../core/climate'

export const recordSchema = z.object({
    time: z.string(), // Data em UTC
    amount: z.number().positive(), // Quantidade deve ser um número positivo
    containerId: z.string().optional(), // Container é opcional
})
export type Record = z.infer<typeof recordSchema>

export const historyEntrySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Valida formato YYYY-MM-DD
    climate: z.enum(Object.values(climate.conditions) as [string, ...string[]]), // Condição climática
    goal: z.number().positive(), // Meta deve ser um número positivo
    consumed: z.number().positive(), // Consumido deve ser um número positivo
    records: z.array(recordSchema), // Lista de registros
})
export type HistoryEntry = z.infer<typeof historyEntrySchema>

export const configSchema = z.object({
    version: z.string(), // Versão do arquivo de configuração
    consumption: z.object({
        history: z.array(historyEntrySchema), // Histórico de consumo
    }),
})
export type Config = z.infer<typeof configSchema>
