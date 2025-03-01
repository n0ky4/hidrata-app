import { z } from 'zod'
import pkg from './../../package.json'

export const containerSchema = z.object({
    id: z.string(), // Id do container
    name: z.string(), // Nome do container
    volume: z.number().int().positive().max(10_000), // Volume do container em ml
})

export const containersSchema = z.object({
    version: z.string().default(pkg.version), // Versão do arquivo de configuração
    containers: z.array(containerSchema), // Lista de containers
})
