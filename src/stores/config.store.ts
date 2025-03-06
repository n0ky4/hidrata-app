import deepmerge from 'deepmerge'
import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Config, ConfigInitOptions, configSchema } from '../schemas/config.schema'
import { LSKEY } from '../util/localStorageKeys'

interface State {
    config: Config | null
}

interface Actions {
    init: (initOptions: ConfigInitOptions) => void
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

type ConfigStore = State & Actions

export const useConfig = create(
    persist<ConfigStore>(
        (set, get) => ({
            config: null,
            init: (initOptions: ConfigInitOptions) =>
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
                set(
                    produce((state: State) => {
                        if (!state.config) return state

                        const keys = path.split('.')
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let current: any = state.config

                        for (let i = 0; i < keys.length - 1; i++) {
                            current = current[keys[i]]
                        }

                        current[keys[keys.length - 1]] = value
                    })
                ),

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
            name: LSKEY.CONFIG,
            version: 1,
            // will use localStorage as default
        }
    )
)
