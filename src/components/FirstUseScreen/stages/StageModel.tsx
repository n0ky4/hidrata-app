import { DialogTitle } from '@headlessui/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { StateType } from '..'
import { useLocale } from '../../../i18n/context/contextHook'
import { Button } from '../../Button'

export interface StageProps {
    nextStage: () => void
    prevStage: () => void
    state: StateType
    setState: React.Dispatch<React.SetStateAction<StateType>>
}

export function BackButton({ onClick, ...rest }: React.HTMLProps<HTMLButtonElement>) {
    const { t } = useLocale()
    return (
        <Button onClick={onClick} theme='ghost' {...rest} type='button'>
            <ArrowLeft size={18} strokeWidth={3} />
            {t('generic.back')}
        </Button>
    )
}

export function NextButton({ onClick, ...rest }: React.HTMLProps<HTMLButtonElement>) {
    const { t } = useLocale()
    return (
        <Button onClick={onClick} {...rest} type='button'>
            {t('generic.next')}
            <ArrowRight size={18} strokeWidth={3} />
        </Button>
    )
}

export function StageTitle({ children }: PropsWithChildren) {
    return <DialogTitle className='font-bold text-2xl'>{children}</DialogTitle>
}

export function StageContent({ children }: PropsWithChildren) {
    return <div className='flex flex-col gap-4 text-neutral-300 text-justify'>{children}</div>
}

export function StageActions({ children }: PropsWithChildren) {
    return <div className='flex gap-4 items-center justify-between mt-12'>{children}</div>
}
