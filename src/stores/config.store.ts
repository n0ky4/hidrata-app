import deepmerge from 'deepmerge'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Config, configSchema, InitOptions } from '../schemas/config.schema'

const LSKEY_CONFIG = 'config'

type State = {
    config: Config | null
}

type Actions = {
    init: (initOptions: InitOptions) => void
    setConfig: (newConfig: Config) => void
    setter: <T>(key: string, value: T) => void
    updateConfig: (newConfig: Partial<Config>) => void
    setNotificationsEnabled: (enabled: Config['notifications']['enabled']) => void
    setNotificationsInterval: (interval: Config['notifications']['interval']) => void
    setNotificationsSound: (sound: Config['notifications']['sound']) => void
    setUnitsWeight: (weight: Config['units']['weight']) => void
    setUnitsVolume: (volume: Config['units']['volume']) => void
    setThemeMode: (mode: Config['theme']['mode']) => void
    setThemeAccentColor: (color: Config['theme']['accentColor']) => void
    setThemeFont: (font: Config['theme']['font']) => void
    setAge: (age: Config['age']) => void
    setWeight: (weight: Config['weight']) => void
    setClimateEnabled: (enabled: Config['climate']['enabled']) => void
    setClimateLatitude: (latitude: Config['climate']['latitude']) => void
    setClimateLongitude: (longitude: Config['climate']['longitude']) => void
}

export const useConfig = create(
    persist<State & Actions>(
        (set, get) => ({
            config: null,
            init: (initOptions: InitOptions) =>
                set(() => {
                    const parse = configSchema.parse(initOptions)
                    return {
                        config: parse,
                    }
                }),
            setConfig: (newConfig: Config) =>
                set({
                    config: newConfig,
                }),
            updateConfig: (newConfig: Partial<Config>) =>
                set((state) => {
                    if (!state.config) return state

                    const merged = deepmerge(state.config, newConfig)
                    const updatedConfig = configSchema.parse(merged)

                    return {
                        config: updatedConfig,
                    }
                }),

            // global nested setter
            setter: <T>(path: string, value: T) =>
                set((state) => {
                    if (!state.config) return state

                    const keys = path.split('.')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const nestedObj: any = {}
                    let currentObj = nestedObj

                    // criar objeto aninhado: { a: { b: { c: value } } }
                    for (let i = 0; i < keys.length - 1; i++) {
                        currentObj[keys[i]] = {}
                        currentObj = currentObj[keys[i]]
                    }

                    // setar o valor final
                    currentObj[keys[keys.length - 1]] = value

                    const merged = deepmerge(state.config, nestedObj)
                    const updatedConfig = configSchema.parse(merged)

                    return {
                        config: updatedConfig,
                    }
                }),

            // individual setters
            setNotificationsEnabled: (enabled: Config['notifications']['enabled']) =>
                get().setter('notifications.enabled', enabled),

            setNotificationsInterval: (interval: Config['notifications']['interval']) =>
                get().setter('notifications.interval', interval),

            setNotificationsSound: (sound: Config['notifications']['sound']) =>
                get().setter('notifications.sound', sound),

            setUnitsWeight: (weight: Config['units']['weight']) =>
                get().setter('units.weight', weight),

            setUnitsVolume: (volume: Config['units']['volume']) =>
                get().setter('units.volume', volume),

            setThemeMode: (mode: Config['theme']['mode']) => get().setter('theme.mode', mode),

            setThemeAccentColor: (color: Config['theme']['accentColor']) =>
                get().setter('theme.accentColor', color),

            setThemeFont: (font: Config['theme']['font']) => get().setter('theme.font', font),

            setAge: (age: Config['age']) => get().setter('age', age),

            setWeight: (weight: Config['weight']) => get().setter('weight', weight),

            setClimateEnabled: (enabled: Config['climate']['enabled']) =>
                get().setter('climate.enabled', enabled),

            setClimateLatitude: (latitude: Config['climate']['latitude']) =>
                get().setter('climate.latitude', latitude),

            setClimateLongitude: (longitude: Config['climate']['longitude']) =>
                get().setter('climate.longitude', longitude),
        }),
        {
            name: LSKEY_CONFIG,
            // will use localStorage as default
        }
    )
)
