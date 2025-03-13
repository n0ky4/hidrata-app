import { z } from 'zod'

export const MAX_CONTAINER_VOLUME = 10_000

export const containerSchema = z.object({
    id: z.string(), // Id do container
    name: z.string().optional(), // Nome do container
    volume: z.number().int().positive().max(MAX_CONTAINER_VOLUME), // Volume do container em ml
})
export type Container = z.infer<typeof containerSchema>

export type ContainerCreateData = Omit<Container, 'id'>
export type ContainerUpdateData = Partial<Container>

export const containersSchema = z.object({
    containers: z.array(containerSchema).default([]), // Lista de containers
})
export type Containers = z.infer<typeof containersSchema>
