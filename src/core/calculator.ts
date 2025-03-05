import { climate } from './climate'

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

async function recommendedWaterClimate(options: CalculatorOptions): Promise<number> {
    const { weight, age } = options

    if (
        !options.climate ||
        !options.climate.use ||
        !options.climate.latitude ||
        !options.climate.longitude
    )
        throw new Error('Invalid climate options')

    const { latitude, longitude } = options.climate
    const data = await climate.getTemperature({ lat: latitude, lon: longitude })

    const coeficient = climate.getCondition(data) === climate.conditions.favorable ? 0 : 10
    return calc({ weight, age }, coeficient)
}

export const calculator = {
    recommendedWater,
    recommendedWaterClimate,
}
