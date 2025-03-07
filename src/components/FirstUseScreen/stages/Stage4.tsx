// Stage 4 - Location

import { produce } from 'immer'
import { MapPin, Search } from 'lucide-react'
import React, { useCallback, useRef, useState } from 'react'
import { Coords, IpData, location } from '../../../core/location'
import { useLocale } from '../../../i18n/context/contextHook'
import { Button } from '../../Button'
import { Checkbox } from '../../Checkbox'
import { Input } from '../../Input'
import { Kaomoji } from '../../Kaomoji'
import { Label } from '../../Label'
import { AppTitle } from '../AppTitle'
import {
    BackButton,
    NextButton,
    StageActions,
    StageContent,
    StageProps,
    StageTitle,
} from './StageModel'

interface LocationState {
    show: boolean
    inputValue: string
    placeName: string | null
    coords: Coords | null
}

// location management hook
function useLocationManagement(lang: string) {
    const [enabled, setEnabled] = useState(false)
    const [canContinue, setCanContinue] = useState(true)
    const locationDetected = useRef<IpData | null>(null)
    const [locState, setLocState] = useState<LocationState>({
        show: false,
        inputValue: '',
        placeName: null,
        coords: null,
    })

    const updateLocationState = useCallback((updates: Partial<LocationState>) => {
        setLocState((prev) =>
            produce(prev, (draft) => {
                Object.assign(draft, updates)
            })
        )
    }, [])

    const fetchLocationData = useCallback(async () => {
        try {
            const data = await location.fetchLocation(lang)
            const locVal = location.getLocationValue(data)
            locationDetected.current = data

            updateLocationState({
                show: true,
                inputValue: locVal,
                placeName: locVal,
                coords: { lat: data.lat, lon: data.lon },
            })
            setCanContinue(true)
        } catch (err) {
            console.error(err)
            updateLocationState({
                show: false,
                inputValue: '',
                placeName: null,
                coords: null,
            })
            setCanContinue(false)
        }
    }, [lang, updateLocationState])

    const handleLocationToggle = useCallback(
        (checked: boolean) => {
            setEnabled(checked)

            if (checked) {
                if (!locationDetected.current) {
                    fetchLocationData()
                } else {
                    updateLocationState({ show: true })
                }
            } else {
                updateLocationState({ show: false })
            }
        },
        [fetchLocationData, updateLocationState]
    )

    const fetchCustomCoords = useCallback(async () => {
        const data = locationDetected.current
        const detectedLoc = data ? location.getLocationValue(data) : null

        if (detectedLoc && locState.inputValue === detectedLoc) {
            const { lat, lon } = data || {}
            if (!lat || !lon) throw new Error('No coordinates found')

            updateLocationState({
                show: true,
                inputValue: detectedLoc,
                placeName: detectedLoc,
                coords: { lat, lon },
            })
            setCanContinue(true)
            return
        }

        try {
            const { coords, place } = await location.fetchCoords(locState.inputValue, lang)
            updateLocationState({
                show: true,
                inputValue: place,
                placeName: place,
                coords,
            })
            setCanContinue(true)
        } catch (error) {
            console.error('Failed to fetch coordinates', error)
            setCanContinue(false)
        }
    }, [lang, locState.inputValue, updateLocationState])

    const handleLocationChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            updateLocationState({ inputValue: value })
            setCanContinue(false)
        },
        [updateLocationState]
    )

    return {
        enabled,
        canContinue,
        locState,
        handleLocationToggle,
        handleLocationChange,
        fetchCustomCoords,
    }
}

export function Stage4({ setState, nextStage, prevStage }: StageProps) {
    const { t, lang } = useLocale()

    const {
        enabled,
        canContinue,
        locState,
        handleLocationToggle,
        handleLocationChange,
        fetchCustomCoords,
    } = useLocationManagement(lang)

    const handleNext = useCallback(() => {
        if (!canContinue) return

        setState((prev) =>
            produce(prev, (draft) => {
                if (!draft.weather) draft.weather = {}

                draft.weather.enabled = enabled

                if (enabled && locState.coords) {
                    draft.weather.latitude = locState.coords.lat
                    draft.weather.longitude = locState.coords.lon
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
                        <div>
                            <Label>{t('generic.location')}</Label>
                            <form
                                className='flex items-center gap-2'
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    fetchCustomCoords()
                                }}
                            >
                                <Input
                                    placeholder={t('generic.location') as string}
                                    value={locState.inputValue}
                                    onChange={handleLocationChange}
                                    className='w-full'
                                />
                                <Button
                                    theme='ghost'
                                    className='p-0 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                    type='submit'
                                >
                                    <Search size={22} strokeWidth={3} />
                                </Button>
                            </form>
                            {locState.coords && locState.placeName && (
                                <div className='text-neutral-400 text-xs mt-2 flex items-center gap-1'>
                                    <div>
                                        <MapPin size={16} />
                                    </div>
                                    <span className='truncate' title={locState.placeName}>
                                        {locState.placeName} ({locState.coords.lat},{' '}
                                        {locState.coords.lon})
                                    </span>
                                </div>
                            )}
                        </div>
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
