// Stage 4 - Climate condition detection

import { produce } from 'immer'
import { Search } from 'lucide-react'
import { useRef, useState } from 'react'
import { IpData, location } from '../../../core/location'
import { useLocale } from '../../../i18n/context/contextHook'
import { Button } from '../../Button'
import { Checkbox } from '../../Checkbox'
import { Input } from '../../Input'
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

const littleGuy = <b className='text-white font-normal'>(˵ •̀ ᴗ - ˵ ) ✧</b>

export function Stage4({ setState, nextStage, prevStage }: StageProps) {
    const { t, lang } = useLocale()
    const [enabled, _setEnabled] = useState(false)

    const locationDetected = useRef<IpData | null>(null)

    const [showLocation, setShowLocation] = useState(false)
    const [locValue, setLocValue] = useState('')
    const [canContinue, setCanContinue] = useState(false)

    const [latLon, setLatLon] = useState({ lat: 0, lon: 0 })

    const setEnabled = (checked: boolean) => {
        if (checked) {
            if (!locationDetected.current) {
                location
                    .fetchLocation(lang)
                    .then((data) => {
                        const locVal = location.getLocationValue(data)
                        locationDetected.current = data

                        setLocValue(locVal)
                        setLatLon({ lat: data.lat, lon: data.lon })
                        setShowLocation(true)
                        setCanContinue(true)
                    })
                    .catch((err) => {
                        console.error(err)
                        setShowLocation(false)
                    })
            } else {
                setShowLocation(true)
            }
        } else {
            setShowLocation(false)
        }

        _setEnabled(checked)
    }

    const fetchCoords = () => {
        const data = locationDetected.current
        const detectedLoc = data ? location.getLocationValue(data) : null

        if (detectedLoc && locValue === detectedLoc) {
            const lat = data?.lat
            const lon = data?.lon
            if (!lat || !lon) throw new Error('No coordinates found')

            setLatLon({ lat, lon })
            setCanContinue(true)
            return
        }

        location.getCoords(locValue).then((coords) => {
            setLatLon(coords)
            setCanContinue(true)
        })
    }

    const onLocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLocValue(value)
        setCanContinue(false)
    }

    const handleNext = () => {
        if (!canContinue) return

        if (enabled) {
            setState((prev) =>
                produce(prev, (draft) => {
                    draft.location.use = true
                    draft.location.lat = latLon.lat
                    draft.location.lon = latLon.lon
                })
            )
        } else {
            setState((prev) =>
                produce(prev, (draft) => {
                    draft.location.use = false
                })
            )
        }

        nextStage()
    }

    return (
        <>
            <StageTitle>🥵 {t('stages.stage4.title')}</StageTitle>
            <StageContent>
                <p>
                    {t('stages.stage4.p1', [<AppTitle />])} {littleGuy}
                </p>
                <p>{t('stages.stage4.p2')}</p>
                <div className='mt-8 flex flex-col gap-8'>
                    <div className='flex items-center justify-center gap-2'>
                        <Checkbox
                            checked={enabled}
                            onChange={setEnabled}
                            label={t('stages.stage4.checkbox')}
                        />
                    </div>
                    {showLocation && (
                        <div>
                            <Label>{t('generic.location')}</Label>
                            <div className='flex items-center gap-2'>
                                <Input
                                    placeholder={t('generic.location') as string}
                                    value={locValue}
                                    onChange={onLocChange}
                                    className='w-full'
                                />
                                <Button
                                    theme='ghost'
                                    className='p-0 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                    onClick={fetchCoords}
                                >
                                    <Search size={22} strokeWidth={3} />
                                </Button>
                            </div>
                            {latLon.lat !== 0 && latLon.lon !== 0 && (
                                <p className='text-neutral-400 text-sm mt-2'>
                                    {t('generic.coords')}: {latLon.lat}, {latLon.lon}
                                </p>
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
