import { GearSix } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import colors from 'tailwindcss/colors'
import { Debug } from './components/Debug'
import FirstUsePopup from './components/FirstUsePopup'
import { GhostButton } from './components/GhostButton'
import { RecordCard } from './components/RecordCard'
import { WaterIntakeDropdown } from './components/WaterIntakeDropdown'
import { clamp, getRecommendedWaterIntake } from './utils/helpers'
import log from './utils/log'
import { useStorage } from './utils/storage'
import { StorageType } from './utils/storage/schema'

function App() {
    const storage = useStorage()
    const [data, setData] = useState<StorageType | null>(null)
    const [debug, setDebug] = useState(false)
    const [showFirstUse, setShowFirstUse] = useState(false)
    const [todayRecords, setTodayRecords] = useState<StorageType['records'][0]['items']>([])
    const [percent, setPercent] = useState('0')
    const [waterIntake, setWaterIntake] = useState(0)
    const [recommendedWater, setRecommendedWater] = useState(0)

    // Data validation / First use detection
    const checkData = async () => {
        log.info('checando dados...', 'validation')
        if (!storage) {
            log.warn('não há storage, mostrando tela de primeiro uso', 'validation')
            setShowFirstUse(true)
            return
        }

        log.info('retornando dados...', 'validation')
        const data = await storage.getSafeData()
        if (!data) {
            log.warn('não há dados, mostrando tela de primeiro uso', 'validation')
            setShowFirstUse(true)
            return
        }

        log.info('há dados, mostrando tela principal e setando state...', 'validation')
        setData(data as StorageType)
        setShowFirstUse(false)
    }

    useEffect(() => {
        dayjs.extend(relativeTime)
        dayjs.locale('pt-BR')

        if (import.meta.env.DEV) {
            document.addEventListener('keydown', (e) => {
                // ctrl d
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault()
                    setDebug((prev) => !prev)
                }
            })
        }

        ;(async () => {
            await checkData()
            const data = await storage.getSafeData()
            if (!data) return

            const hasToday = await storage.hasTodayRecord(data)
            if (!hasToday) await storage.createRecord(new Date())
        })()
    }, [])

    useEffect(() => {
        log.info('checando dados...', 'data')
        if (!data) {
            log.info('dados inexistentes, retornando...', 'data')
            return
        }

        log.info('dados existentes, checando validade...', 'data')
        const isValid = storage.isDataValid(data)
        if (!isValid) {
            log.info('dados inválidos, limpando dados e recarregando página.', 'data')
            storage.clearData()
            window.location.reload()
        }

        log.info('dados válidos, atualizando percentual...', 'data')
        const { age, weight } = data.settings
        const dailyWater = getRecommendedWaterIntake(age, weight)
        log.info(`qtd. água diária: ${dailyWater}`, 'data')
        log.info('atualizando state água diária...', 'data')
        setRecommendedWater(dailyWater)
        ;(async () => {
            const waterIntake = await storage.calculateTodayWaterIntake()
            log.info(`qtd. água ingerida hoje: ${waterIntake}`, 'data')

            log.info('atualizando state água ingerida hoje...', 'data')
            setWaterIntake(waterIntake)

            log.info('pegando registros de hoje...', 'data')
            const items = await storage.getTodayRecordItems(data)
            if (!items) {
                log.info('não há registros de hoje, retornando...', 'data')
                return
            }
            log.info('há registros de hoje, atualizando state...', 'data')
            setTodayRecords(
                items.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
            )

            log.info('atualizando state porcentagem...', 'data')
            setPercent(((waterIntake / dailyWater) * 100).toFixed(0))
        })()
    }, [data])

    if (showFirstUse)
        return (
            <main>
                <FirstUsePopup storage={storage} />
            </main>
        )
    else if (!data) return null

    const { age, weight } = data.settings
    const dailyWater = getRecommendedWaterIntake(age, weight)

    const dataList = [
        ['Idade', age],
        ['Peso', weight],
        ['Qtd. Água Diária', `${dailyWater} ml`],
    ]

    const handleAddWaterIntake = async (
        type: StorageType['records'][0]['items'][0]['type'],
        ml?: number
    ) => {
        log.info(`adicionando água do tipo ${type}${ml ? ` (ml: ${ml})` : ''}`)
        await storage.addItem({
            type,
            ml,
        })
        await checkData()
    }

    const handleItemDelete = async (id: string) => {
        log.info(`deletando item ${id}`)
        await storage.deleteItem(id)
        await checkData()
    }

    return (
        <>
            {debug && import.meta.env.DEV && (
                <Debug>
                    <div className='my-5'>
                        <h1 className='font-white font-semibold text-xl'>Dados</h1>
                        <div className='my-2'>
                            {dataList.map((x) => {
                                return (
                                    <p className='text-zinc-300' key={x[0]}>
                                        <span className='text-white'>{x[0]}:</span> {x[1]}
                                    </p>
                                )
                            })}
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1 className='font-white font-semibold text-xl'>JSON</h1>
                        <pre className='text-zinc-300 font-mono text-sm'>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </Debug>
            )}
            <nav>
                <div className='max-w-screen-md mx-auto p-4 border-b-2 flex items-center justify-between border-zinc-700'>
                    <h1 className='text-2xl font-white font-semibold'>hidrata-app</h1>
                    <div className='flex items-center gap-2'>
                        <GhostButton>
                            <GearSix size={24} weight='bold' />
                        </GhostButton>
                    </div>
                </div>
            </nav>
            <main className='max-w-screen-md mx-auto px-4 py-6 flex flex-col gap-6'>
                <section className='flex flex-col gap-4 text-center'>
                    <p className='font-semibold text-lg text-zinc-200 uppercase'>
                        Consumo Diário de Água
                    </p>
                    <div className='mx-auto w-full max-w-[300px] select-none'>
                        <CircularProgressbarWithChildren
                            value={clamp(percent, 0, 100)}
                            strokeWidth={5}
                            styles={buildStyles({
                                strokeLinecap: 'round',
                                pathTransitionDuration: 0.5,
                                textColor: colors.blue[300],
                                trailColor: colors.zinc[700],
                                pathColor: colors.blue[300],
                            })}
                        >
                            <div className='flex items-center gap-2'>
                                <div className='relative group'>
                                    <h1 className='text-6xl font-bold text-blue-100'>{percent}%</h1>
                                    <span className='absolute -bottom-3 left-0 text-sm font-mono text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        {waterIntake}/{recommendedWater}ml
                                    </span>
                                </div>
                                <WaterIntakeDropdown onAdd={handleAddWaterIntake} />
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>

                    <p className='text-sm text-zinc-400'>
                        {recommendedWater - waterIntake > 0 ? (
                            <>
                                Vamos lá! Ainda faltam <b>{recommendedWater - waterIntake}ml</b> de
                                água💧
                            </>
                        ) : (
                            <>
                                Parabéns! Você ingeriu a quantidade de água recomendada de hoje 😊👏
                            </>
                        )}
                    </p>
                </section>
                <section className='flex flex-col gap-2'>
                    <h1 className='text-xl font-bold'>Histórico</h1>
                    <div className='flex flex-col gap-2'>
                        {todayRecords.length ? (
                            todayRecords.map((x) => {
                                return (
                                    <RecordCard key={x.id} item={x} onDelete={handleItemDelete} />
                                )
                            })
                        ) : (
                            <span className='text-zinc-400'>
                                Não há nenhum registro de hoje... Que tal começar tomando um copo
                                d'água? 😊💧
                            </span>
                        )}
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <a
                            href='#'
                            className='block text-sm text-zinc-400 underline hover:text-white transition-colors'
                        >
                            ver registros anteriores
                        </a>
                    </div>
                </section>
            </main>
        </>
    )
}

export default App
