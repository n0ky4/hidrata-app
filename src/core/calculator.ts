import { log } from '../util/logger'
import { climate, Condition, TemperatureData } from './climate'

interface WeightAgeOptions {
    weight: number
    age: number
}

interface CalculatorOptions extends WeightAgeOptions {
    climate?: {
        use?: boolean
        latitude?: number
        longitude?: number
    }
}

function calc({ age, weight }: WeightAgeOptions, climateCoeficient: number = 0) {
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

    return (base + climateCoeficient) * weight
}

function recommendedWater(options: CalculatorOptions): number {
    const { weight, age } = options
    return calc({ weight, age })
}

interface ClimateRecommendedWaterResponse {
    water: number
    condition: Condition
    temperatureData: TemperatureData
}

async function recommendedWaterClimate(
    options: CalculatorOptions
): Promise<ClimateRecommendedWaterResponse> {
    const { weight, age } = options

    if (
        !options.climate ||
        !options.climate.use ||
        !options.climate.latitude ||
        !options.climate.longitude
    )
        throw new Error('Invalid climate options')

    const { latitude, longitude } = options.climate

    let data

    const coords = { lat: latitude, lon: longitude }
    const storedData = climate.getStoredData(coords)

    if (storedData) {
        log.info('using stored temperature data')
        data = storedData.data
    } else {
        log.info('fetching temperature data')
        data = await climate.getTemperature(coords)
        climate.storeData(data, coords)
    }

    const condition = climate.getCondition(data)
    const coeficient = condition === climate.conditions.favorable ? 0 : 10

    return {
        water: calc({ weight, age }, coeficient),
        condition,
        temperatureData: data,
    }
}

export const calculator = {
    recommendedWater,
    recommendedWaterClimate,
}
