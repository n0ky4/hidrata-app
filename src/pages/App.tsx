import { useEffect } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router'
import { HistoryEntry } from '../components/HistoryEntry'
import { MainSection } from '../components/MainSection'
import { SettingsModal } from '../components/Modal/SettingsModal'
import { NavBar } from '../components/NavBar'
import { NoEntry } from '../components/NoEntry'
import { WeatherData } from '../components/WeatherData'
import { DefaultContainer, getContainer } from '../core/defaultContainers'
import { useInitHandler } from '../core/initHandler'
import { useLocale } from '../i18n/context/contextHook'
import { useStore } from '../stores/app.store'
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

    // data store
    const dateId = new Date().toISOString().split('T')[0]
    const allRecords = useData((state) => state.data?.consumption.history)
    const records = allRecords?.find((x) => x.date === dateId)?.records || []

    const addRecord = useData((state) => state.addRecord)
    const removeRecord = useData((state) => state.removeRecord)
    const hasHistory = useData((state) => state.hasHistory)
    const addHistoryEntry = useData((state) => state.addHistoryEntry)

    // app store
    const mounted = useStore((state) => state.mounted)
    const setMounted = useStore((state) => state.setMounted)

    const calculateDailyWater = useStore((state) => state.calculateDailyWater)
    const wasCalculated = useStore((state) => state.water.wasCalculated)

    const weatherData = useStore((state) => state.weatherData)
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
    // const setWeatherData = useStore((state) => state.setWeatherData)

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

    const onAdd = (type: DefaultContainer | 'custom') => {
        if (type === 'custom') {
            // setShowAddWaterModal(true)
            return
        }

        const dateId = new Date().toISOString().split('T')[0]

        if (!hasHistory(dateId)) {
            addHistoryEntry({
                consumed: 0,
                date: dateId,
                goal: recommended,
                records: [],
                weather: weatherData?.condition || 'favorable',
            })
        }

        const amount = getContainer(type)
        console.log('add', amount)

        addRecord(dateId, {
            amount,
            time: new Date().toISOString(),
        })
    }

    const onRemove = (id: string) => {
        console.log('remove', id)
        removeRecord(id)
    }

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
