import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { units } from '../core/units'
import { Record } from '../schemas/data.schema'
import { useContainers } from '../stores/containers.store'
import { Button } from './Button'

interface HistoryEntryProps {
    entry: Record
    onEdit: () => void
    onRemove: () => void
}

export function HistoryEntry({ entry, onEdit, onRemove }: HistoryEntryProps) {
    const [time, setTime] = useState('')

    const volumeUnit = units.useConfigVolume()
    const getContainer = useContainers((state) => state.getContainer)

    const container = entry.containerId ? getContainer(entry.containerId) : null

    const convertedVolume = units.convertVolume(entry.volume, {
        from: 'ml',
        to: volumeUnit,
        decimals: 0,
        symbol: true,
    })

    const getText = (diff: number) => {
        const minutes = Math.floor(diff / 60000)
        let text = ''

        if (minutes === 0) return 'agora'

        if (minutes < 60) text = `${minutes} minutos`
        else {
            const hours = Math.floor(minutes / 60)
            text = `${hours} horas`
        }

        return `há ${text}`
    }

    useEffect(() => {
        const calcDiff = () => {
            const now = new Date()
            const diff = now.getTime() - new Date(entry.time).getTime()
            return diff
        }

        const task = () => {
            const diff = calcDiff()
            setTime(getText(diff))
        }

        const interval = setInterval(task, 60000) // 1 minute
        task()

        return () => clearInterval(interval)
    }, [entry.time])

    return (
        <div
            className={twMerge(
                'flex items-center justify-between gap-4 p-1.5 rounded-xl group',
                'bg-white/[1%] hover:bg-white/[3%]',
                'common-transition'
            )}
        >
            <div className='flex items-center'>
                <span className='text-neutral-400 min-w-32'>{time}</span>
                {container?.name ? (
                    <span title={convertedVolume}>bebeu no(a) {container.name}</span>
                ) : (
                    <span>bebeu {convertedVolume}</span>
                )}
            </div>
            <div className='flex items-center gap-2'>
                {/* <Button theme='ghost' square onClick={onEdit}>
                    <Pencil size={20} strokeWidth={2} />
                </Button> */}
                <Button theme='ghost' square onClick={onRemove}>
                    <Trash2 size={20} strokeWidth={2} />
                </Button>
            </div>
        </div>
    )
}
