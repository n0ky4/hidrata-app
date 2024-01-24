import { ItemsType } from './storage/schema'

// source: Agência de Nutrição do Distrito Federal (ANDF) [https://bit.ly/3MChWPU]
export function getRecommendedWaterIntake(age: number, weight: number) {
    if (age <= 17) return weight * 40
    if (age <= 55) return weight * 35
    if (age <= 65) return weight * 30
    return weight * 25
}

export function clamp(num: number | string, min: number, max: number) {
    if (typeof num === 'string') num = Number(num)
    return Math.min(Math.max(num, min), max)
}

export function getWaterMLFromType(type: ItemsType) {
    switch (type) {
        case 'glass':
            return 250
        case 'bottle':
            return 500
        default:
            return 0
    }
}

export function capitalize(str: string) {
    return str.replace(/\b\w/g, function (letter) {
        return letter.toUpperCase()
    })
}

export function truncate(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + '...' : str
}
