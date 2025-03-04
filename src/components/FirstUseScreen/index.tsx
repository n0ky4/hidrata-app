import { Dialog, DialogPanel } from '@headlessui/react'
import { produce } from 'immer'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { AvailableVolumes, AvailableWeights } from '../../core/units'
import { useConfig } from '../../stores/config.store'
import { Stage1 } from './stages/Stage1'
import { Stage2 } from './stages/Stage2'
import { Stage3 } from './stages/Stage3'

interface FirstUseProps {
    show: boolean
    onClose: () => void
}

export interface StateType {
    stage: number
    weight: number
    age: number
    units: {
        detected: boolean
        weight: AvailableWeights
        volume: AvailableVolumes
    }
}

const stages = [Stage1, Stage2, Stage3]

export function FirstUseScreen({ show, onClose }: FirstUseProps) {
    const [state, setState] = useState<StateType>({
        stage: 0,
        weight: 0,
        age: 0,
        units: {
            detected: false,
            weight: 'kg',
            volume: 'ml',
        },
    })

    const init = useConfig((state) => state.init)

    const progress = Math.floor((state.stage / stages.length) * 100)

    const Stage =
        stages[state.stage] ||
        (() => (
            <div>
                <p>Erro: estágio não encontrado.</p>
            </div>
        ))

    const onFinish = () => {
        init({
            age: state.age,
            weight: state.weight,
            units: {
                volume: state.units.volume,
                weight: state.units.weight,
            },
        })
    }

    const nextStage = () => {
        setState((prev) => {
            const next = prev.stage + 1
            if (next === stages.length) {
                onFinish()
                return prev
            }

            return produce(prev, (draft) => {
                draft.stage = next
            })
        })
    }

    const prevStage = () => {
        setState((prev) => {
            const next = prev.stage - 1
            if (next < 0) {
                return prev
            }

            return produce(prev, (draft) => {
                draft.stage = next
            })
        })
    }

    return (
        <Dialog open={show} onClose={() => {}} className='relative z-50'>
            <div className='fixed flex w-screen items-center justify-center p-4 lg:pt-20 pt-10'>
                <DialogPanel className='relative overflow-hidden w-full max-w-lg flex flex-col gap-4 border border-neutral-800 bg-neutral-900 p-12 rounded-xl'>
                    <div
                        className={twMerge(
                            'absolute top-0 left-0 h-1 overflow-hidden',
                            'transition-all ease-out duration-300'
                        )}
                        style={{
                            width: `${progress}%`,
                        }}
                    >
                        <div className='absolute top-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400' />
                    </div>
                    <Stage
                        nextStage={nextStage}
                        prevStage={prevStage}
                        state={state}
                        setState={setState}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}
