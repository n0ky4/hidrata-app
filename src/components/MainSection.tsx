import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { ClassNameValue, twMerge } from 'tailwind-merge'
import { PercentButton } from './PercentButton'

interface MainSectionProps {
    drank: number
    recommended: number
    calculated: boolean
    percentage: number
    onAdd: () => void
    className?: ClassNameValue
    children?: React.ReactNode
}

export function MainSection({
    drank,
    recommended,
    calculated,
    percentage,
    onAdd,
    className,
    children,
}: MainSectionProps) {
    const remaining = recommended - drank
    const opacityTransition = twMerge('common-transition', calculated ? 'opacity-100' : 'opacity-0')

    return (
        <div className={twMerge('flex justify-center items-center flex-col gap-6', className)}>
            <h2 className='uppercase font-semibold text-lg text-neutral-100'>
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
                    <PercentButton
                        drank={drank}
                        recommended={recommended}
                        percentage={percentage}
                        onAdd={onAdd}
                    />
                </div>
            </div>
            <div className='flex items-center justify-center flex-col'>
                {children}
                <p className={twMerge('text-neutral-400 text-center', opacityTransition)}>
                    Vamos lá! Ainda faltam <b className='text-neutral-100'>{remaining} ml</b> 💧
                </p>
            </div>
        </div>
    )
}
