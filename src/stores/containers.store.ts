import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    Container,
    ContainerCreateData,
    Containers,
    ContainerUpdateData,
} from '../schemas/containers.schema'
import { LSKEY } from '../util/localStorage'
import { shortId } from '../util/nanoid'
import { containersSchema } from './../schemas/containers.schema'

interface States {
    data: Containers | null
}

interface Actions {
    init: () => void
    setContainers: (containers: Containers) => void
    containerArrayModifier: (operation: (containers: Container[]) => Container[]) => void
    //
    getContainer: (id: string) => Container | undefined
    addContainer: (container: ContainerCreateData) => string
    updateContainer: (container: ContainerUpdateData) => void
    renameContainer: (id: string, name: string) => void
    removeContainer: (id: string) => void
}

type ContainersStore = States & Actions

export const useContainers = create(
    persist<ContainersStore>(
        (set, get) => ({
            data: null,
            init: () =>
                set(() => {
                    const data = containersSchema.parse({})
                    return {
                        data,
                    }
                }),

            getContainer: (id) => {
                if (!get().data) return undefined
                return get()?.data?.containers.find((c) => c.id === id)
            },

            setContainers: (containers) =>
                set((state) => ({
                    ...state,
                    containers,
                })),

            // função genérica para atualizar o `data.containers` com base em uma operação
            containerArrayModifier: (operation: (containers: Container[]) => Container[]) =>
                set((state) => {
                    if (!state.data) return state

                    return {
                        data: {
                            ...state.data,
                            containers: operation(state.data.containers),
                        },
                    }
                }),

            addContainer: (container) => {
                const id = shortId()
                get().containerArrayModifier((containers) => [...containers, { id, ...container }])
                return id
            },

            updateContainer: (container) =>
                get().containerArrayModifier((containers) =>
                    containers.map((c) => (c.id === container.id ? { ...c, ...container } : c))
                ),

            renameContainer: (id, name) =>
                get().containerArrayModifier((containers) =>
                    containers.map((c) => (c.id === id ? { ...c, name } : c))
                ),

            removeContainer: (id) =>
                get().containerArrayModifier((containers) => containers.filter((c) => c.id !== id)),
        }),
        {
            name: LSKEY.CONTAINERS,
            version: 1,
        }
    )
)
