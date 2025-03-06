import { useEffect } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router'
import { ClimateData } from '../components/ClimateData'
import { HistoryEntry } from '../components/HistoryEntry'
import { MainSection } from '../components/MainSection'
import { SettingsModal } from '../components/Modal/SettingsModal'
import { NavBar } from '../components/NavBar'
import { NoEntry } from '../components/NoEntry'
import { useInitHandler } from '../core/initHandler'
import { useStore } from '../stores/app.store'
import { useConfig } from '../stores/config.store'
import { log } from '../util/logger'

function App() {
    const navigate = useNavigate()
    const { setupData } = useInitHandler()

    // config store
    const age = useConfig((state) => state.config?.age) as number
    const weight = useConfig((state) => state.config?.weight) as number

    const isClimateEnabled = useConfig((state) => state.config?.climate.enabled) as boolean
    const latitude = useConfig((state) => state.config?.climate.latitude) as number
    const longitude = useConfig((state) => state.config?.climate.longitude) as number

    // app store
    const mounted = useStore((state) => state.mounted)
    const setMounted = useStore((state) => state.setMounted)

    const calculateDailyWater = useStore((state) => state.calculateDailyWater)
    const wasCalculated = useStore((state) => state.water.wasCalculated)

    const climateData = useStore((state) => state.climateData)
    const drank = useStore((state) => state.water.drank)
    const recommended = useStore((state) => state.water.recommended)
    const percentage = useStore((state) => state.percentage)

    // modals
    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
    const showAddWaterModal = useStore((state) => state.showAddWaterModal)
    const setShowAddWaterModal = useStore((state) => state.setShowAddWaterModal)

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
        <>
            <SettingsModal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            <div className='px-4 py-6 max-w-4xl mx-auto'>
                <NavBar onSettingsClick={() => setShowSettingsModal(true)} />
                <main className='py-8 flex flex-col gap-8'>
                    <MainSection
                        calculated={wasCalculated}
                        drank={drank}
                        percentage={percentage}
                        recommended={recommended}
                        onAdd={() => console.log('add')}
                    >
                        {climateData && <ClimateData data={climateData} />}
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
        </>
    )
}

export default App
