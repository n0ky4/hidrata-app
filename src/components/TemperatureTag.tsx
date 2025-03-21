import { twMerge } from 'tailwind-merge'
import { TemperatureLabel, weather } from '../core/weather'
import { useLocale } from '../i18n/context/contextHook'

interface TemperatureTagProps {
    temperature: number
}

const labelData: Record<TemperatureLabel, string> = {
    VERY_COLD: twMerge('bg-blue-700 text-blue-50'),
    COLD: twMerge('bg-blue-400 text-blue-50'),
    MILD: twMerge('bg-neutral-800 text-neutral-50'),
    WARM: twMerge('bg-yellow-600 text-yellow-50'),
    HOT: twMerge('bg-orange-500 text-white'),
    VERY_HOT: twMerge('bg-red-500 text-red-50'),
}

export function TemperatureTag({ temperature }: TemperatureTagProps) {
    const { t } = useLocale()
    const labelKey = weather.getLabel(temperature)
    const style = labelData[labelKey]
    const label = t(`weather.labels.${labelKey}`)

    return (
        <span
            className={twMerge(
                'text-xs py-0.5 px-1.5 rounded font-medium select-none mr-1.5',
                style
            )}
        >
            {label}
        </span>
    )
}
