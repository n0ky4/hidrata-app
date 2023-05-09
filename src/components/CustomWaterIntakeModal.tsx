import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Checkbox from './Checkbox'
import Modal from './Modal'

const QuantitySchema = z.object({
    quantity: z.coerce
        .number({
            required_error: 'É necessário colocar a quantidade!',
            invalid_type_error: 'Quantidade inválida!',
        })
        .finite('Quantidade inválida')
        .int('Quantidade inválida!')
        .positive('Quantidade inválida!'),
    name: z.string().max(50, 'Esse nome é muito grande!').optional(),
})

export type QuantityType = z.infer<typeof QuantitySchema>

interface CustomWaterIntakeModalProps {
    show: boolean
    onSave: (quantity: number) => void
    onModalClose: () => void
}

export default function CustomWaterIntakeModal({
    show,
    onSave,
    onModalClose,
}: CustomWaterIntakeModalProps) {
    const {
        setFocus,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuantityType>({
        resolver: zodResolver(QuantitySchema),
    })

    const getRandomName = (exclude?: string) => {
        const names = [
            'Caneca que minha mãe me deu',
            'Taça da vitória',
            'Copo da Hello Kitty',
            'Garrafa do timão',
            'Copo de requeijão',
        ]
        if (exclude) names.splice(names.indexOf(exclude), 1)
        return names[Math.floor(Math.random() * names.length)]
    }

    const [randomName, setRandomName] = useState(getRandomName())
    const [checkbox, setCheckbox] = useState(false)

    useEffect(() => {
        if (show) {
            // I don't know why, but this is necessary to make the input focus
            setTimeout(() => {
                setFocus('quantity', { shouldSelect: true })
                setRandomName(getRandomName(randomName))
            }, 1)
        }
    }, [show])

    const addQuantity = async ({ quantity }: QuantityType) => {
        onSave(quantity)
        onModalClose()
    }

    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title>Quantidade personalizada</Modal.Title>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(addQuantity)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='quantity' className='font-semibold'>
                            Quantidade (em ml):
                        </label>
                        <input
                            type='number'
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
                    <Checkbox
                        name='save-custom'
                        checked={checkbox}
                        onClick={(e) => setCheckbox(e as boolean)}
                    >
                        Salvar
                    </Checkbox>
                    {checkbox && (
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='name' className='font-semibold'>
                                Nome (opcional):
                            </label>
                            <input
                                type='text'
                                className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
                                placeholder={randomName}
                                {...register('name')}
                            />
                            {errors.name && (
                                <span className='block font-sm text-red-500'>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                    )}

                    <div>
                        <button
                            type='submit'
                            className='bg-blue-600 text-white font-lg font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors float-right'
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
