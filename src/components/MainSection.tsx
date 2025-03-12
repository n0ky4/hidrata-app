import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { ClassNameValue, twMerge } from 'tailwind-merge'
import { DefaultContainer } from '../core/defaultContainers'
import { units } from '../core/units'
import { useLocale } from '../i18n/context/contextHook'
import { useConfig } from '../stores/config.store'
import { PercentButton } from './PercentButton'

interface MainSectionProps {
    drank: number
    recommended: number
    calculated: boolean
    percentage: number
    onAdd: (type: DefaultContainer | 'custom') => void
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
    const { t } = useLocale()

    const unit = useConfig((state) => state.config?.units.volume) || 'ml'

    const remaining = recommended - drank
    const remainingLabel = units.convertVolume(remaining, {
        from: 'ml',
        to: unit,
        symbol: true,
        decimals: 0,
    })

    const opacityTransition = twMerge('common-transition', calculated ? 'opacity-100' : 'opacity-0')

    const remainingComponent = <b className='text-neutral-100'>{remainingLabel}</b>

    return (
        <div className={twMerge('flex justify-center items-center flex-col gap-6', className)}>
            <h2 className='uppercase font-semibold text-lg text-neutral-100'>
                {t('generic.dailyWaterIntake')}
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

                {remaining > 0 ? (
                    <p className={twMerge('text-neutral-400 text-center', opacityTransition)}>
                        {t('generic.remainingMessage', [remainingComponent])} 💧
                    </p>
                ) : (
                    <p className={twMerge('text-neutral-400 text-center', opacityTransition)}>
                        {t('generic.congratulations')} 🎉
                    </p>
                )}
            </div>
        </div>
    )
}
