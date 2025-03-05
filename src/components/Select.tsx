import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckCircle2Icon, ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export interface SelectOption {
    label?: string
    value: string
}

interface SelectProps {
    options: SelectOption[]
    selected: string
    onSelect: (value: string) => void
    w?: 'sm' | 'md' | 'lg'
}

const widths = {
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
} as const

export function Select({ options, selected, w = 'sm', onSelect }: SelectProps) {
    const wd = widths[w]

    const commonStyles = twMerge(
        'font-medium select-none px-4 py-2 rounded-lg',
        'bg-neutral-950 border border-neutral-800'
    )

    return (
        <Listbox value={selected} onChange={(value) => onSelect(value as string)}>
            <ListboxButton
                className={twMerge(
                    commonStyles,
                    'common-transition',
                    'flex items-center gap-2 justify-between',
                    wd
                )}
            >
                {options.find((o) => o.value === selected)?.label}
                <ChevronDown />
            </ListboxButton>

            <ListboxOptions
                anchor='bottom start'
                className={twMerge('mt-2 overflow-auto shadow-xl', commonStyles, wd, 'px-0 py-0')}
            >
                {options.map((option) => (
                    <ListboxOption
                        key={option.value}
                        value={option.value}
                        className={twMerge(
                            'group common-transition',
                            'cursor-pointer w-full p-2',
                            'hover:text-neutral-100 hover:bg-neutral-800/50',
                            'text-neutral-400 data-[selected]:text-neutral-100',
                            'data-[selected]:bg-neutral-800',
                            'flex items-center gap-1.5'
                        )}
                    >
                        <div className='group-data-[selected]:block hidden text-neutral-100'>
                            <CheckCircle2Icon size={18} strokeWidth={2} />
                        </div>
                        {option.label}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    )
}
