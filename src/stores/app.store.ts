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
    }
}

interface Actions {
    setMounted: (mounted: boolean) => void
    setWeatherData: (data: WeatherRecommendedWaterResponse | null) => void
    setRecommendedWater: (value: number) => void
    calculateDailyWater: (options: CalculateDailyWaterOptions) => Promise<number>
    setShowSettingsModal: (value: boolean) => void
    setShowAddWaterModal: (value: boolean) => void
}

type Store = State & Actions

export const useAppStore = create<Store>((set) => ({
    weatherData: null,
    mounted: false,
    waterWasCalculated: false,
    water: {
        wasCalculated: false,
        recommended: 0,
    },
    showSettingsModal: false,
    showAddWaterModal: false,

    setMounted: (mounted) => set({ mounted }),

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
}))
