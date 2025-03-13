// Stage 1 - Welcome

import { ArrowRight } from 'lucide-react'
import { useLocale } from '../../../i18n/context/contextHook'
import { Button } from '../../Button'
import { Kaomoji } from '../../Kaomoji'
import { AppTitle } from '../AppTitle'
import { StageActions, StageContent, StageProps, StageTitle } from './StageModel'

export function Stage1({ nextStage }: StageProps) {
    const { t } = useLocale()

    return (
        <>
            <StageTitle>👋 {t('stages.stage1.title')}</StageTitle>
            <StageContent>
                <p>{t('stages.stage1.p1', [<AppTitle />])}</p>
                <p>{t('stages.stage1.p2')}</p>
                <p>{t('stages.stage1.p3')}</p>
                <Kaomoji k='thumbsUp' />
            </StageContent>
            <StageActions>
                <div />
                <Button onClick={nextStage}>
                    {t('actions.gotIt')}!
                    <ArrowRight size={20} strokeWidth={3} />
                </Button>
            </StageActions>
        </>
    )
}
