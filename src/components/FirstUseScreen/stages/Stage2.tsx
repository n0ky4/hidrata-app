// Stage 2 - Units

import { produce } from 'immer'
import { useEffect } from 'react'
import { StateType } from '..'
import {
    AvailableTemperatures,
    AvailableVolumes,
    AvailableWeights,
    units,
} from '../../../core/units'
import { useLocale } from '../../../i18n/context/contextHook'
import { Select } from '../../Select'
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

    const weight = state.units ? state.units.weight : ''
    const volume = state.units ? state.units.volume : ''
    const temperature = state.units ? state.units.temperature : ''

    const setWeight = (value: AvailableWeights) => {
        setState((prev: StateType) =>
            produce(prev, (draft) => {
                if (draft.units === undefined) draft.units = {}
                draft.units.weight = value
            })
        )
    }

    const setVolume = (value: AvailableVolumes) => {
        setState((prev: StateType) =>
            produce(prev, (draft) => {
                if (draft.units === undefined) draft.units = {}
                draft.units.volume = value
            })
        )
    }

    const setTemperature = (value: AvailableTemperatures) => {
        setState((prev: StateType) =>
            produce(prev, (draft) => {
                if (draft.units === undefined) draft.units = {}
                draft.units.temperature = value
            })
        )
    }

    const weightSelectOptions = units.getWeightSelectOptions(t)
    const volumeSelectOptions = units.getVolumeSelectOptions(t)
    const temperatureSelectOptions = units.getTemperatureSelectOptions(t)

    useEffect(() => {
        if (state.unitsDetected) return
        const preferred = units.autoDetect()

        setWeight(preferred[0])
        setVolume(preferred[1])

        setState((prev: StateType) =>
            produce(prev, (draft) => {
                draft.unitsDetected = true
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
                            selected={weight || 'kg'}
                            onSelect={(value) =>
                                units.onSetWeight(
                                    value as AvailableWeights,
                                    setWeight,
                                    weightSelectOptions
                                )
                            }
                            w='lg'
                        />
                    </div>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>
                            {t('generic.volume')}
                        </label>
                        <Select
                            options={volumeSelectOptions}
                            selected={volume || 'ml'}
                            onSelect={(value) =>
                                units.onSetVolume(
                                    value as AvailableVolumes,
                                    setVolume,
                                    volumeSelectOptions
                                )
                            }
                            w='lg'
                        />
                    </div>
                    <div>
                        <label className='mb-1 text-neutral-400 text-sm font-medium'>
                            {t('weather.temperature')}
                        </label>
                        <Select
                            options={temperatureSelectOptions}
                            selected={temperature || 'c'}
                            onSelect={(value) =>
                                units.onSetTemperature(
                                    value as AvailableTemperatures,
                                    setTemperature,
                                    temperatureSelectOptions
                                )
                            }
                            w='lg'
                        />
                    </div>
                </div>
            </StageContent>
            <StageActions>
                <BackButton onClick={prevStage} />
                <NextButton onClick={nextStage} />
            </StageActions>
        </>
    )
}
