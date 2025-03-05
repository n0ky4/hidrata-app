import { Coords } from './location'

export interface WeatherData {
    latitude: number
    longitude: number
    generationtime_ms: number
    utc_offset_seconds: number
    timezone: string
    timezone_abbreviation: string
    elevation: number
    current_units: {
        time: string
        interval: string
        temperature_2m: string
        relative_humidity_2m: string
        apparent_temperature: string
    }
    current: {
        time: string
        interval: number
        temperature_2m: number
        relative_humidity_2m: number
        apparent_temperature: number
    }
}
const conditions = {
    favorable: 'favorable',
    unfavorable: 'unfavorable',
} as const

type TemperatureLabels = 'SUPER_COLD' | 'COLD' | 'NORMAL' | 'HOT' | 'SUPER_HOT'
function getLabel(temp: number): TemperatureLabels {
    if (temp <= 0) return 'SUPER_COLD'
    if (temp < 10) return 'COLD'
    if (temp < 25) return 'NORMAL'
    if (temp < 32) return 'HOT'
    return 'SUPER_HOT'
}

interface TemperatureData {
    apparentTemperature: number
    temperature: number
    humidity: number
}

async function getTemperature(coords: Coords): Promise<TemperatureData> {
    const params: Record<string, string> = {
        latitude: coords.lat.toString(),
        longitude: coords.lon.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature',
        forecast_days: '1',
    }

    const searchParams = new URLSearchParams(params).toString()
    const url = `https://api.open-meteo.com/v1/forecast?${searchParams}`

    const res = await fetch(url)
    const data = (await res.json()) as WeatherData

    return {
        apparentTemperature: data.current.apparent_temperature,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
    }
}

function getCondition(data: TemperatureData) {
    const label = getLabel(data.apparentTemperature)

    if (label === 'SUPER_COLD' || label === 'HOT' || label === 'SUPER_HOT')
        return conditions.unfavorable

    if (data.humidity <= 30) return conditions.unfavorable

    return conditions.favorable
}

export const climate = {
    conditions,
    getLabel,
    getTemperature,
    getCondition,
}
