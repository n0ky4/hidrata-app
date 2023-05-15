import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EditChangesType } from '../utils/storage'
import { ItemsType } from '../utils/storage/schema'
import EditItemTypeSelect from './EditItemTypeSelect'
import Modal from './Modal'

export interface ItemEditDataType extends EditChangesType {
    id: string
}

interface EditItemModalProps {
    data: ItemEditDataType | null
    show: boolean
    onModalClose: () => void
    onEdit: (id: string, edit: EditChangesType) => void
}

export const QuantitySchema = z.object({
    quantity: z.coerce
        .number({
            required_error: 'É necessário colocar a quantidade!',
            invalid_type_error: 'Quantidade inválida!',
        })
        .finite('Quantidade inválida')
        .int('Quantidade inválida!')
        .positive('Quantidade inválida!')
        .optional(),
    label: z.string().max(32, 'Esse nome é muito grande!').optional(),
})

export type QuantityType = z.infer<typeof QuantitySchema>

export default function EditItemModal({ data, onModalClose, onEdit, show }: EditItemModalProps) {
    const {
        setFocus,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuantityType>({
        resolver: zodResolver(QuantitySchema),
    })

    const [isCustomValue, setIsCustomValue] = useState(data?.type === 'custom')
    const [selectedType, setSelectedType] = useState<ItemsType>(data?.type || 'glass')

    useEffect(() => {
        if (show) {
            // I don't know why, but this is necessary to make the input focus
            setTimeout(() => {
                setFocus('quantity', { shouldSelect: true })
            }, 1)
        }
    }, [show])

    useEffect(() => {
        if (selectedType === 'custom') setIsCustomValue(true)
        else setIsCustomValue(false)
    }, [selectedType])

    useEffect(() => {
        if (!data) return
        setSelectedType(data.type)
        setValue('quantity', data.quantity || undefined)
        setValue('label', data.label)
    }, [data])

    const handleEdit = async ({ quantity, label }: QuantityType) => {
        if (!data || (data && !data.id)) return
        switch (selectedType) {
            case 'custom':
                onEdit(data.id, { type: 'custom', quantity, label })
                break
            default:
                onEdit(data.id, { type: selectedType })
                break
        }
        onModalClose()
    }

    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title>Editar registro</Modal.Title>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(handleEdit)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='quantity' className='font-semibold'>
                            Tipo:
                        </label>
                        <div>
                            <EditItemTypeSelect
                                onChange={(type) => setSelectedType(type)}
                                defaultValue={selectedType}
                            />
                        </div>
                    </div>
                    {isCustomValue && (
                        <>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='quantity' className='font-semibold'>
                                    Quantidade (em ml):
                                </label>
                                <input
                                    type='text'
                                    className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
                                    placeholder='Ex: 1500'
                                    {...register('quantity')}
                                />
                                {errors.quantity && (
                                    <span className='block font-sm text-red-500'>
                                        {errors.quantity.message}
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='name' className='font-semibold'>
                                    Nome (opcional):
                                </label>
                                <input
                                    type='text'
                                    className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
                                    placeholder='Escolha um nome para esse recipiente'
                                    {...register('label')}
                                />
                                {errors.label && (
                                    <span className='block font-sm text-red-500'>
                                        {errors.label.message}
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <button
                            type='submit'
                            className='bg-blue-600 text-white font-lg font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors float-right'
                        >
                            Editar
                        </button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
