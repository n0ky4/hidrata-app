import { DialogTitle } from '@headlessui/react'
import { PropsWithChildren } from 'react'
import { AvailableVolumes, AvailableWeights } from '../../../core/units'

interface SecondStageData {
    weight: AvailableWeights
    volume: AvailableVolumes
}

export interface StageProps {
    nextStage: () => void
    onSecondStageEnd: (data: SecondStageData) => void
}

export function StageTitle({ children }: PropsWithChildren) {
    return <DialogTitle className='font-bold text-2xl'>{children}</DialogTitle>
}

export function StageContent({ children }: PropsWithChildren) {
    return <div className='flex flex-col gap-4 text-neutral-300'>{children}</div>
}

export function StageActions({ children }: PropsWithChildren) {
    return <div className='flex gap-4 items-center justify-end mt-12'>{children}</div>
}
