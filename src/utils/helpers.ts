import { ItemsType } from './storage/schema'

// Pegar a quantidade recomendada de água baseado na idade e peso
// Fonte: Agência de Nutrição do Distrito Federal (ANDF) [https://bit.ly/3MChWPU]
export function getRecommendedWaterIntake(age: number, weight: number) {
    if (age <= 17) return weight * 40
    if (age <= 55) return weight * 35
    if (age <= 65) return weight * 30
    return weight * 25
}

// Função para limitar um número entre um mínimo e um máximo
export function clamp(num: number | string, min: number, max: number) {
    if (typeof num === 'string') num = Number(num)
    return Math.min(Math.max(num, min), max)
}

// Pegar a quantidade de água baseada no tipo, em ml
export function getWaterMLFromType(type: ItemsType) {
    switch (type) {
        case 'glass': // Copo
            return 250
        case 'bottle': // Garrafa
            return 500
        default:
            return 0
    }
}

// Função para tornar a primeira letra de todas as palavras em maiúscula
export function capitalize(str: string) {
    return str.replace(/\b\w/g, function (letter) {
        return letter.toUpperCase()
    })
}

// Função para truncar uma string (aaaaaaa => aaa...)
export function truncate(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + '...' : str
}
