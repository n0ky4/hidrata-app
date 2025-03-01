import { z } from 'zod'
import { climate } from '../core/climate'
import pkg from './../../package.json'

export const recordSchema = z.object({
    id: z.string(), // ID do registro
    time: z.string(), // Data em UTC
    amount: z.number().positive(), // Quantidade deve ser um número positivo
    containerId: z.string().optional(), // Container é opcional
})

export type Record = z.infer<typeof recordSchema>
export type RecordCreateData = Omit<Record, 'id'>

export const historyEntrySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Valida formato YYYY-MM-DD
    climate: z
        .enum(Object.values(climate.conditions) as [string, ...string[]])
        .default(climate.conditions.favorable), // Condição climática
    goal: z.number().positive(), // Meta deve ser um número positivo
    consumed: z.number().positive(), // Consumido deve ser um número positivo
    records: z.array(recordSchema).default([]), // Lista de registros
})
export type HistoryEntry = z.infer<typeof historyEntrySchema>

export const dataSchema = z.object({
    version: z.string().default(pkg.version), // Versão do arquivo de configuração
    consumption: z
        .object({
            history: z.array(historyEntrySchema).default([]), // Histórico de consumo
        })
        .default({ history: [] }),
})
export type Data = z.infer<typeof dataSchema>
