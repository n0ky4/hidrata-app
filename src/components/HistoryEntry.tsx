/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from './Button'

interface HistoryEntryProps {
    entry: any
    onEdit: () => void
    onDelete: () => void
}

export function HistoryEntry({ entry, onEdit, onDelete }: HistoryEntryProps) {
    return (
        <div
            className={twMerge(
                'flex items-center justify-between gap-4 p-1.5 rounded-xl group',
                'bg-white/[1%] hover:bg-white/[3%]',
                'common-transition'
            )}
        >
            <div className='flex items-center gap-12'>
                <span className='text-neutral-400'>há {entry.minutes} minutos</span>
                <span>bebeu um {entry.type}</span>
            </div>
            <div className='flex items-center gap-2'>
                <Button theme='ghost' square onClick={onEdit}>
                    <Pencil size={20} strokeWidth={2} />
                </Button>
                <Button theme='ghost' square onClick={onDelete}>
                    <Trash2 size={20} strokeWidth={2} />
                </Button>
            </div>
        </div>
    )
}
