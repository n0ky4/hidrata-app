import { Girl } from '../assets/Girl'

interface NoEntryProps {
    message: string
}

export function NoEntry({ message }: NoEntryProps) {
    return (
        <div className='flex flex-col gap-4 items-center justify-center py-4'>
            <Girl />
            <p className='max-w-md text-center text-neutral-600'>
                Não há nenhum registro de hoje... Que tal começar tomando um copo d'água?
            </p>
        </div>
    )
}
