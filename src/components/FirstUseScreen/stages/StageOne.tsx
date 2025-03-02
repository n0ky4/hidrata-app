import { DialogTitle } from '@headlessui/react'
import { StageProps } from '..'
import { Button } from '../../Button'

export function StageOne({ nextStage }: StageProps) {
    return (
        <>
            <DialogTitle className='font-bold text-2xl'>👋 Bem-vindo(a)!</DialogTitle>
            <div className='flex flex-col gap-4 text-neutral-300'>
                <p>
                    Você está a um passo de usar o <b className='text-white'>hidrata-app</b>!
                </p>
                <p>
                    Antes de começar, precisamos calcular a quantidade de água que você deve beber
                    diariamente.
                </p>
                <p>
                    Ah, e não se preocupe! Todos os dados só serão armazenados no seu dispositivo.{' '}
                    <b className='text-white font-normal'>ദ്ദി ( ᵔ ᗜ ᵔ )</b>
                </p>
            </div>
            <div className='flex gap-4 items-center justify-end mt-12'>
                <Button onClick={nextStage}>Entendi!</Button>
            </div>
        </>
    )
}
