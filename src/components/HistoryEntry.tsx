import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { units } from '../core/units'
import { useLocale } from '../i18n/context/contextHook'
import { Record } from '../schemas/data.schema'
import { useContainers } from '../stores/containers.store'
import { Button } from './Button'

interface HistoryEntryProps {
    entry: Record
    onEdit: () => void
    onRemove: () => void
}

export function HistoryEntry({ entry, onRemove }: HistoryEntryProps) {
    const { t } = useLocale()

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

    const getText = useCallback(
        (diff: number) => {
            const minutes = Math.floor(diff / 60000)

            if (minutes === 0) return t('generic.justNow') as string

            if (minutes < 60) {
                if (minutes === 1) return t('generic.minuteAgo', [minutes]) as string
                else return t('generic.minutesAgo', [minutes]) as string
            }

            const hours = Math.floor(minutes / 60)
            if (hours === 1) return t('generic.hourAgo', [hours]) as string
            else return t('generic.hoursAgo', [hours]) as string
        },
        [t]
    )

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
    }, [entry.time, getText])

    return (
        <div
            className={twMerge(
                'flex items-center justify-between gap-4 p-1.5 rounded-xl group',
                'bg-white/[1%] hover:bg-white/[3%]',
                'common-transition'
            )}
        >
            <div className='flex items-center'>
                <span className='text-neutral-400 min-w-36'>{time}</span>
                {container?.name ? (
                    <span title={convertedVolume}>{t('generic.drankFrom', [container.name])}</span>
                ) : (
                    <span>{t('generic.drank', [convertedVolume])}</span>
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
