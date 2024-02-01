import { Label, Paragraph } from '.'
import Select, { SelectOptionType } from '../Select'
import Stagger from '../Stagger'
import { liquidSystems, weightSystems } from './common'

interface MeasurementSystemStageProps {
    weightSystem: SelectOptionType
    setWeightSystem: (option: SelectOptionType) => void
    liquidSystem: SelectOptionType
    setLiquidSystem: (option: SelectOptionType) => void
}

export function MeasurementSystemStage({
    weightSystem,
    setWeightSystem,
    liquidSystem,
    setLiquidSystem,
}: MeasurementSystemStageProps) {
    return (
        <Stagger>
            <div className='flex flex-col gap-4 text-center'>
                <Paragraph>What measurement system would you like to use?</Paragraph>
            </div>
            <div className='flex items-center justify-center pb-8'>
                <div className='flex items-center justify-center gap-4 flex-wrap'>
                    <div className='w-48'>
                        {/* weight system */}
                        <Label htmlFor='weight'>Weight</Label>
                        <Select
                            id='weight'
                            options={weightSystems}
                            value={weightSystem}
                            onChange={setWeightSystem}
                        />
                    </div>
                    <div className='w-48'>
                        {/* liquid system */}
                        <Label htmlFor='liquid'>Liquid</Label>
                        <Select
                            id='liquid'
                            options={liquidSystems}
                            value={liquidSystem}
                            onChange={setLiquidSystem}
                        />
                    </div>
                </div>
            </div>
        </Stagger>
    )
}
