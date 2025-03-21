import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { location } from '../../core/location'
import { AvailableTemperatures, AvailableVolumes, AvailableWeights, units } from '../../core/units'
import { AvailableLanguages, i18n } from '../../i18n'
import { useLocale } from '../../i18n/context/contextHook'
import { useConfig } from '../../stores/config.store'
import { useContainers } from '../../stores/containers.store'
import { removeAllData } from '../../util/localStorage'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { LocationForm } from '../FirstUseScreen/LocationForm'
import { Input } from '../Input'
import { Label } from '../Label'
import { Select } from '../Select'
import {
    CommonModalProps,
    Modal,
    ModalActions,
    ModalDescription,
    ModalSection,
    ModalTitle,
} from './Modal'

const langOptions = i18n.getLanguageOptions()

export function SettingsModal({ show, onClose: _onClose }: CommonModalProps) {
    const { t, setAppLanguage, lang } = useLocale()

    const notification = useConfig((state) => state.config?.notifications.enabled) as boolean
    const setNotification = useConfig((state) => state.setNotificationsEnabled)

    const notifInterval = useConfig((state) => state.config?.notifications.interval) as number
    const setNotifInterval = useConfig((state) => state.setNotificationsInterval)

    // const notifSound = useConfig((state) => state.config?.notifications.sound) as string
    // const setNotifSound = useConfig((state) => state.setNotificationsSound)

    const weight = useConfig((state) => state.config?.units.weight) as string
    const setWeight = useConfig((state) => state.setUnitsWeight)
    const weightSelectOptions = units.getWeightSelectOptions(t)

    const volume = useConfig((state) => state.config?.units.volume) as string
    const setVolume = useConfig((state) => state.setUnitsVolume)
    const volumeSelectOptions = units.getVolumeSelectOptions(t)

    const temperature = useConfig((state) => state.config?.units.temperature) as string
    const setTemperature = useConfig((state) => state.setUnitsTemperature)
    const temperatureSelectOptions = units.getTemperatureSelectOptions(t)

    // const themeMode = useConfig((state) => state.config?.theme.mode) as string
    // const setThemeMode = useConfig((state) => state.setThemeMode)

    // const accentColor = useConfig((state) => state.config?.theme.accentColor) as string
    // const setAccentColor = useConfig((state) => state.setThemeAccentColor)

    // const font = useConfig((state) => state.config?.theme.font) as string
    // const setFont = useConfig((state) => state.setThemeFont)

    const weatherEnabled = useConfig((state) => state.config?.weather.enabled) as boolean
    const setWeatherEnabled = useConfig((state) => state.setWeatherEnabled)

    const setLatitude = useConfig((state) => state.setWeatherLatitude)
    const setLongitude = useConfig((state) => state.setWeatherLongitude)
    const setPlaceName = useConfig((state) => state.setWeatherPlaceName)
    const placeName = useConfig((state) => state.config?.weather.placeName) as string

    const { locState, handleLocationChange, fetchCustomCoords } = location.useLocationManagement({
        lang,
        defaultInputValue: placeName,
    })

    const ogLatitude = useConfig((state) => state.config?.weather.latitude) as number
    const ogLongitude = useConfig((state) => state.config?.weather.longitude) as number

    const containers = useContainers((state) => state.data?.containers) || []
    const removeContainer = useContainers((state) => state.removeContainer)

    const volumeUnit = units.useConfigVolume()

    const onClose = () => {
        // handle location change
        if (locState.coords && weatherEnabled) {
            const { latitude, longitude } = locState.coords

            const changed = latitude !== ogLatitude || longitude !== ogLongitude

            if (changed) {
                setLatitude(latitude)
                setLongitude(longitude)
                if (locState.placeName) setPlaceName(locState.placeName)

                window.location.reload()
            }
        }
        _onClose()
    }

    const [confirmCount, setCurrentCount] = useState(0)
    const confirmDelete = () => {
        setCurrentCount((prev) => {
            const next = prev + 1

            if (next === 5) {
                removeAllData()
                window.location.reload()
            }

            return next
        })
    }

    return (
        <Modal show={show} onClose={onClose}>
            <ModalTitle onClose={onClose}>{t('generic.settings')}</ModalTitle>
            <ModalDescription>{t('settings.description')}</ModalDescription>
            <div className='max-h-96 overflow-y-auto flex flex-col gap-4 py-[2px] pl-[2px] pr-2'>
                {containers.length > 0 && (
                    <ModalSection title={t('generic.containers') as string}>
                        <div className='flex flex-col gap-2'>
                            {containers.map((container) => {
                                const formattedVolume = units.convertVolume(container.volume, {
                                    to: volumeUnit,
                                    symbol: true,
                                    decimals: 0,
                                })

                                return (
                                    <div
                                        className='bg-zinc-950/50 border border-zinc-800 p-2 rounded-lg flex items-center justify-between'
                                        key={container.id}
                                    >
                                        {container.name ? (
                                            <div>
                                                <span className='text-zinc-300'>
                                                    {container.name || 'Sem nome'}
                                                </span>{' '}
                                                <span className='text-zinc-400'>
                                                    ({formattedVolume})
                                                </span>
                                            </div>
                                        ) : (
                                            <span className='text-zinc-400'>{formattedVolume}</span>
                                        )}

                                        <Button
                                            theme='ghost'
                                            square
                                            className='w-8 h-8'
                                            onClick={() => removeContainer(container.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalSection>
                )}
                <ModalSection title={t('generic.language') as string}>
                    <Select
                        selected={lang}
                        onSelect={(value) => setAppLanguage(value as AvailableLanguages)}
                        options={langOptions}
                        w='md+'
                    />
                </ModalSection>
                <ModalSection title={t('generic.notifications') as string}>
                    <Checkbox
                        label={t('settings.enableNotifications') as string}
                        checked={notification}
                        onChange={setNotification}
                    />
                    {notification && (
                        <div>
                            <Label>{t('settings.notificationInterval') as string}</Label>
                            <Input
                                type='number'
                                value={notifInterval}
                                min={1}
                                onChange={(e) => setNotifInterval(Number(e.target.value))}
                                className='w-20'
                            />
                            {/* <Label>Som da notificação</Label>
                            <Select
                                selected={notifSound}
                                onSelect={(value) => setNotifSound(value)}
                                options={Object.keys(notifications.sounds)}
                            /> */}
                        </div>
                    )}
                </ModalSection>
                <ModalSection title={t('generic.units') as string}>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <Label>{t('generic.weight')}</Label>
                            <Select
                                selected={weight}
                                onSelect={(value) =>
                                    units.onSetWeight(
                                        value as AvailableWeights,
                                        setWeight,
                                        weightSelectOptions
                                    )
                                }
                                w='lg'
                                options={weightSelectOptions}
                            />
                        </div>
                        <div>
                            <Label>{t('generic.volume')}</Label>
                            <Select
                                selected={volume}
                                onSelect={(value) =>
                                    units.onSetVolume(
                                        value as AvailableVolumes,
                                        setVolume,
                                        volumeSelectOptions
                                    )
                                }
                                w='lg'
                                options={volumeSelectOptions}
                            />
                        </div>
                        <div>
                            <Label>{t('weather.temperature')}</Label>
                            <Select
                                selected={temperature}
                                onSelect={(value) =>
                                    units.onSetTemperature(
                                        value as AvailableTemperatures,
                                        setTemperature,
                                        temperatureSelectOptions
                                    )
                                }
                                w='lg'
                                options={temperatureSelectOptions}
                            />
                        </div>
                    </div>
                </ModalSection>
                {/* <ModalSection title='Tema'>
                    <Label>Modo</Label>
                    <Select selected={themeMode} onSelect={setThemeMode} options={theme.themes} />
                    <Label>Cor de destaque</Label>
                    <Input
                        type='text'
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        placeholder='#HEXCODE'
                    />
                    <Label>Fonte</Label>
                    <Select
                        selected={font}
                        onSelect={setFont}
                        options={['default', 'serif', 'sans-serif']}
                    />
                </ModalSection> */}
                <ModalSection title={t('generic.weather') as string}>
                    <Checkbox
                        label={t('settings.enableWeatherDetection') as string}
                        checked={weatherEnabled}
                        onChange={setWeatherEnabled}
                        className='mb-2'
                    />
                    {weatherEnabled && (
                        <LocationForm
                            locState={locState}
                            handleLocationChange={handleLocationChange}
                            fetchCustomCoords={fetchCustomCoords}
                        />
                    )}
                </ModalSection>

                <ModalSection title='Zona de perigo' className='mt-20'>
                    <Button onClick={confirmDelete} theme='danger' className='w-fit'>
                        Deletar todos os dados {confirmCount != 0 && `(${confirmCount}/5)`}
                    </Button>
                </ModalSection>
            </div>

            <ModalActions>
                <Button onClick={onClose} theme='ghost'>
                    {t('actions.close')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
