const weight = {
    kg: {
        name: 'kg',
        symbol: 'kg',
        factor: 1,
    },
    lb: {
        name: 'lb',
        symbol: 'lb',
        factor: 2.20462, // 1 kg = 2.20462 lb
    },
} as const
const availableWeights = Object.keys(weight)

const volume = {
    ml: {
        name: 'ml',
        symbol: 'ml',
        factor: 1,
    },
    l: {
        name: 'l',
        symbol: 'l',
        factor: 0.001, // 1 l = 1000 ml
    },
    oz: {
        name: 'oz',
        symbol: 'oz',
        factor: 0.033814, // 1 ml = 0.033814 oz
    },
} as const
const availableVolumes = ['ml', 'oz'] as const

export const units = {
    weight,
    volume,
    availableWeights,
    availableVolumes,
}
