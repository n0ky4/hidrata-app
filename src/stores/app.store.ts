import { produce } from 'immer'
import { create } from 'zustand'
import { calculator, WeatherRecommendedWaterResponse } from '../core/calculator'
import { log } from '../util/logger'

interface CalculateDailyWaterOptions {
    age: number
    weight: number
    weather: {
        enabled: boolean
        latitude: number
        longitude: number
    }
}

interface State {
    // state
    weatherData: WeatherRecommendedWaterResponse | null
    mounted: boolean
    showSettingsModal: boolean
    showAddWaterModal: boolean
    water: {
        wasCalculated: boolean
        recommended: number
        drank: number
    }
    // computed
    percentage: number
}

interface Actions {
    setMounted: (mounted: boolean) => void
    setWeatherData: (data: WeatherRecommendedWaterResponse | null) => void
    setRecommendedWater: (value: number) => void
    setDrankWater: (value: number) => void
    calculateDailyWater: (options: CalculateDailyWaterOptions) => Promise<number>
    reset: () => void
    setShowSettingsModal: (value: boolean) => void
    setShowAddWaterModal: (value: boolean) => void
}

type Store = State & Actions

export const useStore = create<Store>((set, get) => ({
    weatherData: null,
    mounted: false,
    water: {
        wasCalculated: false,
        recommended: 0,
        drank: 0,
    },
    showSettingsModal: false,
    showAddWaterModal: false,

    get percentage() {
        const { water } = get()
        if (!water.drank || !water.recommended) return 0

        const percentage = (water.drank / water.recommended) * 100
        return Math.max(0, percentage)
    },

    setMounted: (mounted) => set({ mounted }),

    setDrankWater: (value) =>
        set((state) =>
            produce(state, (draft) => {
                draft.water.drank = value
            })
        ),

    setRecommendedWater: (value) =>
        set((state) =>
            produce(state, (draft) => {
                draft.water.recommended = value
            })
        ),

    setWeatherData: (data) => set({ weatherData: data }),

    setShowSettingsModal: (value: boolean) => set({ showSettingsModal: value }),

    setShowAddWaterModal: (value: boolean) => set({ showAddWaterModal: value }),

    calculateDailyWater: async (options) => {
        const { age, weight, weather } = options

        log.info('setting up daily water')
        try {
            if (weather.enabled) {
                log.info('using weather check')

                const { latitude, longitude } = weather

                const res = await calculator.recommendedWaterWeather({
                    age,
                    weight,
                    weather: {
                        use: true,
                        latitude,
                        longitude,
                    },
                })

                log.info('recommended water calculated', res)

                set((state) =>
                    produce(state, (draft) => {
                        draft.water = {
                            wasCalculated: true,
                            recommended: res.water,
                            drank: 0,
                        }
                        draft.weatherData = res
                    })
                )

                return res.water
            } else {
                log.info('using default calculation')

                log.info({ age, weight })

                const value = calculator.recommendedWater({ age, weight })
                log.info('recommended water calculated', value)

                set((state) =>
                    produce(state, (draft) => {
                        draft.water = {
                            wasCalculated: true,
                            recommended: value,
                            drank: 0,
                        }
                    })
                )

                return value
            }
        } catch (err) {
            log.error('error calculating daily water', err)
            throw err
        }
    },

    reset: () =>
        set((state) =>
            produce(state, (draft) => {
                draft.water = {
                    wasCalculated: false,
                    recommended: 0,
                    drank: 0,
                }
            })
        ),
}))
