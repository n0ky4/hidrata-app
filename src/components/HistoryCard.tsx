import { Pencil, Trash } from '@phosphor-icons/react'
import { GhostButton } from './GhostButton'

export function HistoryCard() {
    return (
        <div className='flex items-center gap-4 w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors'>
            <div className='w-1/4 text-sm text-zinc-400'>
                <span>há 99 minutos</span>
            </div>
            <div className='w-full'>bebeu copo d'água (200ml)</div>
            <div className='flex items-center gap-2'>
                <GhostButton>
                    <Pencil size={22} weight='bold' />
                </GhostButton>
                <GhostButton className='hover:bg-red-500'>
                    <Trash size={22} weight='bold' />
                </GhostButton>
            </div>
        </div>
    )
}
