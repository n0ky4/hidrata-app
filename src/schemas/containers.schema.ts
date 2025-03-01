import { z } from 'zod'
import pkg from './../../package.json'

export const containerSchema = z.object({
    id: z.string(), // Id do container
    name: z.string(), // Nome do container
    volume: z.number().int().positive().max(10_000), // Volume do container em ml
})
export type Container = z.infer<typeof containerSchema>

export type ContainerCreateData = Omit<Container, 'id'>
export type ContainerUpdateData = Partial<Container>

export const containersSchema = z.object({
    version: z.string().default(pkg.version), // Versão do arquivo de configuração
    containers: z.array(containerSchema).default([]), // Lista de containers
})
export type Containers = z.infer<typeof containersSchema>
