import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { ClassNameValue, twMerge } from 'tailwind-merge'

interface MainSectionProps {
    drank: number
    recommended: number
    calculated: boolean
    percentage: number
    onAdd: () => void
    className?: ClassNameValue
}

export function MainSection({
    drank,
    recommended,
    calculated,
    percentage,
    onAdd,
    className,
}: MainSectionProps) {
    const remaining = recommended - drank
    const opacityTransition = twMerge('common-transition', calculated ? 'opacity-100' : 'opacity-0')

    return (
        <div className={twMerge('flex justify-center items-center flex-col gap-6', className)}>
            <h2 className='uppercase font-semibold text-lg text-neutral-300'>
                Consumo Diário de Água
            </h2>
            <div className={twMerge('relative', opacityTransition)}>
                <CircularProgressbar
                    value={Math.min(percentage, 100)}
                    strokeWidth={4}
                    styles={buildStyles({
                        strokeLinecap: 'round',
                        pathColor: 'var(--color-blue-500)',
                        trailColor: 'var(--color-neutral-900)',
                    })}
                />
                <div className='absolute inset-0 flex items-center justify-center'>
                    <button
                        className='common-transition select-none hover:bg-white/5 p-8 rounded-3xl group min-w-48'
                        onClick={onAdd}
                    >
                        <div className='leading-none'>
                            <h3 className='text-6xl font-bold leading-none'>
                                {percentage < 999 ? `${percentage.toFixed(0)}%` : '+999%'}
                            </h3>
                            <span className='text-sm leading-none font-medium text-neutral-700 group-hover:text-neutral-300 common-transition'>
                                {new Intl.NumberFormat().format(drank)} /{' '}
                                {new Intl.NumberFormat().format(recommended)} ml
                            </span>
                        </div>
                    </button>
                </div>
            </div>
            <p className={twMerge('text-neutral-400 text-center', opacityTransition)}>
                Vamos lá! Ainda faltam <b className='text-neutral-100'>{remaining} ml</b> 💧
            </p>
        </div>
    )
}
