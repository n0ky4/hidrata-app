import { produce } from 'immer'
import { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ConfigInitOptions } from '../../schemas/config.schema'
import { useConfig } from '../../stores/config.store'
import { Modal } from '../Modal/Modal'
import { Stage1 } from './stages/Stage1'
import { Stage2 } from './stages/Stage2'
import { Stage3 } from './stages/Stage3'
import { Stage4 } from './stages/Stage4'
import { Stage5 } from './stages/Stage5'

interface FirstUseProps {
    show: boolean
    onClose: () => void
}

const stages = [Stage1, Stage2, Stage3, Stage4, Stage5]

export interface StateType extends ConfigInitOptions {
    stage: number
    unitsDetected: boolean
}

export function FirstUseScreen({ show, onClose }: FirstUseProps) {
    const [state, setState] = useState<StateType>({
        stage: 0,
        unitsDetected: false,
        //
        weight: 0,
        age: 0,
        units: {
            weight: 'kg',
            volume: 'ml',
        },
        weather: {
            enabled: false,
            latitude: 0,
            longitude: 0,
        },
        notifications: {
            enabled: false,
            interval: 60,
            sound: 'default',
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

    const handleFinish = useCallback(() => {
        init({
            age: state.age,
            weight: state.weight,
            units: state.units,
            weather: state.weather,
            notifications: state.notifications,
        })
        onClose()
    }, [onClose, state, init])

    const nextStage = useCallback(() => {
        const next = state.stage + 1

        if (next >= stages.length) {
            handleFinish()
            return
        }

        return setState((prev) =>
            produce(prev, (draft) => {
                draft.stage = next
            })
        )
    }, [handleFinish, state.stage])

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
        <Modal show={show} onClose={() => {}} noBackdrop transition={false}>
            <div
                className={twMerge(
                    'absolute top-0 left-0 h-1 overflow-hidden',
                    'common-transition'
                )}
                style={{
                    width: `${progress}%`,
                }}
            >
                <div className='absolute top-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400' />
            </div>
            <Stage nextStage={nextStage} prevStage={prevStage} setState={setState} state={state} />
        </Modal>
    )
}
