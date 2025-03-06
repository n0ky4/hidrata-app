import { produce } from 'immer'
import { create } from 'zustand'
import { calculator, ClimateRecommendedWaterResponse } from '../core/calculator'
import { log } from '../util/logger'

interface State {
    // state
    climateData: ClimateRecommendedWaterResponse | null
    mounted: boolean
    water: {
        wasCalculated: boolean
        recommended: number
        drank: number
    }
    // computed
    percentage: number
}

interface CalculateDailyWaterOptions {
    age: number
    weight: number
    climate: {
        enabled: boolean
        latitude: number
        longitude: number
    }
}

interface Actions {
    setMounted: (mounted: boolean) => void
    setClimateData: (data: ClimateRecommendedWaterResponse | null) => void
    setRecommendedWater: (value: number) => void
    setDrankWater: (value: number) => void
    calculateDailyWater: (options: CalculateDailyWaterOptions) => Promise<number>
    reset: () => void
}

type Store = State & Actions

export const useStore = create<Store>((set, get) => ({
    climateData: null,
    mounted: false,
    water: {
        wasCalculated: false,
        recommended: 0,
        drank: 0,
    },

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

    setClimateData: (data) => set({ climateData: data }),

    calculateDailyWater: async (options) => {
        const { age, weight, climate } = options

        log.info('setting up daily water')
        try {
            if (climate.enabled) {
                log.info('using climate check')

                const { latitude, longitude } = climate

                const res = await calculator.recommendedWaterClimate({
                    age,
                    weight,
                    climate: {
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
                        draft.climateData = res
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
