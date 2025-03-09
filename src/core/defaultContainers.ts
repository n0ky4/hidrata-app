export const defaultContainers = {
    glass: 250,
    bottle: 500,
}

export const getContainer = (container: keyof typeof defaultContainers) =>
    defaultContainers[container]

export type DefaultContainer = keyof typeof defaultContainers
