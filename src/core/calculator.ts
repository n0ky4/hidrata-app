import { log } from '../util/logger'
import { Coords } from './location'
import { Condition, TemperatureData, weather } from './weather'

export const RECOMMENDED_LIMIT = 7_000

interface WeightAgeOptions {
    weight: number
    age: number
}

interface CalculatorOptions extends WeightAgeOptions {
    weather?: {
        use?: boolean
        latitude?: number
        longitude?: number
    }
}

function calc({ age, weight }: WeightAgeOptions, weatherCoeficient: number = 0) {
    // | Idade        | Constante Base (CB) |
    // | ------------ | ------------------- |
    // | ≤ 17 anos    | 40 mL/kg            |
    // | 18 a 55 anos | 35 mL/kg            |
    // | 55 a 65 anos | 30 mL/kg            |
    // | ≥ 66 anos    | 25 mL/kg            |

    let base = 0

    if (age <= 17) base = 40
    else if (age <= 55) base = 35
    else if (age <= 65) base = 30
    else base = 25

    const calculated = (base + weatherCoeficient) * weight

    return Math.min(calculated, RECOMMENDED_LIMIT)
}

function recommendedWater(options: CalculatorOptions): number {
    const { weight, age } = options
    return calc({ weight, age })
}

export interface WeatherRecommendedWaterResponse {
    water: number
    condition: Condition
    temperatureData: TemperatureData
}

async function recommendedWaterWeather(
    options: CalculatorOptions
): Promise<WeatherRecommendedWaterResponse> {
    const { weight, age } = options

    if (
        !options.weather ||
        !options.weather.use ||
        !options.weather.latitude ||
        !options.weather.longitude
    ) {
        console.error(options)
        throw new Error('Invalid weather options')
    }

    const { latitude, longitude } = options.weather

    let data

    const coords: Coords = { latitude, longitude }
    const storedData = weather.getStoredData(coords)

    if (storedData) {
        log.info('using stored temperature data')
        data = storedData.data
    } else {
        log.info('fetching temperature data')
        data = await weather.getTemperature(coords)
        weather.storeData(data, coords)
    }

    const condition = weather.getCondition(data)
    const coeficient = condition === weather.conditions.favorable ? 0 : 10

    return {
        water: calc({ weight, age }, coeficient),
        condition,
        temperatureData: data,
    }
}

export const calculator = {
    recommendedWater,
    recommendedWaterWeather,
}
