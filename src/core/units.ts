import { ReactNode } from 'react'
import { SelectOptionProps } from '../components/Select'
import { useConfig } from './../stores/config.store'

const weight = {
    kg: {
        symbol: 'kg',
        factor: 1,
    },
    lb: {
        symbol: 'lb',
        factor: 2.20462, // 1 kg = 2.20462 lb
    },
    st: {
        symbol: 'st',
        factor: 1 / 6.35029, // 1 kg = 0.157473 st
    },
} as const
const availableWeights = Object.keys(weight)
export type AvailableWeights = keyof typeof weight

const volume = {
    ml: {
        symbol: 'ml',
        factor: 1,
    },
    'fl-oz': {
        symbol: 'fl oz',
        factor: 1 / 29.5735, // 1 ml = 0.033814 fl oz
    },
} as const
const availableVolumes = ['ml', 'fl-oz'] as const
export type AvailableVolumes = 'ml' | 'fl-oz'

const temperature = {
    c: {
        symbol: '°C',
        name: 'Celsius',
    },
    f: {
        symbol: '°F',
        name: 'Fahrenheit',
    },
} as const
const availableTemperatures = Object.keys(temperature)
export type AvailableTemperatures = keyof typeof temperature

function getWeight(key: AvailableWeights) {
    return weight[key]
}

function getVolume(key: AvailableVolumes) {
    return volume[key]
}

function getTemperature(key: AvailableTemperatures) {
    return temperature[key]
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

function celsiusToFahrenheit(celsius: number): number {
    return celsius * (9 / 5) + 32
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

const getTemperatureSelectOptions = (
    t: (key: string) => string | ReactNode
): SelectOptionProps[] => [
    { label: `${t('units.celsius')} (°C)`, value: 'c' },
    { label: `${t('units.fahrenheit')} (°F)`, value: 'f' },
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

const onSetTemperature = (
    value: AvailableTemperatures,
    setTemperature: (value: AvailableTemperatures) => void,
    temperatureSelectOptions: SelectOptionProps[]
) => {
    const find = temperatureSelectOptions.find((o) => o.value === value)
    if (!find) return
    setTemperature(find.value as 'c' | 'f')
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
    availableTemperatures,
    autoDetect,
    getWeight,
    getVolume,
    getTemperature,
    convertWeight,
    convertVolume,
    getWeightSelectOptions,
    getVolumeSelectOptions,
    getTemperatureSelectOptions,
    celsiusToFahrenheit,
    onSetWeight,
    onSetVolume,
    onSetTemperature,
    useConfigVolume,
    useConfigWeight,
}
