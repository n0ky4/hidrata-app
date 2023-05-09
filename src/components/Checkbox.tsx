import { Check } from '@phosphor-icons/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as LabelPrimitive from '@radix-ui/react-label'
import { clsx } from 'clsx'

interface CheckboxType {
    name: string
    children?: React.ReactNode
    checked: boolean
    onClick?: (checked: boolean) => void
}

export default function Checkbox({ name, children, onClick, checked }: CheckboxType) {
    return (
        <div className='flex items-center'>
            <CheckboxPrimitive.Root
                name={name}
                className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-md',
                    'radix-state-checked:bg-blue-600 radix-state-unchecked:bg-zinc-900'
                )}
                onCheckedChange={onClick}
                checked={checked}
            >
                <CheckboxPrimitive.Indicator>
                    <Check className='h-5 w-5 self-center text-white' weight='bold' />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <LabelPrimitive.Label
                htmlFor={name}
                className='ml-3 select-none text-sm font-medium text-zinc-100'
            >
                {children}
            </LabelPrimitive.Label>
        </div>
    )
}
