import { useCallback, useEffect, useMemo, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router'
import { HistoryEntry } from '../components/HistoryEntry'
import { MainSection } from '../components/MainSection'
import { NavBar } from '../components/NavBar'
import { NoEntry } from '../components/NoEntry'
import { TemperatureLabelTag } from '../components/TemperatureLabelTag'
import { calculator, ClimateRecommendedWaterResponse } from '../core/calculator'
import { useInitHandler } from '../core/initHandler'
import { useConfig } from '../stores/config.store'
import { log } from '../util/logger'

function App() {
    const navigate = useNavigate()

    const [mounted, setMounted] = useState(false)
    const [dailyWaterCalculated, setDailyWaterCalculated] = useState(false)
    const { setupData } = useInitHandler()

    const age = useConfig((state) => state.config?.age) as number
    const weight = useConfig((state) => state.config?.weight) as number

    const [climateData, setClimateData] = useState<ClimateRecommendedWaterResponse | null>(null)
    const useClimate = useConfig((state) => state.config?.climate.enabled) as boolean
    const latitude = useConfig((state) => state.config?.climate.latitude) as number
    const longitude = useConfig((state) => state.config?.climate.longitude) as number

    const [recommended, setRecommended] = useState(0)
    const [drank, setDrank] = useState(0)

    const percentage = useMemo(() => {
        if (!drank || !recommended) return 0
        const percentage = (drank / recommended) * 100
        return Math.max(0, percentage)
    }, [drank, recommended])

    const setupDailyWater = useCallback(() => {
        return new Promise<void>((resolve) => {
            log.info('setting up daily water')

            if (useClimate) {
                log.info('using climate check')

                calculator
                    .recommendedWaterClimate({
                        age,
                        weight,
                        climate: {
                            use: true,
                            latitude,
                            longitude,
                        },
                    })
                    .then((res) => {
                        log.info('recommended water calculated', res)

                        setClimateData(res)
                        setRecommended(res.water)
                        resolve()
                    })
            } else {
                log.info('using default calculation')

                log.info({ age, weight })

                const value = calculator.recommendedWater({ age, weight })
                log.info('recommended water calculated', value)

                setRecommended(value)
                resolve()
            }
        })
    }, [age, useClimate, weight, latitude, longitude])

    useEffect(() => {
        const firstUse = setupData()
        log.info('first use', firstUse)

        if (firstUse) {
            navigate('/setup')
            return
        } else {
            setupDailyWater().then(() => setDailyWaterCalculated(true))
        }
        setMounted(true)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!mounted) return null

    const entries = []

    return (
        <div className='px-4 py-6 max-w-4xl mx-auto'>
            <NavBar />
            <main className='py-8 flex flex-col gap-8'>
                <MainSection
                    calculated={dailyWaterCalculated}
                    drank={drank}
                    percentage={percentage}
                    recommended={recommended}
                    onAdd={() => console.log('add')}
                >
                    {climateData && (
                        <div className='text-center w-fit flex items-center gap-4 mb-1 text-sm text-neutral-400 cursor-default'>
                            <p>
                                <TemperatureLabelTag
                                    temperature={climateData.temperatureData.apparentTemperature}
                                />
                                {climateData.condition === 'favorable' ? (
                                    <b>Clima favorável</b>
                                ) : (
                                    <b>Clima desfavorável</b>
                                )}
                            </p>
                            <p title='Sensação térmica'>
                                {climateData.temperatureData.apparentTemperature}°C
                            </p>
                            <p title='Umidade relativa'>{climateData.temperatureData.humidity}%</p>
                        </div>
                    )}
                </MainSection>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-lg font-semibold text-neutral-300 text-center'>
                        Histórico
                    </h3>
                    {entries.length > 0 ? (
                        <div className='flex flex-col gap-4'>
                            {entries.map((entry, index) => (
                                <HistoryEntry
                                    key={index}
                                    entry={entry}
                                    onEdit={() => console.log('edit')}
                                    onDelete={() => console.log('delete')}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoEntry message="Não há nenhum registro de hoje... Que tal começar tomando um copo d'água?" />
                    )}
                </div>
            </main>
        </div>
    )
}

export default App
