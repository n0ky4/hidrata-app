import { Transition } from '@headlessui/react'
import { ArrowCounterClockwise, Question, Trash } from '@phosphor-icons/react'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { ContainerType, SettingsDataType } from '../../utils/storage/schema'
import Button from '../Button/Button'
import LinkButton from '../Button/LinkButton'
import Input from './../Input'
import Modal from './index'

interface SettingsModalProps {
    show: boolean
    data: SettingsDataType
    onModalClose: () => void
    onSave: (data: SettingsDataType, ageWeightChanged?: boolean) => void
}

interface ContainerItemProps {
    container: ContainerType[0]
    onDelete: (id: string) => void
    isDisabled: boolean
}

type ErrorsType = {
    [key in keyof SettingsDataType]?: boolean
}

const AgeWeightSchema = z.object({
    age: z.coerce.number().positive().finite().int(),
    weight: z.coerce.number().positive().finite().int(),
})

const ContainerItem = ({ container, onDelete, isDisabled }: ContainerItemProps) => {
    return (
        <div
            className={twMerge(
                'flex justify-between items-center gap-2 pl-4 rounded-[9px]',
                'border',
                'transition-colors',
                isDisabled ? 'bg-red-500/20 border-red-300/40' : 'bg-transparent border-zinc-700'
            )}
        >
            <div className='truncate'>
                <span
                    className={twMerge(
                        'text-sm select-none',
                        isDisabled ? 'text-red-200' : 'text-zinc-300'
                    )}
                >
                    {container.label
                        ? `${container.label} (${container.quantity} ml)`
                        : `${container.quantity} ml`}
                </span>
            </div>
            <div>
                <Button
                    className='hover:!bg-red-500'
                    theme='ghost'
                    onClick={() => onDelete(container.id)}
                    title={isDisabled ? 'Desfazer deletar item' : 'Deletar item'}
                >
                    {isDisabled ? (
                        <ArrowCounterClockwise size={24} weight='bold' />
                    ) : (
                        <Trash size={24} weight='bold' />
                    )}
                </Button>
            </div>
        </div>
    )
}

export default function SettingsModal({
    show,
    onModalClose,
    onSave,
    data: originalData,
}: SettingsModalProps) {
    const [data, setData] = useState<SettingsDataType>(originalData)
    const [errors, setErrors] = useState<ErrorsType>({})
    const [hasChanges, setHasChanges] = useState(false)

    const [age, setAge] = useState(data.age || '')
    const [weight, setWeight] = useState(data.weight || '')
    const [disabledContainers, setDisabledContainers] = useState<string[]>([])

    useEffect(() => {
        if (!show) return
        setHasChanges(false)
        setDisabledContainers([])
    }, [show])

    useEffect(() => {
        if (!originalData) return
        setData(originalData)
        setAge(originalData.age)
        setWeight(originalData.weight)
    }, [originalData])

    useEffect(() => {
        checkChanges()
    }, [data, disabledContainers, age, weight])

    const checkChanges = () => {
        const inputsChanged =
            Number(age) !== originalData.age || Number(weight) !== originalData.weight
        const dataChanged = data !== originalData
        const containerChanged = disabledContainers.length !== 0

        if (inputsChanged || dataChanged || containerChanged) return setHasChanges(true)
        setHasChanges(false)
    }

    const handleInputChange = (input: 'age' | 'weight', e: ChangeEvent<HTMLInputElement>) => {
        if (!data) return
        const value = e.target.value
        if (input === 'age') setAge(value)
        if (input === 'weight') setWeight(value)
        checkInputErrors()
    }

    const checkInputErrors = () => {
        const check = AgeWeightSchema.safeParse({ age, weight })
        if (!check.success) {
            const { age, weight } = check.error.flatten().fieldErrors
            const ageError = age ? true : false
            const weightError = weight ? true : false
            setErrors({ weight: weightError, age: ageError })
        } else {
            setErrors({})
        }
        return check
    }

    const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const check = checkInputErrors()
        if (!check.success) return

        const newContainer = data.containers.filter((item) => !disabledContainers.includes(item.id))
        const newData = { age: check.data.age, weight: check.data.weight, containers: newContainer }

        const ageOrWeightChanged =
            check.data.age !== originalData.age || check.data.weight !== originalData.weight

        onSave(newData, ageOrWeightChanged)
        onModalClose()
    }

    const handleDelete = (id: string) => {
        if (!data) return
        const isDisabled = disabledContainers.includes(id)
        if (isDisabled) {
            setDisabledContainers((prev) => prev.filter((item) => item !== id))
        } else {
            setDisabledContainers((prev) => [...prev, id])
        }
    }

    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title custom>
                <div className='flex items-center gap-2'>
                    <h1 className='font-bold sm:text-2xl text-xl'>Configurações</h1>
                    <LinkButton
                        to='/about'
                        theme='ghost'
                        className='!rounded-full !p-1'
                        title='Sobre'
                    >
                        <Question size={24} weight='bold' />
                    </LinkButton>
                </div>
            </Modal.Title>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
                    <div className='flex gap-3 flex-wrap'>
                        <div className='flex flex-col gap-1 flex-grow'>
                            <label htmlFor='quantity_cwim' className='font-semibold'>
                                Idade:
                            </label>
                            <Input
                                type='number'
                                placeholder='Insira sua idade'
                                value={age}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange('age', e)
                                }
                            />
                            {errors.age && (
                                <span className='block font-sm text-red-500'>Idade inválida</span>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-grow'>
                            <label htmlFor='quantity_cwim' className='font-semibold'>
                                Peso:
                            </label>
                            <Input
                                type='number'
                                placeholder='Insira seu peso em kg'
                                value={weight}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange('weight', e)
                                }
                            />
                            {errors.weight && (
                                <span className='block font-sm text-red-500'>Peso inválido</span>
                            )}
                        </div>
                    </div>

                    {data?.containers.length !== 0 && (
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold'>Recipientes personalizados</h2>
                            <div className='flex flex-col gap-2 w-72'>
                                {data.containers.map((container) => (
                                    <ContainerItem
                                        key={container.id}
                                        container={container}
                                        onDelete={handleDelete}
                                        isDisabled={disabledContainers.includes(container.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex items-center gap-6 ml-auto'>
                        <Transition
                            show={hasChanges}
                            enter='transition-opacity duration-300'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='transition-opacity duration-300'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                            as={Fragment}
                        >
                            <span className='text-sm text-zinc-400'>
                                <b>Cuidado!</b> - Você tem alterações não salvas
                            </span>
                        </Transition>
                        <Button type='submit'>Salvar</Button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
