import { ArrowRight } from 'lucide-react'
import { Button } from '../../Button'
import { StageActions, StageContent, StageProps, StageTitle } from './StageModel'

export function StageOne({ nextStage }: StageProps) {
    return (
        <>
            <StageTitle>👋 Bem-vindo(a)!</StageTitle>
            <StageContent>
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
            </StageContent>
            <StageActions>
                <Button onClick={nextStage}>
                    Entendi!
                    <ArrowRight size={20} strokeWidth={3} />
                </Button>
            </StageActions>
        </>
    )
}
