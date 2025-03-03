const weight = {
    kg: {
        name: 'kg',
        factor: 1,
    },
    lb: {
        name: 'lb',
        factor: 2.20462, // 1 kg = 2.20462 lb
    },
    st: {
        name: 'st',
        factor: 0.157473, // 1 kg = 0.157473 st
    },
} as const
const availableWeights = Object.keys(weight)
export type AvailableWeights = 'kg' | 'lb' | 'st'

const volume = {
    ml: {
        name: 'ml',
        factor: 1,
    },
    l: {
        // only used for display - ml is used instead
        name: 'l',
        symbol: 'l',
        factor: 0.001, // 1 l = 1000 ml
    },
    oz: {
        name: 'oz',
        factor: 0.033814, // 1 ml = 0.033814 oz
    },
} as const
const availableVolumes = ['ml', 'oz'] as const
export type AvailableVolumes = 'ml' | 'oz'

function getWeight(key: string) {
    if (!availableWeights.includes(key as AvailableWeights)) return null
    return weight[key as AvailableWeights]
}

function autoDetect(): [AvailableWeights, AvailableVolumes] {
    let weight: AvailableWeights = 'kg'
    let volume: AvailableVolumes = 'ml'

    const lang = navigator.language

    switch (lang) {
        case 'en-US': // lb & oz
            weight = 'lb'
            volume = 'oz'
            break
        case 'en-GB': // st & oz
            weight = 'st'
            volume = 'ml'
            break
        default: // kg & ml
            break
    }

    return [weight, volume]
}

export const units = {
    weight,
    volume,
    availableWeights,
    availableVolumes,
    autoDetect,
    getWeight,
}
