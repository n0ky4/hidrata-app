import { Field, Checkbox as HeadlessCheckbox, Label } from '@headlessui/react'
import { CheckIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: ReactNode
    center?: boolean
    className?: string
}

export function Checkbox({ checked, label, center = false, onChange, className }: CheckboxProps) {
    const checkbox = (
        <HeadlessCheckbox
            checked={checked}
            onChange={onChange}
            className={twMerge(
                'common-transition',
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
                    'common-transition',
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
        <Field
            className={twMerge('flex items-center gap-2', center && 'justify-center', className)}
        >
            {checkbox}
            <Label
                className={twMerge(
                    'common-transition',
                    'cursor-pointer select-none text-neutral-400',
                    checked && 'text-neutral-100 hover:text-neutral-100'
                )}
            >
                {label}
            </Label>
        </Field>
    )
}
