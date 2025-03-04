import { Field, Checkbox as HeadlessCheckbox, Label } from '@headlessui/react'
import { CheckIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: ReactNode
    center?: boolean
}

export function Checkbox({ checked, label, center = false, onChange }: CheckboxProps) {
    const checkbox = (
        <HeadlessCheckbox
            checked={checked}
            onChange={onChange}
            className={twMerge(
                'transition-all ease-out',
                'flex items-center justify-center',
                'group size-6 rounded-md cursor-pointer',
                'bg-neutral-950 border border-neutral-800',
                'data-[checked]:bg-white data-[checked]:border-white',
                'shadow-md shadow-transparent data-[checked]:shadow-white/10'
            )}
        >
            <CheckIcon
                className={twMerge(
                    'block',
                    'transition-all ease-out duration-200',
                    'opacity-0 group-data-[checked]:opacity-100',
                    'text-black'
                )}
                size={18}
                strokeWidth={3}
            />
        </HeadlessCheckbox>
    )

    if (!label) return checkbox

    return (
        <Field className={twMerge('flex items-center gap-2', center && 'justify-center')}>
            {checkbox}
            <Label
                className={twMerge(
                    'transition-all ease-out',
                    'cursor-pointer select-none text-neutral-400',
                    checked && 'text-white hover:text-white'
                )}
            >
                {label}
            </Label>
        </Field>
    )
}
