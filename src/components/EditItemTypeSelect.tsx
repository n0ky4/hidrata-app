import { CaretDown, CaretUp, CheckCircle } from '@phosphor-icons/react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import { ItemsType } from '../utils/storage/schema'
import GhostButton from './GhostButton'

interface SelectProps {
    defaultValue?: string
    onChange?: (value: ItemsType) => void
}

interface SelectItemProps {
    id: string
    name: string
}

function SelectItem({ name, id }: SelectItemProps) {
    return (
        <SelectPrimitive.Item
            value={id.toLowerCase()}
            className={clsx(
                'relative flex items-center px-8 py-2 rounded-md text-sm text-gray-300 font-medium focus:bg-zinc-800',
                'radix-disabled:opacity-50',
                'focus:outline-none select-none'
            )}
        >
            <SelectPrimitive.ItemText>{name}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className='absolute left-2 inline-flex items-center'>
                <CheckCircle size={18} weight='bold' />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}

export default function EditItemTypeSelect({ defaultValue, onChange }: SelectProps) {
    const defaultItems: SelectItemProps[] = [
        {
            id: 'glass',
            name: 'Copo (250 ml)',
        },
        {
            id: 'bottle',
            name: 'Garrafa (500 ml)',
        },
        {
            id: 'custom',
            name: 'Adicionar',
        },
    ]

    return (
        <SelectPrimitive.Root
            defaultValue={defaultValue ?? defaultItems[0].id}
            onValueChange={onChange}
        >
            <SelectPrimitive.Trigger asChild aria-label='Tipo do item'>
                <GhostButton className='inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-700 px-6'>
                    <SelectPrimitive.Value />
                    <SelectPrimitive.Icon className='ml-2'>
                        <CaretDown size={18} weight='bold' />
                    </SelectPrimitive.Icon>
                </GhostButton>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Content>
                <SelectPrimitive.ScrollUpButton className='flex items-center justify-center text-gray-300'>
                    <CaretUp />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className='bg-zinc-900 p-2 rounded-lg mt-2'>
                    <SelectPrimitive.Group>
                        {defaultItems.map((item, i) => (
                            <SelectItem key={`${item.id}-${i}`} id={item.id} name={item.name} />
                        ))}
                    </SelectPrimitive.Group>
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className='flex items-center justify-center text-zinc-300'>
                    <CaretDown />
                </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
        </SelectPrimitive.Root>
    )
}
