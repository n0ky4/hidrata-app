import { ArrowRight } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { AvailableVolumes, AvailableWeights, units } from '../../../core/units'
import { Button } from '../../Button'
import { Select, SelectOption } from '../../Select'
import { StageActions, StageContent, StageProps, StageTitle } from './StageModel'

const weightSelectOptions: SelectOption[] = [
    { label: 'Kilogramas (kg)', value: 'kg' },
    { label: 'Libras (lb)', value: 'lb' },
]
const volumeSelectOptions: SelectOption[] = [
    { label: 'Mililitros (ml)', value: 'ml' },
    { label: 'Onças (oz)', value: 'oz' },
]

export function Stage2({ nextStage, onSecondStageEnd }: StageProps) {
    const [weight, setWeight] = useState<AvailableWeights>('kg')
    const [volume, setVolume] = useState<AvailableVolumes>('ml')

    const onSetWeight = (value: AvailableWeights) => {
        const find = weightSelectOptions.find((o) => o.value === value)
        if (find) setWeight(find.value as AvailableWeights)
    }

    const onSetVolume = (value: AvailableVolumes) => {
        const find = volumeSelectOptions.find((o) => o.value === value)
        if (find) setVolume(find.value as AvailableVolumes)
    }

    const beforeNext = () => {
        onSecondStageEnd({ weight, volume })
        nextStage()
    }

    useEffect(() => {
        const preferred = units.autoDetect()
        setWeight(preferred[0])
        setVolume(preferred[1])
    }, [])

    return (
        <>
            <StageTitle>🍶 Unidades de medida</StageTitle>
            <StageContent>
                <p>Primeiramente, quais são as unidades de medida que você prefere usar no app?</p>

                <div className='flex flex-col gap-4 items-center'>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>Peso</label>
                        <Select
                            options={weightSelectOptions}
                            selected={weight}
                            onSelect={(value) => onSetWeight(value as AvailableWeights)}
                            w='lg'
                        />
                    </div>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>Volume</label>
                        <Select
                            options={volumeSelectOptions}
                            selected={volume}
                            onSelect={(value) => onSetVolume(value as AvailableVolumes)}
                            w='lg'
                        />
                    </div>
                </div>
            </StageContent>
            <StageActions>
                <Button onClick={beforeNext}>
                    Próximo
                    <ArrowRight size={18} strokeWidth={3} />
                </Button>
            </StageActions>
        </>
    )
}
