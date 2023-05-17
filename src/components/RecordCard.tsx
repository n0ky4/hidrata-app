import { Pencil, Trash } from '@phosphor-icons/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { capitalize, getWaterMLFromType } from '../utils/helpers'
import { RecordItemType } from '../utils/storage/schema'
import Button from './Button'

interface RecordCardProps {
    item: RecordItemType[0]
    onDelete: (id: string) => void
    onEdit: (id: string) => void
}

export function RecordCard({ item, onDelete, onEdit }: RecordCardProps) {
    const [time, setTime] = useState('há poucos segundos')
    const [minTime, setMinTime] = useState('')
    const title = new Date(item.createdAt).toLocaleString()

    const labels = {
        glass: {
            prefix: 'um',
            label: 'copo',
            suffix: "d'água",
        },
        bottle: {
            prefix: 'uma',
            label: 'garrafa',
            suffix: "d'água",
        },
    }

    const updateTime = () => {
        const date = dayjs(item.createdAt)
        setTime(date.fromNow())
        // set minified time
        setMinTime(date.format('HH:mm'))
    }

    useEffect(() => {
        updateTime()
        const interval = setInterval(() => updateTime())
        return () => clearInterval(interval)
    }, [])

    const mlTitle = (item.type === 'custom' ? item.quantity : getWaterMLFromType(item.type)) + ' ml'

    return (
        <div
            className={clsx(
                'flex items-center gap-4 w-full px-4 py-2 rounded-lg',
                'bg-white/5 hover:bg-white/10 transition-colors',
                'shadow-lg/20 hover:shadow-lg/40'
            )}
        >
            <div className='w-1/4 text-sm text-zinc-400'>
                <span title={title} className='hidden sm:inline'>
                    {time}
                </span>
                <span title={title} className='inline sm:hidden'>
                    {minTime}
                </span>
            </div>
            <div className='w-full truncate'>
                <span title={mlTitle} className='hidden sm:inline'>
                    bebeu{' '}
                    {item.type === 'custom'
                        ? item.label
                            ? `no(a) ${item.label}`
                            : `${item.quantity} ml de água`
                        : `${labels[item.type].prefix} ${labels[item.type].label} ${
                              labels[item.type].suffix
                          }`}
                </span>
                <span title={mlTitle} className='inline sm:hidden'>
                    {item.type === 'custom'
                        ? item.label
                            ? item.label
                            : `${item.quantity} ml`
                        : capitalize(labels[item.type].label)}
                </span>
            </div>
            <div className='flex items-center gap-2'>
                <Button onClick={() => onEdit(item.id)} ghost>
                    <Pencil size={22} weight='bold' />
                </Button>
                <Button onClick={() => onDelete(item.id)} ghost className='hover:!bg-red-500'>
                    <Trash size={22} weight='bold' />
                </Button>
            </div>
        </div>
    )
}
