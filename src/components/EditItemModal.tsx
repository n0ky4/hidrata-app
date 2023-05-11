import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ContainerType } from '../utils/storage/schema'
import EditItemTypeSelect from './EditItemTypeSelect'
import Modal from './Modal'
import { ItemsTypeAddCustom } from './WaterIntakeDropdown'

const QuantitySchema = z.object({
    quantity: z.coerce
        .number({
            invalid_type_error: 'Quantidade inválida!',
        })
        .finite('Quantidade inválida')
        .int('Quantidade inválida!')
        .positive('Quantidade inválida!')
        .optional(),
})

export type QuantityType = z.infer<typeof QuantitySchema>

export type EditChangesType = {
    type: ItemsTypeAddCustom
    containerId?: string
    quantity?: number
}

export type ItemEditDataType = {
    id: string
    type: ItemsTypeAddCustom
    quantity?: number
    containerId?: string
}

interface EditItemModalProps {
    data: ItemEditDataType | null
    show: boolean
    containers: ContainerType
    onModalClose: () => void
    onEdit: (id: string, edit: EditChangesType) => void
}

export default function EditItemModal({
    data,
    onModalClose,
    onEdit,
    show,
    containers,
}: EditItemModalProps) {
    const {
        setFocus,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuantityType>({
        resolver: zodResolver(QuantitySchema),
    })

    const [isCustomValue, setIsCustomValue] = useState(data && data.type === 'add-custom')
    const [selectedType, setSelectedType] = useState<ItemsTypeAddCustom>(
        data && data.type ? data.type : 'glass'
    )
    const [containerId, setContainerId] = useState<string | undefined>(
        data && data.containerId ? data.containerId : undefined
    )

    useEffect(() => {
        if (show) {
            // I don't know why, but this is necessary to make the input focus
            setTimeout(() => {
                setFocus('quantity', { shouldSelect: true })
            }, 1)
        }
    }, [show])

    useEffect(() => {
        if (selectedType === 'add-custom') setIsCustomValue(true)
        else setIsCustomValue(false)
    }, [selectedType])

    const handleEdit = async ({ quantity }: QuantityType) => {
        if (!data || (data && !data.id)) return
        switch (selectedType) {
            case 'custom':
                if (!containerId) throw new Error('Unknown container id')
                onEdit(data.id, { type: 'custom', containerId, quantity })
                break
            case 'add-custom':
                onEdit(data.id, { type: 'custom', quantity })
                break
            default:
                onEdit(data.id, { type: selectedType })
                break
        }
        onModalClose()
    }

    const onTypeChange = (type: ItemsTypeAddCustom, containerId?: string) => {
        if (type === 'custom' && containerId) setContainerId(containerId)
        setSelectedType(type)
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
                                containers={containers}
                                onChange={onTypeChange}
                                defaultValue={selectedType}
                            />
                        </div>
                    </div>
                    {isCustomValue && (
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
