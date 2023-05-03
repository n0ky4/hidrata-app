import { GearSix, Plus } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import colors from 'tailwindcss/colors'
import { Debug } from './components/Debug'
import FirstUsePopup from './components/FirstUsePopup'
import { GhostButton } from './components/GhostButton'
import { useStorage } from './utils/storage'
import { StorageType } from './utils/storage/schema'
import { getRecommendedWaterIntake } from './utils/water'

function App() {
    const storage = useStorage()
    const [data, setData] = useState<StorageType | null>(null)
    const [debug, setDebug] = useState(false)

    // Data validation / First use detection
    const checkData = () => {
        if (!storage) return
        storage.getData().then((retrievedData) => {
            if (retrievedData && storage.isDataValid(retrievedData))
                setData(retrievedData as StorageType)
            else storage.clearData()
        })
    }

    useEffect(() => {
        checkData()
        document.addEventListener('keydown', (e) => {
            // ctrl d
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault()
                setDebug((prev) => !prev)
            }
        })
    }, [])

    if (!data)
        return (
            <main>
                <FirstUsePopup storage={storage} onReady={checkData} />
            </main>
        )

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
            <main>
                <div className='max-w-screen-md mx-auto px-4 py-6'>
                    <div className='flex flex-col gap-4 text-center'>
                        <p className='font-semibold text-lg text-zinc-200 uppercase'>
                            Consumo Diário de Água
                        </p>
                        <div className='mx-auto w-60 h-60'>
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
                                    <h1 className='text-6xl font-bold text-blue-100'>
                                        {percentage}%
                                    </h1>
                                    <button className='p-1.5 rounded-md bg-transparent hover:bg-white/20 transition-colors'>
                                        <Plus size={18} weight='bold' />
                                    </button>
                                </div>
                            </CircularProgressbarWithChildren>
                        </div>
                        <p className='text-sm text-zinc-400'>
                            Vamos lá! Ainda faltam <b>1000ml</b> de água 💧
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default App
