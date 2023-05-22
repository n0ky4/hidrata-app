import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWaterMLFromType } from '../../utils/helpers'
import { EditChangesType } from '../../utils/storage'
import { ItemsType } from '../../utils/storage/schema'
import Button from './../Button'
import Input from './../Input'
import Select, { SelectOptionType } from './../Select'
import Modal from './index'

export interface ItemEditDataType extends EditChangesType {
    id: string
}

interface EditItemModalProps {
    data: ItemEditDataType | null
    show: boolean
    onModalClose: () => void
    onEdit: (id: string, edit: EditChangesType) => void
}

// Schema de formulário
export const QuantitySchema = z.object({
    quantity: z.union([
        z.coerce
            .number({
                required_error: 'É necessário colocar a quantidade!',
                invalid_type_error: 'Quantidade inválida!',
            })
            .finite('Quantidade inválida')
            .int('Quantidade inválida!')
            .positive('Quantidade inválida!')
            .optional(),
        z.string().length(0, 'Quantidade inválida!'),
    ]),
    label: z.string().max(32, 'Esse nome é muito grande!').optional(),
})

export type QuantityType = z.infer<typeof QuantitySchema>

// Itens padrão do select
const selectItems: SelectOptionType[] = [
    {
        value: 'glass',
        label: `Copo (${getWaterMLFromType('glass')} ml)`,
    },
    {
        value: 'bottle',
        label: `Garrafa (${getWaterMLFromType('bottle')} ml)`,
    },
    {
        value: 'custom',
        label: 'Adicionar',
    },
]

export default function EditItemModal({ data, onModalClose, onEdit, show }: EditItemModalProps) {
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuantityType>({
        resolver: zodResolver(QuantitySchema),
    })

    const [isCustomValue, setIsCustomValue] = useState<boolean>(
        data && data.type === 'custom' ? true : false
    )
    const [selectedType, setSelectedType] = useState<SelectOptionType>(selectItems[0])

    useEffect(() => {
        if (selectedType.value === 'custom') setIsCustomValue(true)
        else setIsCustomValue(false)
    }, [selectedType])

    useEffect(() => {
        if (!data) return
        const find = selectItems.filter((x) => x.value === data?.type)[0]
        if (find) setSelectedType(find)
        setValue('quantity', data.quantity || undefined)
        setValue('label', data.label)
    }, [data])

    const handleEdit = async ({ quantity, label }: QuantityType) => {
        if (!data?.id) return

        if (selectedType.value === 'custom') {
            const qty = Number(quantity) || 0
            onEdit(data.id, { type: 'custom', quantity: qty, label })
        } else {
            onEdit(data.id, { type: selectedType.value as ItemsType })
        }

        onModalClose()
    }

    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title>Editar registro</Modal.Title>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(handleEdit)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='type_edm' className='font-semibold'>
                            Tipo:
                        </label>
                        <div>
                            <Select
                                id='type_edm'
                                options={selectItems}
                                value={selectedType}
                                onChange={setSelectedType}
                            />
                        </div>
                    </div>
                    {isCustomValue && (
                        <>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='quantity_edm' className='font-semibold'>
                                    Quantidade (em ml):
                                </label>
                                <Input
                                    type='number'
                                    placeholder='Ex: 1500'
                                    id='quantity_edm'
                                    register={register}
                                    validationSchema={QuantitySchema}
                                    name='quantity'
                                />
                                {errors.quantity && (
                                    <span className='block font-sm text-red-500'>
                                        {errors.quantity.message}
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='label_edm' className='font-semibold'>
                                    Nome (opcional):
                                </label>
                                <Input
                                    type='text'
                                    placeholder='Escolha um nome para esse recipiente'
                                    id='label_edm'
                                    register={register}
                                    validationSchema={QuantitySchema}
                                    name='label'
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
                        <Button type='submit' className='float-right'>
                            Editar
                        </Button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
