import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckCircle2Icon, ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export interface SelectOptionProps {
    label?: string
    value: string
}

interface WidthProps {
    w?: 'sm' | 'md' | 'md+' | 'lg'
}

interface SelectProps extends WidthProps {
    options: SelectOptionProps[]
    selected: string
    onSelect: (value: string) => void
}

const widths = {
    sm: 'w-32',
    md: 'w-48',
    'md+': 'w-56',
    lg: 'w-64',
} as const

const commonStyles = twMerge(
    'font-medium select-none px-4 py-2 rounded-lg',
    'bg-neutral-950 border border-neutral-800'
)
export const styles = {
    selectOptions: twMerge('mt-2 overflow-auto shadow-xl', commonStyles, 'px-0 py-0'),
    selectOption: twMerge(
        'group common-transition',
        'cursor-pointer w-full p-2',
        'hover:text-neutral-100 hover:bg-neutral-800/50',
        'text-neutral-400 data-[selected]:text-neutral-100',
        'data-[selected]:bg-neutral-800',
        'flex items-center gap-1.5'
    ),
}

interface SelectOptionsProps extends WidthProps {
    children?: React.ReactNode
}

export function SelectOptions({ children, w = 'sm' }: SelectOptionsProps) {
    const wd = widths[w]

    return (
        <ListboxOptions anchor='bottom start' className={twMerge(styles.selectOptions, wd)}>
            {children}
        </ListboxOptions>
    )
}

export function SelectOption({ option }: { option: SelectOptionProps }) {
    return (
        <ListboxOption key={option.value} value={option.value} className={styles.selectOption}>
            <div className='group-data-[selected]:block hidden text-neutral-100'>
                <CheckCircle2Icon size={18} strokeWidth={2} />
            </div>
            {option.label}
        </ListboxOption>
    )
}

interface SelectButtonProps extends WidthProps {
    selected: string
    options: SelectOptionProps[]
}

export function SelectButton({ selected, options, w = 'sm' }: SelectButtonProps) {
    const wd = widths[w]
    return (
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
    )
}

export function Select({ options, selected, w = 'sm', onSelect }: SelectProps) {
    return (
        <Listbox value={selected} onChange={(value) => onSelect(value as string)}>
            <SelectButton selected={selected} options={options} w={w} />
            <SelectOptions w={w}>
                {options.map((option) => (
                    <SelectOption key={option.value} option={option} />
                ))}
            </SelectOptions>
        </Listbox>
    )
}
