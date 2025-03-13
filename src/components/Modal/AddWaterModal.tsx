import { useMemo, useState } from 'react'
import { useAppHandler } from '../../core/appHandler'
import { units } from '../../core/units'
import { useLocale } from '../../i18n/context/contextHook'
import { MAX_CONTAINER_VOLUME } from '../../schemas/containers.schema'
import { useContainers } from '../../stores/containers.store'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Label } from '../Label'
import { CommonModalProps, Modal, ModalActions, ModalTitle } from './Modal'

interface AddWaterState {
    save: boolean
    volume?: string
    name?: string
}

export function AddWaterModal({ onClose: _onClose, show }: CommonModalProps) {
    const { t, lang } = useLocale()

    const addContainer = useContainers((state) => state.addContainer)
    const { addContainerRecord, addVolumeRecord } = useAppHandler()

    const volumeUnit = units.useConfigVolume()
    const maxVolume = units.convertVolume(MAX_CONTAINER_VOLUME, {
        from: 'ml',
        to: volumeUnit,
        decimals: 0,
    })

    const [state, setState] = useState<AddWaterState>({
        save: false,
    })

    const setSave = (save: boolean) => setState((state) => ({ ...state, save }))
    const setVolume = (volume: string) => setState((state) => ({ ...state, volume }))
    const setName = (name: string) => setState((state) => ({ ...state, name }))

    const numberVolume = Number(state.volume)

    const hasVolume = !isNaN(numberVolume) && numberVolume > 0
    const volumeError = numberVolume > maxVolume

    const handleAdd = () => {
        const { name, save } = state
        let containerId

        const volume = units.convertVolume(numberVolume, {
            from: volumeUnit,
            to: 'ml',
        })

        if (save)
            containerId = addContainer({
                name: name?.trim(),
                volume,
            })

        if (containerId) addContainerRecord(containerId, volume)
        else addVolumeRecord(volume)

        onClose()
    }

    // reset before closing
    const onClose = () => {
        setState({ save: false })
        _onClose()
    }

    const placeholders = t('addWater.placeholders').toString().split(',')

    const randomPlaceholder = useMemo(() => {
        return placeholders[Math.floor(Math.random() * placeholders.length)]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang])

    return (
        <Modal show={show} onClose={onClose}>
            <ModalTitle onClose={onClose}>{t('addWater.customContainer')}</ModalTitle>

            <div className='flex flex-col gap-4 w-full'>
                <div className='w-full'>
                    <Label error={volumeError}>{t('generic.volume')}</Label>
                    <Input
                        type='number'
                        className='hide-arrows w-full'
                        placeholder={units.convertVolume(250, {
                            from: 'ml',
                            to: volumeUnit,
                            decimals: 0,
                            symbol: true,
                        })}
                        value={state.volume || ''}
                        onChange={(e) => setVolume(e.target.value)}
                        error={volumeError}
                    />
                </div>
                <Checkbox checked={state.save} onChange={setSave} label={t('actions.save')} />
                {state.save && (
                    <div className='w-full'>
                        <Label>{t('addWater.nameInputLabel')}</Label>
                        <Input
                            type='text'
                            className='w-full'
                            placeholder={randomPlaceholder}
                            value={state.name || ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <ModalActions>
                <Button onClick={onClose} theme='ghost'>
                    {t('actions.close')}
                </Button>
                <Button onClick={handleAdd} disabled={volumeError || !hasVolume}>
                    {t('actions.add')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
