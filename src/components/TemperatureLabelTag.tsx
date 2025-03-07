import { twMerge } from 'tailwind-merge'
import { weather } from '../core/weather'
import { useLocale } from '../i18n/context/contextHook'

interface TemperatureLabelTagProps {
    temperature: number
}

const labelData = {
    VERY_COLD: twMerge('bg-blue-700 text-blue-50'),
    COLD: twMerge('bg-blue-400 text-blue-50'),
    MILD: twMerge('bg-neutral-800 text-neutral-50'),
    HOT: twMerge('bg-orange-500 text-white'),
    VERY_HOT: twMerge('bg-red-500 text-red-50'),
}

export function TemperatureLabelTag({ temperature }: TemperatureLabelTagProps) {
    const { t } = useLocale()
    const labelKey = weather.getLabel(temperature)
    const style = labelData[labelKey]
    const label = t(`weather.labels.${labelKey}`)

    return (
        <span
            className={twMerge(
                'text-xs py-0.5 px-1.5 rounded font-semibold select-none mr-1.5',
                style
            )}
        >
            {label}
        </span>
    )
}
