import { Pencil, Trash } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { StorageType } from '../utils/storage/schema'
import { GhostButton } from './GhostButton'

interface HistoryCardProps {
    item: StorageType['records'][0]['items'][0]
    onDelete: (id: string) => void
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
    const [time, setTime] = useState('há alguns minutos')
    const title = new Date(item.createdAt).toLocaleString()

    const labels = {
        glass: "um copo d'água",
        bottle: "uma garrafa d'água",
    }

    const updateTime = () => {
        const formatted = dayjs(item.createdAt).fromNow()
        setTime(formatted)
    }

    useEffect(() => {
        updateTime()
        const interval = setInterval(() => updateTime())
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='flex items-center gap-4 w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors'>
            <div className='w-1/4 text-sm text-zinc-400'>
                <span title={title}>{time}</span>
            </div>
            <div className='w-full'>
                bebeu {item.type === 'custom' ? `${item.ml} ml de água` : labels[item.type]}
            </div>
            <div className='flex items-center gap-2'>
                <GhostButton>
                    <Pencil size={22} weight='bold' />
                </GhostButton>
                <GhostButton red={true} onClick={() => onDelete(item.id)}>
                    <Trash size={22} weight='bold' />
                </GhostButton>
            </div>
        </div>
    )
}
