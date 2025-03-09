import { AvailableVolumes, AvailableWeights, units } from '../../core/units'
import { AvailableLanguages, i18n } from '../../i18n'
import { useLocale } from '../../i18n/context/contextHook'
import { useConfig } from '../../stores/config.store'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
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

export function SettingsModal({ show, onClose }: CommonModalProps) {
    const { t, setAppLanguage } = useLocale()

    const lang = useConfig((state) => state.config?.language) as AvailableLanguages

    const notification = useConfig((state) => state.config?.notifications.enabled) as boolean
    const setNotification = useConfig((state) => state.setNotificationsEnabled)

    const notifInterval = useConfig((state) => state.config?.notifications.interval) as number
    const setNotifInterval = useConfig((state) => state.setNotificationsInterval)

    const notifSound = useConfig((state) => state.config?.notifications.sound) as string
    const setNotifSound = useConfig((state) => state.setNotificationsSound)

    const weight = useConfig((state) => state.config?.units.weight) as string
    const setWeight = useConfig((state) => state.setUnitsWeight)
    const weightSelectOptions = units.getWeightSelectOptions(t)

    const volume = useConfig((state) => state.config?.units.volume) as string
    const setVolume = useConfig((state) => state.setUnitsVolume)
    const volumeSelectOptions = units.getVolumeSelectOptions(t)

    const themeMode = useConfig((state) => state.config?.theme.mode) as string
    const setThemeMode = useConfig((state) => state.setThemeMode)

    const accentColor = useConfig((state) => state.config?.theme.accentColor) as string
    const setAccentColor = useConfig((state) => state.setThemeAccentColor)

    const font = useConfig((state) => state.config?.theme.font) as string
    const setFont = useConfig((state) => state.setThemeFont)

    const weatherEnabled = useConfig((state) => state.config?.weather.enabled) as boolean
    const setWeatherEnabled = useConfig((state) => state.setWeatherEnabled)

    const latitude = useConfig((state) => state.config?.weather.latitude) as number
    const setLatitude = useConfig((state) => state.setWeatherLatitude)

    const longitude = useConfig((state) => state.config?.weather.longitude) as number
    const setLongitude = useConfig((state) => state.setWeatherLongitude)

    const handleLangChange = (lang: AvailableLanguages) => {
        setAppLanguage(lang)
    }

    return (
        <Modal show={show} onClose={onClose}>
            <ModalTitle onClose={onClose}>{t('generic.settings')}</ModalTitle>
            <ModalDescription>{t('settings.description')}</ModalDescription>
            <div className='max-h-96 overflow-y-auto flex flex-col gap-4'>
                <ModalSection title={t('generic.language') as string}>
                    <Select
                        selected={lang}
                        onSelect={(value) => handleLangChange(value as AvailableLanguages)}
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
                        <div className='flex flex-col gap-2'>
                            <div>
                                <Label>Latitude</Label>
                                <Input
                                    type='number'
                                    value={latitude || ''}
                                    min={-90}
                                    max={90}
                                    onChange={(e) => setLatitude(Number(e.target.value))}
                                    className='w-32'
                                />
                            </div>
                            <div>
                                <Label>Longitude</Label>
                                <Input
                                    type='number'
                                    value={longitude || ''}
                                    min={-180}
                                    max={180}
                                    onChange={(e) => setLongitude(Number(e.target.value))}
                                    className='w-32'
                                />
                            </div>
                        </div>
                    )}
                </ModalSection>
            </div>

            <ModalActions>
                <Button onClick={onClose} theme='ghost'>
                    {t('generic.close')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
