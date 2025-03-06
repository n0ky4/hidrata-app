import { twMerge } from 'tailwind-merge'
import { climate, TemperatureLabels } from '../core/climate'

interface TemperatureLabelTagProps {
    temperature: number
}

interface LabelData {
    label: string
    style: string
}

const labelData: Record<TemperatureLabels, LabelData> = {
    SUPER_COLD: {
        label: 'Muito Frio',
        style: twMerge('bg-blue-700 text-blue-50'),
    },
    COLD: {
        label: 'Frio',
        style: twMerge('bg-blue-400 text-blue-50'),
    },
    NORMAL: {
        label: 'Normal',
        style: twMerge('bg-neutral-800 text-neutral-50'),
    },
    HOT: {
        label: 'Quente',
        style: twMerge('bg-orange-500 text-white'),
    },
    SUPER_HOT: {
        label: 'Muito Quente',
        style: twMerge('bg-red-500 text-red-50'),
    },
}

export function TemperatureLabelTag({ temperature }: TemperatureLabelTagProps) {
    const label = climate.getLabel(temperature)
    const data = labelData[label]

    return (
        <span
            className={twMerge(
                'text-xs py-0.5 px-1.5 rounded font-semibold select-none mr-1.5',
                data.style
            )}
        >
            {data.label}
        </span>
    )
}
