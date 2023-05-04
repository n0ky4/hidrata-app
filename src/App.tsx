import { GearSix } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import colors from 'tailwindcss/colors'
import { Debug } from './components/Debug'
import FirstUsePopup from './components/FirstUsePopup'
import { GhostButton } from './components/GhostButton'
import { HistoryCard } from './components/HistoryCard'
import { WaterIntakeDropdown } from './components/WaterIntakeDropdown'
import { useStorage } from './utils/storage'
import { StorageType } from './utils/storage/schema'
import { getRecommendedWaterIntake } from './utils/water'

function App() {
    const storage = useStorage()
    const [data, setData] = useState<StorageType | null>(null)
    const [debug, setDebug] = useState(false)
    const [showFirstUse, setShowFirstUse] = useState(false)

    function lg(msg: any) {
        console.log('[data-handler]', msg)
    }

    // Data validation / First use detection
    const checkData = async () => {
        lg('Checando dados...')
        if (!storage) {
            lg('Não há storage, mostrando tela de primeiro uso')
            setShowFirstUse(true)
            return
        }

        lg('Retornando dados...')
        const data = await storage.getSafeData()
        if (!data) {
            lg('Não há dados, mostrando tela de primeiro uso')
            setShowFirstUse(true)
            return
        }

        lg('Há dados, mostrando tela principal e setando state...')
        setData(data as StorageType)
        setShowFirstUse(false)
    }

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            // ctrl d
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault()
                setDebug((prev) => !prev)
            }
        })
        ;(async () => {
            await checkData()
            storage.onDataChange((data) => {
                setData(data as StorageType)
            })

            const data = await storage.getSafeData()
            if (!data) return

            const hasToday = await storage.hasTodayRecord(data)
            if (!hasToday) await storage.createRecord(new Date())
        })()
    }, [])

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

    const percentage = 56

    return (
        <>
            {debug && (
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
                    <div className='mx-auto w-full max-w-[240px] select-none'>
                        <CircularProgressbarWithChildren
                            value={percentage}
                            strokeWidth={4}
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
                                    <h1 className='text-6xl font-bold text-blue-100'>
                                        {percentage}%
                                    </h1>
                                    <span className='absolute -bottom-3 left-0 text-sm font-mono text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        1512/2700ml
                                    </span>
                                </div>
                                <WaterIntakeDropdown />
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                    <p className='text-sm text-zinc-400'>
                        Vamos lá! Ainda faltam <b>1000ml</b> de água 💧
                    </p>
                </section>
                <section className='flex flex-col gap-2'>
                    <h1 className='text-xl font-bold'>Histórico</h1>
                    <div className='flex flex-col gap-2'>
                        <HistoryCard />
                    </div>
                    <a
                        href='#'
                        className='text-sm text-center text-zinc-400 hover:underline hover:text-white transition-colors'
                    >
                        ver registros anteriores
                    </a>
                </section>
            </main>
        </>
    )
}

export default App
