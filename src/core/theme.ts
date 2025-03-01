const themes = ['light', 'dark', 'system', 'auto'] as const
export type Theme = keyof typeof themes

const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

export const theme = {
    themes,
    hexRegex,
}
