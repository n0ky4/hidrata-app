import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Record } from '../schemas/data.schema'
import { Button } from './Button'

interface HistoryEntryProps {
    entry: Record
    onEdit: () => void
    onRemove: () => void
}

export function HistoryEntry({ entry, onEdit, onRemove }: HistoryEntryProps) {
    const [time, setTime] = useState('')

    const getText = (diff: number) => {
        const minutes = Math.floor(diff / 60000)
        if (minutes === 0) return 'agora'
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        return `${hours}h`
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
            <div className='flex items-center gap-12'>
                <span className='text-neutral-400'>{time}</span>
                <span>bebeu {entry.amount}</span>
            </div>
            <div className='flex items-center gap-2'>
                <Button theme='ghost' square onClick={onEdit}>
                    <Pencil size={20} strokeWidth={2} />
                </Button>
                <Button theme='ghost' square onClick={onRemove}>
                    <Trash2 size={20} strokeWidth={2} />
                </Button>
            </div>
        </div>
    )
}
