import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Stage1 } from './stages/Stage1'
import { Stage2 } from './stages/Stage2'

interface FirstUseProps {
    show: boolean
    onClose: () => void
}

const stages = [Stage1, Stage2]

export function FirstUseScreen({ show, onClose }: FirstUseProps) {
    const [stageIndex, setStage] = useState(0)
    const progress = Math.floor((stageIndex / stages.length) * 100)

    const Stage =
        stages[stageIndex] ||
        (() => (
            <div>
                <p>Erro: estágio não encontrado.</p>
            </div>
        ))

    const nextStage = () => {
        setStage((prev) => {
            const next = prev + 1
            if (next >= stages.length) {
                onClose()
            }

            return next
        })
    }

    return (
        <Dialog open={show} onClose={() => {}} className='relative z-50'>
            <div className='fixed flex w-screen items-center justify-center p-4 lg:pt-20 pt-10'>
                <DialogPanel className='relative overflow-hidden max-w-xl flex flex-col gap-4 border border-neutral-800 bg-neutral-900 p-12 rounded-xl'>
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
                        onSecondStageEnd={(data) => {
                            console.log(data)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}
