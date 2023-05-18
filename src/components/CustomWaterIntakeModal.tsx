import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from './Button'
import Checkbox from './Checkbox'
import Input from './Input'
import Modal from './Modal'

// Schema do formulário
export const QuantitySchema = z.object({
    quantity: z.coerce
        .number({
            required_error: 'É necessário colocar a quantidade!',
            invalid_type_error: 'Quantidade inválida!',
        })
        .finite('Quantidade inválida')
        .int('Quantidade inválida!')
        .positive('Quantidade inválida!'),
    label: z.string().max(32, 'Esse nome é muito grande!').optional(),
})

export type QuantityType = z.infer<typeof QuantitySchema>

interface CustomWaterIntakeModalProps {
    show: boolean
    onAddWaterIntake: (quantity: number) => void
    onSaveCustomContainer: (quantity: number, label?: string) => void
    onModalClose: () => void
}

export default function CustomWaterIntakeModal({
    show,
    onSaveCustomContainer,
    onAddWaterIntake,
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

    // Função para gerar nomes aleatórios que serão
    // usados como placeholder do input de nome
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
    const [checkbox, setCheckbox] = useState<boolean>(false)

    useEffect(() => {
        if (show) {
            // Gambiarra para fazer com que o input seja focado ao
            // abrir o modal. Por algum motivo, sem o setTimeout,
            // o input não é focado ¯\_(ツ)_/¯
            setTimeout(() => {
                setFocus('quantity', { shouldSelect: true })

                // Troca o nome aleatório a cada vez que o modal é aberto
                setRandomName(getRandomName(randomName))
            }, 1)
        }
    }, [show])

    // Função chamada quando o formulário é submetido
    const addQuantity = async ({ quantity, label }: QuantityType) => {
        if (checkbox) onSaveCustomContainer(quantity, label)
        else onAddWaterIntake(quantity)
        onModalClose()
    }

    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title>Quantidade personalizada</Modal.Title>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(addQuantity)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='quantity_cwim' className='font-semibold'>
                            Quantidade (em ml):
                        </label>
                        <Input
                            type='number'
                            placeholder='Ex: 1500'
                            id='quantity_cwim'
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
                    <Checkbox id='save_cwim' checked={checkbox} onClick={(e) => setCheckbox(e)}>
                        Salvar
                    </Checkbox>
                    {checkbox && (
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='label_cwim' className='font-semibold'>
                                Nome (opcional):
                            </label>
                            <Input
                                type='text'
                                placeholder={randomName}
                                id='label_cwim'
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
                    )}

                    <div>
                        <Button type='submit' className='float-right'>
                            Adicionar
                        </Button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
