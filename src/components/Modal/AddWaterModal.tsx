import { useState } from 'react'
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
    const { t } = useLocale()

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

    const volumeError = !!(state.volume && (numberVolume <= 0 || numberVolume > maxVolume))

    const handleAdd = () => {
        const { name, save } = state
        let containerId

        if (save)
            containerId = addContainer({
                name: name?.trim(),
                volume: numberVolume,
            })

        if (containerId) addContainerRecord(containerId, numberVolume)
        else addVolumeRecord(numberVolume)

        onClose()
    }

    // reset before closing
    const onClose = () => {
        setState({ save: false })
        _onClose()
    }

    return (
        <Modal show={show} onClose={onClose}>
            <ModalTitle onClose={onClose}>Quantidade personalizada</ModalTitle>

            <div className='flex flex-col gap-4 w-full'>
                <div className='w-full'>
                    <Label error={volumeError}>Quantidade</Label>
                    <Input
                        type='number'
                        className='hide-arrows w-full'
                        placeholder='1500 ml'
                        value={state.volume || ''}
                        onChange={(e) => setVolume(e.target.value)}
                        error={volumeError}
                    />
                </div>
                <Checkbox checked={state.save} onChange={setSave} label='Salvar' />
                {state.save && (
                    <div className='w-full'>
                        <Label>Nome (opcional)</Label>
                        <Input
                            type='text'
                            className='w-full'
                            placeholder='Caneca que minha mãe me deu'
                            value={state.name || ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <ModalActions>
                <Button onClick={onClose} theme='ghost'>
                    {t('generic.close')}
                </Button>
                <Button onClick={handleAdd} disabled={volumeError}>
                    {t('generic.add')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
