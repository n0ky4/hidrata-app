import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Storage } from '../utils/storage'
import { StorageSchema } from '../utils/storage/schema'

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
    onReady: () => void
}

export default function FirstUsePopup({ storage, onReady }: FirstUsePopupProps) {
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
        onReady()
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen p-5 pt-20'>
            <div className='max-w-xl mx-auto z-10 relative p-6 rounded-xl bg-zinc-800 flex flex-col gap-4'>
                <h1 className='text-2xl font-bold'>Primeiras configurações</h1>
                <p className='text-md'>
                    Olá, seja bem-vindo(a) ao <b>hidrata-app</b>, vamos começar? Informe sua idade e
                    seu peso para calcularmos a quantidade diária de água ideal para você ;)
                </p>
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
                            className='bg-purple-600 text-white font-lg font-semibold py-2 px-4 rounded hover:bg-purple-700 transition-colors float-right'
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
            <div className='absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.5)]'></div>
        </div>
    )
}
