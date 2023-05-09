import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Storage } from '../utils/storage'
import { StorageSchema } from '../utils/storage/schema'
import Modal from './Modal'

const FirstSettingsSchema = z.object({
    age: z.coerce
        .number({
            required_error: 'É necessário colocar a idade!',
            invalid_type_error: 'Idade inválida!',
        })
        .finite('Idade inválida')
        .int('Idade inválida!')
        .positive('Idade inválida!'),
    weight: z.coerce
        .number({
            required_error: 'É necessário colocar o peso!',
            invalid_type_error: 'Peso inválido!',
        })
        .finite('Peso inválido!')
        .int('Peso inválido!')
        .positive('Peso inválido!'),
})

export type FirstSettingsType = z.infer<typeof FirstSettingsSchema>

interface FirstUsePopupProps {
    storage: Storage
}

export default function FirstUsePopup({ storage }: FirstUsePopupProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FirstSettingsType>({
        resolver: zodResolver(FirstSettingsSchema),
    })

    const setSettings = async ({ age, weight }: FirstSettingsType) => {
        const parsed = StorageSchema.parse({
            settings: {
                age,
                weight,
            },
        })

        await storage.setData(parsed)
        window.location.reload()
    }

    return (
        <Modal show={true} canClose={false}>
            <Modal.Title>Primeiras configurações</Modal.Title>
            <Modal.Description>
                Olá, seja bem-vindo(a) ao <b>hidrata-app</b>, vamos começar? Informe sua idade e seu
                peso para calcularmos a quantidade diária de água ideal para você ;)
            </Modal.Description>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(setSettings)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='height' className='font-semibold'>
                            Idade
                        </label>
                        <input
                            type='number'
                            className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
                            placeholder='Ex: 35'
                            {...register('age')}
                        />
                        {errors.age && (
                            <span className='block font-sm text-red-500'>{errors.age.message}</span>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='weight' className='font-semibold'>
                            Peso (em kg):
                        </label>
                        <input
                            type='number'
                            className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
                            placeholder='Ex: 70'
                            {...register('weight')}
                        />
                        {errors.weight && (
                            <span className='block font-sm text-red-500'>
                                {errors.weight.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <button
                            type='submit'
                            className='bg-blue-600 text-white font-lg font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors float-right'
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
