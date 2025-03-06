import { useEffect } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router'
import { HistoryEntry } from '../components/HistoryEntry'
import { MainSection } from '../components/MainSection'
import { NavBar } from '../components/NavBar'
import { NoEntry } from '../components/NoEntry'
import { TemperatureLabelTag } from '../components/TemperatureLabelTag'
import { useInitHandler } from '../core/initHandler'
import { useStore } from '../stores/app.store'
import { useConfig } from '../stores/config.store'
import { log } from '../util/logger'

function App() {
    const navigate = useNavigate()
    const { setupData } = useInitHandler()

    const age = useConfig((state) => state.config?.age) as number
    const weight = useConfig((state) => state.config?.weight) as number

    const isClimateEnabled = useConfig((state) => state.config?.climate.enabled) as boolean
    const latitude = useConfig((state) => state.config?.climate.latitude) as number
    const longitude = useConfig((state) => state.config?.climate.longitude) as number

    const mounted = useStore((state) => state.mounted)
    const setMounted = useStore((state) => state.setMounted)
    const climateData = useStore((state) => state.climateData)
    const drank = useStore((state) => state.water.drank)
    const recommended = useStore((state) => state.water.recommended)
    const percentage = useStore((state) => state.percentage)
    const calculateDailyWater = useStore((state) => state.calculateDailyWater)
    const wasCalculated = useStore((state) => state.water.wasCalculated)

    // const setDrankWater = useStore((state) => state.setDrankWater)
    // const setRecommendedWater = useStore((state) => state.setRecommendedWater)
    // const setClimateData = useStore((state) => state.setClimateData)

    useEffect(() => {
        const firstUse = setupData()
        log.info('first use', firstUse)

        if (firstUse) {
            navigate('/setup')
            return
        } else {
            calculateDailyWater({
                age,
                weight,
                climate: {
                    enabled: isClimateEnabled,
                    latitude,
                    longitude,
                },
            })
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
                    calculated={wasCalculated}
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
