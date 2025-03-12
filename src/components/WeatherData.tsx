import { WeatherRecommendedWaterResponse } from '../core/calculator'
import { useLocale } from '../i18n/context/contextHook'
import { TemperatureTag } from './TemperatureTag'

interface WeatherDataProps {
    data: WeatherRecommendedWaterResponse
}

export function WeatherData({ data: { temperatureData, condition } }: WeatherDataProps) {
    const { t } = useLocale()

    return (
        <div className='text-center w-fit flex items-center gap-4 mb-1 text-sm text-neutral-400 cursor-default'>
            <p>
                <TemperatureTag temperature={temperatureData.apparentTemperature} />
                {condition === 'favorable' ? (
                    <b>{t('weather.favorableWeather')}</b>
                ) : (
                    <b title={t('weather.unfavorableWeatherTitle') as string}>
                        {t('weather.unfavorableWeather')}
                    </b>
                )}
            </p>
            <p title={t('weather.apparentTemperature') as string}>
                {temperatureData.apparentTemperature}°C
            </p>
            <p title={t('weather.relativeHumidity') as string}>{temperatureData.humidity}%</p>
        </div>
    )
}
