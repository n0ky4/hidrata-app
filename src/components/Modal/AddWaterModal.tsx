import { useState } from 'react'
import { units } from '../../core/units'
import { useLocale } from '../../i18n/context/contextHook'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Label } from '../Label'
import { CommonModalProps, Modal, ModalActions, ModalTitle } from './Modal'

interface AddWaterState {
    save: boolean
    quantity?: string
    name?: string
}

export function AddWaterModal({ onClose: _onClose, show }: CommonModalProps) {
    const { t } = useLocale()

    const volumeUnit = units.useConfigVolume()
    const maxQuantity = units.convertVolume(10_000, { from: 'ml', to: volumeUnit, decimals: 0 }) // max 10l

    const [state, setState] = useState<AddWaterState>({
        save: false,
    })

    const setSave = (save: boolean) => setState((state) => ({ ...state, save }))
    const setQuantity = (quantity: string) => setState((state) => ({ ...state, quantity }))
    const setName = (name: string) => setState((state) => ({ ...state, name }))

    const numberQuantity = Number(state.quantity)

    const quantityError = !!(
        state.quantity &&
        (numberQuantity <= 0 || numberQuantity > maxQuantity)
    )

    const handleAdd = () => {
        const { name, save } = state

        const data = {
            quantity: numberQuantity,
            save,
            name: name?.trim(),
        }

        console.log(data)
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
                    <Label error={quantityError}>Quantidade</Label>
                    <Input
                        type='number'
                        className='hide-arrows w-full'
                        placeholder='1500 ml'
                        value={state.quantity || ''}
                        onChange={(e) => setQuantity(e.target.value)}
                        error={quantityError}
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
                <Button onClick={handleAdd} disabled={quantityError}>
                    {t('generic.add')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
