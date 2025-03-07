// Stage 3 - Weight and Age

import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { units } from '../../../core/units'
import { useLocale } from '../../../i18n/context/contextHook'
import { ageSchema, weightSchema } from '../../../schemas/config.schema'
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

export function Stage3({ state, setState, nextStage, prevStage }: StageProps) {
    const { t } = useLocale()

    const [btnDisabled, setBtnDisabled] = useState(true)
    const [errors, setErrors] = useState({ age: false, weight: false })

    const [age, setAge] = useState<string>('')
    const [weight, setWeight] = useState<string>('')

    const validateAge = (age: number) => {
        const { success } = ageSchema.safeParse(age)

        if (!success) {
            setErrors({ ...errors, age: true })
            return false
        }

        setErrors({ ...errors, age: false })
        return true
    }

    const validateWeight = (weight: number) => {
        if (!state.units) return

        const kgWeight =
            state.units.weight === 'kg'
                ? weight
                : units.convertWeight(weight, { from: state.units.weight, to: 'kg', decimals: 0 })

        const { success } = weightSchema.safeParse(kgWeight)

        if (!success) {
            setErrors({ ...errors, weight: true })
            return false
        }

        setErrors({ ...errors, weight: false })
        return true
    }

    const setInput = (type: 'age' | 'weight', value: string) => {
        const num = Number(value)

        if (type === 'age') {
            setAge(value)
            validateAge(num)
        }

        if (type === 'weight') {
            setWeight(value)
            validateWeight(num)
        }
    }

    const handleNextStage = () => {
        const ageNum = Number(age)
        const weightNum = Number(weight)

        if (!validateAge(ageNum) || !validateWeight(weightNum)) return

        setState((prev) =>
            produce(prev, (draft) => {
                draft.age = ageNum
                draft.weight = weightNum
            })
        )

        nextStage()
    }

    useEffect(() => {
        if (age && weight && !errors.age && !errors.weight) {
            setBtnDisabled(false)
            return
        }

        setBtnDisabled(true)
    }, [age, weight, errors])

    return (
        <>
            <StageTitle>🏋️ {t('stages.stage3.title')}</StageTitle>
            <StageContent>
                <p>{t('stages.stage3.p1')}</p>
                <form
                    className='flex flex-col gap-4 items-center'
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div>
                        <Label htmlFor='age' error={errors.age}>
                            {t('generic.age')}
                        </Label>
                        <Input
                            className={twMerge(
                                commonInputStyle,
                                errors.age && 'border-red-500 ring-red-500/50'
                            )}
                            placeholder={`18 ${t('generic.yearsOld')}`}
                            type='number'
                            value={age}
                            onChange={(e) => setInput('age', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor='weight' error={errors.weight}>
                            {t('generic.weight')}
                        </Label>
                        <Input
                            className={twMerge(
                                commonInputStyle,
                                errors.weight && 'border-red-500 ring-red-500/50'
                            )}
                            placeholder={units.convertWeight(70, {
                                to:
                                    state.units && state.units.weight != null
                                        ? state.units.weight
                                        : 'kg',
                                decimals: 0,
                                symbol: true,
                            })}
                            type='number'
                            value={weight}
                            onChange={(e) => setInput('weight', e.target.value)}
                        />
                    </div>
                </form>
            </StageContent>
            <StageActions>
                <BackButton onClick={prevStage} />
                <NextButton onClick={handleNextStage} disabled={btnDisabled} />
            </StageActions>
        </>
    )
}
