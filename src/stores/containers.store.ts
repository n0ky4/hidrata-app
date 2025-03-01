import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    Container,
    ContainerCreateData,
    Containers,
    ContainerUpdateData,
} from '../schemas/containers.schema'
import { shortId } from '../util/nanoid'
import { containersSchema } from './../schemas/containers.schema'

const LSKEY_CONTAINERS = 'containers'

type States = {
    data: Containers | null
}

type Actions = {
    init: () => void
    setContainers: (containers: Containers) => void
    arrayModifier: (operation: (containers: Container[]) => Container[]) => void
    addContainer: (container: ContainerCreateData) => void
    updateContainer: (container: ContainerUpdateData) => void
    renameContainer: (id: string, name: string) => void
    removeContainer: (id: string) => void
}

export const useContainers = create(
    persist<States & Actions>(
        (set, get) => ({
            data: null,
            init: () =>
                set(() => {
                    const data = containersSchema.parse({})
                    return {
                        data,
                    }
                }),

            setContainers: (containers) =>
                set((state) => ({
                    ...state,
                    containers,
                })),

            // função genérica para atualizar o `data.containers` com base em uma operação
            arrayModifier: (operation: (containers: Container[]) => Container[]) =>
                set((state) => {
                    if (!state.data) return state

                    return {
                        data: {
                            ...state.data,
                            containers: operation(state.data.containers),
                        },
                    }
                }),

            addContainer: (container) =>
                get().arrayModifier((containers) => [
                    ...containers,
                    { id: shortId(), ...container },
                ]),

            updateContainer: (container) =>
                get().arrayModifier((containers) =>
                    containers.map((c) => (c.id === container.id ? { ...c, ...container } : c))
                ),

            renameContainer: (id, name) =>
                get().arrayModifier((containers) =>
                    containers.map((c) => (c.id === id ? { ...c, name } : c))
                ),

            removeContainer: (id) =>
                get().arrayModifier((containers) => containers.filter((c) => c.id !== id)),
        }),
        {
            name: LSKEY_CONTAINERS,
        }
    )
)
