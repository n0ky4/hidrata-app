import { LSKEY } from '../util/localStorage'
import { log } from '../util/logger'
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
export type Condition = (typeof conditions)[keyof typeof conditions]

export type TemperatureLabel = 'VERY_COLD' | 'COLD' | 'MILD' | 'WARM' | 'HOT' | 'VERY_HOT'
function getLabel(temperature: number): TemperatureLabel {
    const roundedTemperature = Math.round(temperature)
    if (roundedTemperature <= 0) return 'VERY_COLD' // ... 0
    if (roundedTemperature <= 5) return 'COLD' // 1 - 5
    if (roundedTemperature <= 15) return 'MILD' // 6 - 15
    if (roundedTemperature <= 25) return 'WARM' // 16 - 25
    if (roundedTemperature <= 32) return 'HOT' // 26 - 32
    return 'VERY_HOT' // 33 ...
}

export interface TemperatureData {
    apparentTemperature: number
    temperature: number
    humidity: number
}

async function getTemperature({ latitude, longitude }: Coords): Promise<TemperatureData> {
    const params: Record<string, string> = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
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

function getCondition(data: TemperatureData): Condition {
    const label = getLabel(data.apparentTemperature)

    if (label === 'VERY_COLD' || label === 'HOT' || label === 'VERY_HOT')
        return conditions.unfavorable

    if (data.humidity <= 30) return conditions.unfavorable

    return conditions.favorable
}

interface StoredResponse {
    id: string
    timestamp: Date
    data: TemperatureData
}

function generateId({ latitude, longitude }: Coords): string {
    return btoa(`${latitude},${longitude}`)
}

function getStoredData(coords: Coords): StoredResponse | null {
    const data = localStorage.getItem(LSKEY.TEMPERATURE)
    if (!data) return null

    log.info('getting stored weather data')

    try {
        const parsed = JSON.parse(data)
        if (!parsed || !parsed.data || !parsed.id || !parsed.timestamp) {
            log.warn('invalid stored weather data')
            return null
        }

        const timestamp = new Date(parsed.timestamp)
        const now = new Date()

        const diff = now.getTime() - timestamp.getTime()
        if (diff > 1000 * 60 * 60) {
            log.warn('stored weather data expired')
            localStorage.removeItem(LSKEY.TEMPERATURE)
            return null // 1 hour
        }

        const coordsId = generateId(coords)
        if (parsed.id !== coordsId) {
            log.warn('stored weather data does not match current location')
            localStorage.removeItem(LSKEY.TEMPERATURE)
            return null
        }

        log.info('stored weather data found', parsed)
        return parsed as StoredResponse
    } catch {
        return null
    }
}

function storeData(data: TemperatureData, coords: Coords) {
    const id = generateId(coords)

    const response: StoredResponse = {
        id,
        timestamp: new Date(),
        data,
    }

    localStorage.setItem(LSKEY.TEMPERATURE, JSON.stringify(response))
}

export const weather = {
    conditions,
    getLabel,
    getTemperature,
    getCondition,
    getStoredData,
    storeData,
    generateId,
}
