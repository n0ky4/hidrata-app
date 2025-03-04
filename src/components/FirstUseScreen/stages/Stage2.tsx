// Stage 2 - Units

import { produce } from 'immer'
import { useEffect } from 'react'
import { StateType } from '..'
import { AvailableVolumes, AvailableWeights, units } from '../../../core/units'
import { useLocale } from '../../../i18n/context/contextHook'
import { Select, SelectOption } from '../../Select'
import {
    BackButton,
    NextButton,
    StageActions,
    StageContent,
    StageProps,
    StageTitle,
} from './StageModel'

export function Stage2({ nextStage, prevStage, state, setState }: StageProps) {
    const { t } = useLocale()

    const weightSelectOptions: SelectOption[] = [
        { label: `${t('units.kgP')} (kg)`, value: 'kg' },
        { label: `${t('units.lbP')} (lb)`, value: 'lb' },
    ]
    const volumeSelectOptions: SelectOption[] = [
        { label: `${t('units.mlP')} (ml)`, value: 'ml' },
        { label: `${t('units.flOzP')} (fl oz)`, value: 'fl-oz' },
    ]

    const weight = state.units.weight
    const volume = state.units.volume

    const setWeight = (value: AvailableWeights) => {
        setState((prev: StateType) =>
            produce(prev, (draft) => {
                draft.units.weight = value
            })
        )
    }

    const setVolume = (value: AvailableVolumes) => {
        setState((prev: StateType) =>
            produce(prev, (draft) => {
                draft.units.volume = value
            })
        )
    }

    const onSetWeight = (value: AvailableWeights) => {
        const find = weightSelectOptions.find((o) => o.value === value)
        if (!find) return
        setWeight(find.value as AvailableWeights)
    }

    const onSetVolume = (value: AvailableVolumes) => {
        const find = volumeSelectOptions.find((o) => o.value === value)
        if (!find) return
        setVolume(find.value as AvailableVolumes)
    }

    const beforeNext = () => {
        nextStage()
    }

    useEffect(() => {
        if (state.units.detected) return
        const preferred = units.autoDetect()

        setWeight(preferred[0])
        setVolume(preferred[1])

        setState((prev: StateType) =>
            produce(prev, (draft) => {
                draft.units.detected = true
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <StageTitle>🍶 {t('stages.stage2.title')}</StageTitle>
            <StageContent>
                <p>{t('stages.stage2.p1')}</p>

                <div className='flex flex-col gap-4 items-center'>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>
                            {t('generic.weight')}
                        </label>
                        <Select
                            options={weightSelectOptions}
                            selected={weight}
                            onSelect={(value) => onSetWeight(value as AvailableWeights)}
                            w='lg'
                        />
                    </div>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>
                            {t('generic.volume')}
                        </label>
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
                <BackButton onClick={prevStage} />
                <NextButton onClick={beforeNext} />
            </StageActions>
        </>
    )
}
