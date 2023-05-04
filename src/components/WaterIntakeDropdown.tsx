import { Plus, PlusCircle } from '@phosphor-icons/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import { StorageType } from '../utils/storage/schema'

type ItemsType = StorageType['records'][0]['items'][0]['type']

type DropdownItem = {
    id: ItemsType
    label: string
    icon?: React.ReactNode
    shortcut?: string
}

interface WaterIntakeDropdownProps {
    onAdd: (type: ItemsType, ml?: number) => void
}

export function WaterIntakeDropdown({ onAdd }: WaterIntakeDropdownProps) {
    const isMac = navigator.userAgent.indexOf('Mac') !== -1
    const dropdownItems: DropdownItem[] = [
        {
            id: 'glass',
            label: 'Copo (250ml)',
            shortcut: 'N',
        },
        {
            id: 'bottle',
            label: 'Garrafa (500ml)',
        },
        {
            id: 'custom',
            label: 'Adicionar',
            icon: <PlusCircle weight='bold' size={18} />,
        },
    ]

    const handleClick = (id: ItemsType) => {
        if (id === 'custom') {
            const ml = prompt('Quantos ml de água você bebeu?')
            if (!ml) return
            const parsed = parseInt(ml)
            if (!isNaN(parsed)) onAdd(id, parsed)
            return
        }
        onAdd(id)
    }

    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                <button className='p-1.5 rounded-md bg-transparent hover:bg-white/20 transition-colors'>
                    <Plus size={18} weight='bold' />
                </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align='end'
                    sideOffset={5}
                    className={clsx(
                        'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
                        'w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56',
                        'bg-white dark:bg-zinc-900'
                    )}
                >
                    {dropdownItems.map(({ id, label, icon, shortcut }) => (
                        <DropdownMenuPrimitive.Item
                            key={id}
                            className={clsx(
                                'flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none',
                                'text-gray-400 focus:bg-gray-50 dark:text-zinc-500 dark:focus:bg-zinc-800'
                            )}
                            onClick={() => handleClick(id)}
                        >
                            <div className='text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 flex-grow'>
                                {icon}
                                <span className=''>{label}</span>
                            </div>
                            {shortcut && (
                                <span className='text-sm'>
                                    {isMac ? '⌘ + ' : 'Ctrl + '}
                                    {shortcut}
                                </span>
                            )}
                        </DropdownMenuPrimitive.Item>
                    ))}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    )
}
