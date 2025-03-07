// Stage 5 - Reminders

import { produce } from 'immer'
import { useEffect, useRef } from 'react'
import { useLocale } from '../../../i18n/context/contextHook'
import { Checkbox } from '../../Checkbox'
import { Input } from '../../Input'
import { KAOMOJIS } from '../../Kaomoji'
import { Label } from '../../Label'
import {
    BackButton,
    NextButton,
    StageActions,
    StageContent,
    StageProps,
    StageTitle,
} from './StageModel'

export function Stage5({ state, setState, nextStage, prevStage }: StageProps) {
    const { t } = useLocale()

    const remind = state.notifications?.enabled
    const minutes = state.notifications?.interval || 0

    const alreadyAsked = useRef<boolean>(false)

    const btnEnabled = (remind === true && minutes > 0) || remind === false

    const setRemind = (newValue: boolean) => {
        setState((prev) =>
            produce(prev, (draft) => {
                if (!draft.notifications) draft.notifications = {}
                draft.notifications.enabled = newValue
            })
        )
    }

    const setMinutes = (newValue: string) => {
        setState((prev) =>
            produce(prev, (draft) => {
                if (!draft.notifications) draft.notifications = {}
                draft.notifications.interval = Number(newValue)
            })
        )
    }

    useEffect(() => {
        if (Notification.permission === 'denied') return setRemind(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickEnable = (value: boolean) => {
        if (!value) return setRemind(false)

        if (Notification.permission === 'granted') return setRemind(true)
        if (Notification.permission === 'denied') {
            alert(t('generic.notificationsDenied'))
            return setRemind(false)
        }

        // ask for notification permission
        Notification.requestPermission().then((result) => {
            if (result === 'granted') {
                new Notification(KAOMOJIS.thumbsUp)
                return setRemind(true)
            }

            alert(t('generic.notificationsDenied'))
            alreadyAsked.current = true

            setRemind(false)
        })
    }

    return (
        <>
            <StageTitle>🔔 {t('stages.stage5.title')}</StageTitle>
            <StageContent>
                <p>{t('stages.stage5.p1')}</p>
                <div className='mt-8 flex flex-col gap-8 items-center'>
                    <Checkbox
                        checked={remind || false}
                        onChange={onClickEnable}
                        label={t('stages.stage5.checkbox')}
                        center
                    />
                    {remind && (
                        <div className='flex items-center gap-2'>
                            <Label>{t('generic.remindMeIn')}</Label>
                            <Input
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                type='number'
                                placeholder='30'
                                min='1'
                                className='w-10 text-center hide-arrows'
                            />
                            <Label>{t('generic.minutes')}</Label>
                        </div>
                    )}
                </div>
            </StageContent>
            <StageActions>
                <BackButton onClick={prevStage} />
                <NextButton onClick={nextStage} disabled={!btnEnabled} />
            </StageActions>
        </>
    )
}
