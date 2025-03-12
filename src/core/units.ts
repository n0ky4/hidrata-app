import { ReactNode } from 'react'
import { SelectOptionProps } from '../components/Select'
import { useConfig } from './../stores/config.store'

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

function getVolume(key: AvailableVolumes) {
    return volume[key]
}

interface ConvertWeightOptions {
    from?: AvailableWeights // if empty, assume "kg"
    to: AvailableWeights
    symbol?: boolean
    decimals?: number // decimal places
}
interface ConvertWeightOptionsWithSymbol extends Omit<ConvertWeightOptions, 'symbol'> {
    symbol: true
}
interface ConvertWeightOptionsWithoutSymbol extends Omit<ConvertWeightOptions, 'symbol'> {
    symbol?: false
}
function convertWeight(value: number, options: ConvertWeightOptionsWithSymbol): string
function convertWeight(value: number, options: ConvertWeightOptionsWithoutSymbol): number
function convertWeight(value: number, options: ConvertWeightOptions): string | number {
    const { from = 'kg', to, symbol = false, decimals = 2 } = options

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

    return symbol ? `${converted} ${toUnit.symbol}` : converted
}

interface ConvertVolumeOptions {
    from?: AvailableVolumes // if empty, assume "ml"
    to: AvailableVolumes
    symbol?: boolean
    decimals?: number // decimal places
}
interface ConvertVolumeOptionsWithSymbol extends Omit<ConvertVolumeOptions, 'symbol'> {
    symbol: true
}
interface ConvertVolumeOptionsWithoutSymbol extends Omit<ConvertVolumeOptions, 'symbol'> {
    symbol?: false
}
function convertVolume(value: number, options: ConvertVolumeOptionsWithSymbol): string
function convertVolume(value: number, options: ConvertVolumeOptionsWithoutSymbol): number
function convertVolume(value: number, options: ConvertVolumeOptions): string | number {
    const { from = 'ml', to, symbol = false, decimals = 2 } = options

    let converted = value

    const fromUnit = getVolume(from)
    const toUnit = getVolume(to)

    if (!fromUnit || !toUnit) return NaN

    converted = (value * toUnit.factor) / fromUnit.factor

    if (decimals > 0) {
        converted = Number(converted.toFixed(decimals))
    } else {
        converted = Math.round(converted)
    }

    return symbol ? `${converted} ${toUnit.symbol}` : converted
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

const getWeightSelectOptions = (t: (key: string) => string | ReactNode): SelectOptionProps[] => [
    { label: `${t('units.kgP')} (kg)`, value: 'kg' },
    { label: `${t('units.lbP')} (lb)`, value: 'lb' },
]

const getVolumeSelectOptions = (t: (key: string) => string | ReactNode): SelectOptionProps[] => [
    { label: `${t('units.mlP')} (ml)`, value: 'ml' },
    { label: `${t('units.flOzP')} (fl oz)`, value: 'fl-oz' },
]

const onSetWeight = (
    value: AvailableWeights,
    setWeight: (value: AvailableWeights) => void,
    weightSelectOptions: SelectOptionProps[]
) => {
    const find = weightSelectOptions.find((o) => o.value === value)
    if (!find) return
    setWeight(find.value as AvailableWeights)
}

const onSetVolume = (
    value: AvailableVolumes,
    setVolume: (value: AvailableVolumes) => void,
    volumeSelectOptions: SelectOptionProps[]
) => {
    const find = volumeSelectOptions.find((o) => o.value === value)
    if (!find) return
    setVolume(find.value as AvailableVolumes)
}

const useConfigVolume = () => {
    return useConfig((state) => state.config?.units.volume) || 'ml'
}

const useConfigWeight = () => {
    return useConfig((state) => state.config?.units.weight) || 'kg'
}

export const units = {
    weight,
    volume,
    availableWeights,
    availableVolumes,
    autoDetect,
    getWeight,
    getVolume,
    convertWeight,
    convertVolume,
    getWeightSelectOptions,
    getVolumeSelectOptions,
    onSetWeight,
    onSetVolume,
    useConfigVolume,
    useConfigWeight,
}
