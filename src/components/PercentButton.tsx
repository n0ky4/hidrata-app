import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { PlusCircle } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { twMerge } from 'tailwind-merge'
import { DefaultContainer, defaultContainers } from '../core/defaultContainers'
import { AvailableVolumes, units } from '../core/units'
import { useLocale } from '../i18n/context/contextHook'
import { useConfig } from '../stores/config.store'
import { styles } from './Select'

interface PercentButtonProps {
    onAdd: (type: DefaultContainer | 'custom') => void
    percentage: number
    drank: number
    recommended: number
}

export function PercentButton({ percentage, drank, recommended, onAdd }: PercentButtonProps) {
    const { t } = useLocale()

    const formattedPercentage = percentage < 999 ? `${percentage.toFixed(0)}%` : '+999%'
    const formattedDrank = new Intl.NumberFormat().format(drank)
    const formattedRecommended = new Intl.NumberFormat().format(recommended)

    const volumeUnit: AvailableVolumes = useConfig((state) => state.config?.units.volume) || 'ml'

    return (
        <Menu as='div' className='relative group'>
            <MenuButton as={Fragment}>
                {({ active }) => (
                    <button
                        className={twMerge(
                            'common-transition',
                            'select-none hover:bg-white/5 p-8 rounded-3xl group min-w-48',
                            active && 'bg-white/5'
                        )}
                    >
                        <div className='leading-none'>
                            <h3 className='text-6xl font-bold leading-none'>
                                {formattedPercentage}
                            </h3>
                            <span
                                className={twMerge(
                                    'common-transition',
                                    'text-sm leading-none font-medium text-neutral-700',
                                    'group-hover:text-neutral-300',
                                    active && 'text-neutral-300'
                                )}
                            >
                                {formattedDrank} / {formattedRecommended} ml
                            </span>
                        </div>
                    </button>
                )}
            </MenuButton>
            <MenuItems
                className={twMerge(
                    'absolute top-full left-0 w-full',
                    styles.selectOptions,
                    'shadow-xl shadow-black/50'
                )}
            >
                <MenuItem
                    as='button'
                    className={styles.selectOption}
                    onClick={() => onAdd('glass')}
                >
                    {t('generic.glass')} (
                    {units.convertVolume(defaultContainers.glass, {
                        to: volumeUnit,
                        symbol: true,
                        decimals: 0,
                    })}
                    )
                </MenuItem>
                <MenuItem
                    as='button'
                    className={styles.selectOption}
                    onClick={() => onAdd('bottle')}
                >
                    {t('generic.bottle')} (
                    {units.convertVolume(defaultContainers.bottle, {
                        to: volumeUnit,
                        symbol: true,
                        decimals: 0,
                    })}
                    )
                </MenuItem>
                <MenuSeparator className='border-t border-neutral-800' />
                <MenuItem
                    as='button'
                    className={styles.selectOption}
                    onClick={() => onAdd('custom')}
                >
                    <PlusCircle size={20} strokeWidth={2} />
                    {t('generic.add')}
                </MenuItem>
            </MenuItems>
        </Menu>
    )
}
