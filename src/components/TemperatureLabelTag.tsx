import { twMerge } from 'tailwind-merge'
import { climate, TemperatureLabels } from '../core/climate'

interface TemperatureLabelTagProps {
    temperature: number
}

interface LabelData {
    color: string
    label: string
}

const labelData: Record<TemperatureLabels, LabelData> = {
    SUPER_COLD: {
        label: 'Muito Frio',
        color: 'bg-blue-700 text-blue-50',
    },
    COLD: {
        label: 'Frio',
        color: 'bg-blue-400 text-blue-50',
    },
    NORMAL: {
        label: 'Normal',
        color: 'bg-neutral-800',
    },
    HOT: {
        label: 'Quente',
        color: 'bg-orange-500 text-white-50',
    },
    SUPER_HOT: {
        label: 'Muito Quente',
        color: 'bg-red-500 text-red-50',
    },
}

export function TemperatureLabelTag({ temperature }: TemperatureLabelTagProps) {
    const label = climate.getLabel(temperature)
    const data = labelData[label]

    return (
        <span
            className={twMerge(
                'text-xs py-0.5 px-1.5 rounded font-semibold select-none mr-1.5',
                data.color
            )}
        >
            {data.label}
        </span>
    )
}
