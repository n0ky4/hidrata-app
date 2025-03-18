// Stage 4 - Location

import { produce } from 'immer'
import { useCallback } from 'react'
import { location } from '../../../core/location'
import { useLocale } from '../../../i18n/context/contextHook'
import { Checkbox } from '../../Checkbox'
import { Kaomoji } from '../../Kaomoji'
import { AppTitle } from '../AppTitle'
import { LocationForm } from '../LocationForm'
import {
    BackButton,
    NextButton,
    StageActions,
    StageContent,
    StageProps,
    StageTitle,
} from './StageModel'

export function Stage4({ setState, nextStage, prevStage }: StageProps) {
    const { t, lang } = useLocale()

    const {
        enabled,
        canContinue,
        locState,
        handleLocationToggle,
        handleLocationChange,
        fetchCustomCoords,
    } = location.useLocationManagement(lang)

    const handleNext = useCallback(() => {
        if (!canContinue) return

        setState((prev) =>
            produce(prev, (draft) => {
                if (!draft.weather) draft.weather = {}

                draft.weather.enabled = enabled

                if (enabled && locState.coords) {
                    draft.weather.latitude = locState.coords.latitude
                    draft.weather.longitude = locState.coords.longitude
                }
            })
        )

        nextStage()
    }, [canContinue, enabled, locState.coords, setState, nextStage])

    return (
        <>
            <StageTitle>🥵 {t('stages.stage4.title')}</StageTitle>
            <StageContent>
                <p>
                    {t('stages.stage4.p1', [<AppTitle />])} <Kaomoji k='happy' />
                </p>
                <p>{t('stages.stage4.p2')}</p>
                <div className='mt-8 flex flex-col gap-8'>
                    <Checkbox
                        checked={enabled}
                        onChange={handleLocationToggle}
                        label={t('stages.stage4.checkbox')}
                        center
                    />
                    {locState.show && (
                        <LocationForm
                            locState={locState}
                            handleLocationChange={handleLocationChange}
                            fetchCustomCoords={fetchCustomCoords}
                        />
                    )}
                </div>
            </StageContent>
            <StageActions>
                <BackButton onClick={prevStage} />
                <NextButton onClick={handleNext} disabled={!canContinue} />
            </StageActions>
        </>
    )
}
