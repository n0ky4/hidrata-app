import { Check } from '@phosphor-icons/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as LabelPrimitive from '@radix-ui/react-label'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

interface CheckboxType {
    id: string
    children?: React.ReactNode
    checked: boolean
    onClick?: (checked: boolean) => void
}

export default function Checkbox({ id, children, onClick, checked }: CheckboxType) {
    const checkboxRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                checkboxRef.current?.click()
            }
        }

        checkboxRef.current?.addEventListener('keydown', handleKeyDown)

        return () => {
            checkboxRef.current?.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className='flex items-center'>
            <CheckboxPrimitive.Root
                id={id}
                className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-md',
                    'radix-state-checked:bg-blue-600 radix-state-unchecked:bg-zinc-900',
                    'ring-focus'
                )}
                onCheckedChange={onClick}
                checked={checked}
                ref={checkboxRef as React.RefObject<HTMLButtonElement>}
            >
                <CheckboxPrimitive.Indicator>
                    <Check className='h-5 w-5 self-center text-white' weight='bold' />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <LabelPrimitive.Label
                htmlFor={id}
                className='ml-3 select-none text-sm font-medium text-zinc-100'
            >
                {children}
            </LabelPrimitive.Label>
        </div>
    )
}
