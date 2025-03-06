import { ClimateRecommendedWaterResponse } from '../core/calculator'
import { TemperatureLabelTag } from './TemperatureLabelTag'

interface ClimateDataProps {
    data: ClimateRecommendedWaterResponse
}

export function ClimateData({ data: { temperatureData, condition } }: ClimateDataProps) {
    return (
        <div className='text-center w-fit flex items-center gap-4 mb-1 text-sm text-neutral-400 cursor-default'>
            <p>
                <TemperatureLabelTag temperature={temperatureData.apparentTemperature} />
                {condition === 'favorable' ? <b>Clima favorável</b> : <b>Clima desfavorável</b>}
            </p>
            <p title='Sensação térmica'>{temperatureData.apparentTemperature}°C</p>
            <p title='Umidade relativa'>{temperatureData.humidity}%</p>
        </div>
    )
}
