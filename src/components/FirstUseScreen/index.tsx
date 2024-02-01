import { ArrowRight } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../Button/Button'
import Stagger from '../Stagger'
import { MeasurementSystemStage } from './MeasurementSystemStage'
import { liquidSystems, weightSystems } from './common'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const Title = ({ children, ...rest }: TitleProps) => (
    <h1 className='text-3xl font-bold' {...rest}>
        {children}
    </h1>
)

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const Paragraph = ({ children, ...rest }: ParagraphProps) => (
    <p className='text-lg text-zinc-300' {...rest}>
        {children}
    </p>
)

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label = ({ children, ...rest }: LabelProps) => (
    <label className='text-zinc-400 text-sm' {...rest}>
        {children}
    </label>
)

function FirstMessage() {
    return (
        <div className='flex flex-col gap-4'>
            <Stagger>
                <Paragraph>
                    You're one step away from using <b className='text-white'>hidrata-app</b>! We
                    just need to ask you a few questions to get you started.
                </Paragraph>
                <Paragraph>
                    Note that this app is designed to store everything locally on your device. No
                    information is sent to any server.
                </Paragraph>
                <Paragraph>And don't worry, you can change these settings at any time ;)</Paragraph>
            </Stagger>
        </div>
    )
}

const STAGE_TITLES = ['👋 Hey there!', '🍶 Measure']

export default function FirstUseScreen() {
    const [canContinue, setCanContinue] = useState<boolean>(false)
    const [stage, setStage] = useState<number>(0)

    const [weightSystem, setWeightSystem] = useState(weightSystems[0])
    const [liquidSystem, setLiquidSystem] = useState(liquidSystems[0])

    useEffect(() => {
        const lang = navigator.language
        if (lang === 'en-US') {
            setWeightSystem(weightSystems[1])
            setLiquidSystem(liquidSystems[1])
        } else if (lang === 'en-GB' || lang === 'en-CA' || lang === 'fr-CA') {
            setWeightSystem(weightSystems[1])
            setLiquidSystem(liquidSystems[0])
        }
    }, [])

    const handleNextStage = () => {
        setStage((prev) => prev + 1)
    }

    const handleBackStage = () => {
        setStage((prev) => prev - 1)
    }

    const getStage = () => {
        if (stage === 0) return <FirstMessage />
        if (stage === 1)
            return (
                <MeasurementSystemStage
                    liquidSystem={liquidSystem}
                    setLiquidSystem={setLiquidSystem}
                    weightSystem={weightSystem}
                    setWeightSystem={setWeightSystem}
                />
            )
        return <></>
    }

    return (
        <main className='relative'>
            <div className='relative w-full max-w-screen-sm p-4 mt-10 mx-auto z-10'>
                <div className='relative p-6 bg-zinc-800 rounded-xl flex flex-col gap-6 overflow-hidden'>
                    <div className='absolute top-0 left-0 w-full h-1 bg-zinc-700 rounded-t-xl'>
                        <div
                            className={twMerge(
                                'h-1 bg-blue-400',
                                'transition-[width] ease-out duration-500'
                            )}
                            style={{
                                width: `${stage * (100 / STAGE_TITLES.length)}%`,
                            }}
                        />
                    </div>
                    <Title>{STAGE_TITLES[stage]}</Title>
                    <div className='flex flex-col gap-6 mb-20 z-10'>{getStage()}</div>
                    <div className='flex justify-end absolute bottom-0 left-0 w-full p-6 gap-2'>
                        {stage > 0 && (
                            <Button theme='ghost' onClick={handleBackStage}>
                                Back
                            </Button>
                        )}
                        <Button onClick={handleNextStage}>
                            Next
                            <ArrowRight size={24} weight='bold' />
                        </Button>
                    </div>
                </div>
            </div>
            <div className='fixed top-0 left-0 w-screen h-screen bg-zinc-900' />
        </main>
    )
}
