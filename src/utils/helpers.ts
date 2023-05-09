export function getRecommendedWaterIntake(age: number, weight: number) {
    // Fonte: https://www.andf.com.br/noticias/agua-descubra-o-que-ela-tem-de-tao-especial-e-porque-e-fundamental-preserva-la
    if (age <= 17) return weight * 40
    if (age <= 55) return weight * 35
    if (age <= 65) return weight * 30
    return weight * 25
}

export function clamp(num: number | string, min: number, max: number) {
    if (typeof num === 'string') num = Number(num)
    return Math.min(Math.max(num, min), max)
}
