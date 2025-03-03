const weight = {
    kg: {
        symbol: 'kg',
        name: 'Kilogram',
        factor: 1,
    },
    lb: {
        symbol: 'lb',
        name: 'Pound',
        factor: 2.20462, // 1 kg = 2.20462 lb
    },
    st: {
        symbol: 'st',
        name: 'Stone',
        factor: 1 / 6.35029, // 1 kg = 0.157473 st
    },
} as const
const availableWeights = Object.keys(weight)
export type AvailableWeights = keyof typeof weight

const volume = {
    ml: {
        symbol: 'ml',
        name: 'Milliliter',
        factor: 1,
    },
    l: {
        // only used for display - ml is used instead
        symbol: 'l',
        name: 'Liter',
        factor: 1 / 1000, // 1000 ml = 1 l
    },
    'fl-oz': {
        symbol: 'fl oz',
        name: 'Fluid Ounce',
        factor: 1 / 29.5735, // 1 ml = 0.033814 fl oz
    },
} as const
const availableVolumes = ['ml', 'fl-oz'] as const
export type AvailableVolumes = 'ml' | 'fl-oz'

function getWeight(key: AvailableWeights) {
    return weight[key]
}

interface ConvertOptions {
    from?: AvailableWeights // if empty, assume "kg"
    to: AvailableWeights
    addSymbol?: boolean
    decimals?: number // decimal places
}
interface ConvertOptionsWithSymbol extends Omit<ConvertOptions, 'addSymbol'> {
    addSymbol: true
}
interface ConvertOptionsWithoutSymbol extends Omit<ConvertOptions, 'addSymbol'> {
    addSymbol?: false
}
function convert(value: number, options: ConvertOptionsWithSymbol): string
function convert(value: number, options: ConvertOptionsWithoutSymbol): number
function convert(value: number, options: ConvertOptions): string | number {
    const { from = 'kg', to, addSymbol = false, decimals = 2 } = options

    let converted = value

    const fromUnit = getWeight(from)
    const toUnit = getWeight(to)

    if (!fromUnit || !toUnit) return NaN

    converted = (value * toUnit.factor) / fromUnit.factor

    if (decimals > 0) {
        converted = Number(converted.toFixed(decimals))
    } else {
        converted = Math.round(converted)
    }

    return addSymbol ? `${converted} ${toUnit.symbol}` : converted
}

function autoDetect(): [AvailableWeights, AvailableVolumes] {
    let weight: AvailableWeights = 'kg'
    let volume: AvailableVolumes = 'ml'

    const lang = navigator.language

    switch (lang) {
        case 'en-US': // lb & oz
            weight = 'lb'
            volume = 'fl-oz'
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
    convert,
}
