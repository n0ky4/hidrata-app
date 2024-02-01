import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import Modal from '.'
import { StorageSchema, StorageType } from '../../utils/storage/schema'
import Button from '../Button'
import Input from '../Input'

// Schema do formulário
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

interface FirstUseModalProps {
    onSaveSettings: (settings: StorageType) => void
}

export default function FirstUseModal({ onSaveSettings }: FirstUseModalProps) {
    const { t } = useTranslation()
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

        if (!parsed) return
        onSaveSettings(parsed)
    }

    return (
        <Modal show={true} showCloseButton={false} canClose={false}>
            <Modal.Title>Primeiras configurações</Modal.Title>
            <Modal.Description>
                Olá, seja bem-vindo(a) ao <b>hidrata-app</b>, vamos começar? Informe sua idade e seu
                peso para calcularmos a quantidade diária de água ideal para você ;)
            </Modal.Description>
            <Modal.Content>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit(setSettings)}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='age_fup' className='font-semibold'>
                            {t('age')}
                        </label>
                        <Input
                            type='number'
                            placeholder='Ex: 35'
                            id='age_fup'
                            register={register}
                            validationSchema={FirstSettingsSchema}
                            name='age'
                        />
                        {errors.age && (
                            <span className='block font-sm text-red-500'>{errors.age.message}</span>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='weight_fup' className='font-semibold'>
                            Peso (em kg):
                        </label>
                        <Input
                            type='number'
                            placeholder='Ex: 70'
                            id='weight_fup'
                            register={register}
                            validationSchema={FirstSettingsSchema}
                            name='weight'
                        />
                        {errors.weight && (
                            <span className='block font-sm text-red-500'>
                                {errors.weight.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <Button type='submit' className='float-right'>
                            Salvar
                        </Button>
                    </div>
                </form>
            </Modal.Content>
        </Modal>
    )
}
