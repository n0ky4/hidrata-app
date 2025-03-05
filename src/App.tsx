import { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { FirstUseScreen } from './components/FirstUseScreen'
import { HistoryEntry } from './components/HistoryEntry'
import { NavBar } from './components/NavBar'
import { NoEntry } from './components/NoEntry'
import { useInitHandler } from './core/initHandler'

function App() {
    const [mounted, setMounted] = useState(false)
    const [firstRun, setFirstRun] = useState(false)
    const { check } = useInitHandler(setFirstRun)

    const [percentage, setPercentage] = useState(50)

    useEffect(() => {
        check()
        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!mounted) return null
    if (firstRun) return <FirstUseScreen show={firstRun} onClose={() => setFirstRun(false)} />

    // const entries = [
    //     {
    //         minutes: 8,
    //         type: "copo d'água",
    //     },
    // ]

    const entries = []

    return (
        <div className='px-4 py-6 max-w-4xl mx-auto'>
            <NavBar />
            <main className='py-8 flex flex-col gap-8'>
                <div className='flex justify-center items-center flex-col gap-6'>
                    <h2 className='uppercase font-semibold text-lg text-neutral-300'>
                        Consumo Diário de Água
                    </h2>
                    <div className='relative'>
                        <CircularProgressbar
                            value={percentage}
                            strokeWidth={4}
                            styles={buildStyles({
                                strokeLinecap: 'round',
                                pathColor: 'var(--color-blue-500)',
                                trailColor: 'var(--color-neutral-900)',
                            })}
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <button className='common-transition select-none hover:bg-white/5 p-8 rounded-3xl group'>
                                <div className='leading-none'>
                                    <h3 className='text-6xl font-bold leading-none'>
                                        {Math.floor(percentage)}%
                                    </h3>
                                    <span className='text-sm leading-none font-medium text-neutral-700 group-hover:text-neutral-300 common-transition'>
                                        1234 / 4500 ml
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <p className='text-neutral-400 text-center'>
                        Vamos lá! Ainda faltam <b className='text-neutral-100'>2745 ml</b> 💧
                    </p>
                </div>
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
