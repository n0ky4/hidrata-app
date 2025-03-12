import { useEffect } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router'
import { HistoryEntry } from '../components/HistoryEntry'
import { MainSection } from '../components/MainSection'
import { AddWaterModal } from '../components/Modal/AddWaterModal'
import { SettingsModal } from '../components/Modal/SettingsModal'
import { NavBar } from '../components/NavBar'
import { NoEntry } from '../components/NoEntry'
import { WeatherData } from '../components/WeatherData'
import { useAppHandler } from '../core/appHandler'
import { useInitHandler } from '../core/initHandler'
import { useLocale } from '../i18n/context/contextHook'
import { useAppStore } from '../stores/app.store'
import { useConfig } from '../stores/config.store'
import { useData } from '../stores/data.store'
import { log } from '../util/logger'

function App() {
    const navigate = useNavigate()
    const { setupData } = useInitHandler()
    const { t } = useLocale()

    // config store
    const age = useConfig((state) => state.config?.age) as number
    const weight = useConfig((state) => state.config?.weight) as number

    const isWeatherEnabled = useConfig((state) => state.config?.weather.enabled) as boolean
    const latitude = useConfig((state) => state.config?.weather.latitude) as number
    const longitude = useConfig((state) => state.config?.weather.longitude) as number

    // app store
    const mounted = useAppStore((state) => state.mounted)
    const setMounted = useAppStore((state) => state.setMounted)

    const calculateDailyWater = useAppStore((state) => state.calculateDailyWater)
    const wasCalculated = useAppStore((state) => state.water.wasCalculated)

    const weatherData = useAppStore((state) => state.weatherData)
    const recommended = useAppStore((state) => state.water.recommended)

    // modals
    const showSettingsModal = useAppStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useAppStore((state) => state.setShowSettingsModal)
    const showAddWaterModal = useAppStore((state) => state.showAddWaterModal)
    const setShowAddWaterModal = useAppStore((state) => state.setShowAddWaterModal)

    // computed
    const allRecords = useData((state) => state.data?.consumption.history)
    const { getDailyConsumed, getDailyRecords, getPercentage, onAdd, onRemove } = useAppHandler()

    const records = getDailyRecords(allRecords || [])
    const drank = getDailyConsumed(records)
    const percentage = getPercentage(drank, recommended)

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
                weather: {
                    enabled: isWeatherEnabled,
                    latitude,
                    longitude,
                },
            })
        }

        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!mounted) return null

    return (
        <>
            <AddWaterModal show={showAddWaterModal} onClose={() => setShowAddWaterModal(false)} />
            <SettingsModal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

            <div className='px-4 py-6 max-w-4xl mx-auto'>
                <NavBar onSettingsClick={() => setShowSettingsModal(true)} />
                <main className='py-8 flex flex-col gap-8'>
                    <MainSection
                        calculated={wasCalculated}
                        drank={drank}
                        percentage={percentage}
                        recommended={recommended}
                        onAdd={onAdd}
                    >
                        {weatherData && <WeatherData data={weatherData} />}
                    </MainSection>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-lg font-semibold text-neutral-300 text-center'>
                            {t('generic.history')}
                        </h3>
                        {records.length > 0 ? (
                            <div className='flex flex-col gap-2'>
                                {records.map((entry, index) => (
                                    <HistoryEntry
                                        key={index}
                                        entry={entry}
                                        onEdit={() => console.log('edit')}
                                        onRemove={() => onRemove(entry.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoEntry message={t('generic.noEntryMessage') as string} />
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

export default App
