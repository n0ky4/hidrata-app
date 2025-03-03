// Stage 3 - Weight and Age

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { units } from '../../../core/units'
import { useLocale } from '../../../i18n/context/contextHook'
import { AgeWeight, ageWeightSchema } from '../../../schemas/config.schema'
import { Input } from '../../Input'
import { Label } from '../../Label'
import {
    BackButton,
    NextButton,
    StageActions,
    StageContent,
    StageProps,
    StageTitle,
} from './StageModel'

const commonInputStyle = 'w-32 text-center hide-arrows'

export function Stage3({ state, nextStage, prevStage }: StageProps) {
    const { t } = useLocale()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AgeWeight>({
        resolver: zodResolver(ageWeightSchema),
    })

    const canProceed = Object.keys(errors).length === 0

    const onSubmit = (data: AgeWeight) => {
        console.log(data)
    }

    console.log(errors)

    return (
        <>
            <StageTitle>🏋️ {t('stages.stage3.title')}</StageTitle>
            <StageContent>
                <p>{t('stages.stage3.p1')}</p>
                <form
                    className='flex flex-col gap-4 items-center'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label htmlFor='age'>{t('generic.age')}</Label>
                        <Input
                            className={commonInputStyle}
                            placeholder={`18 ${t('generic.yearsOld')}`}
                            type='number'
                            {...register('age')}
                        />
                    </div>
                    <div>
                        <Label htmlFor='weight'>{t('generic.weight')}</Label>
                        <Input
                            className={commonInputStyle}
                            placeholder={units.convert(70, {
                                to: state.units.weight,
                                decimals: 0,
                                addSymbol: true,
                            })}
                            {...register('weight')}
                            type='number'
                        />
                    </div>
                </form>
            </StageContent>
            <StageActions>
                <BackButton onClick={prevStage} />
                <NextButton onClick={nextStage} disabled={!canProceed} />
            </StageActions>
        </>
    )
}
