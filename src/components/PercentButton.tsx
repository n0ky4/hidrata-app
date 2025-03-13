import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { PlusCircle } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { twMerge } from 'tailwind-merge'
import { useAppHandler } from '../core/appHandler'
import { defaultContainers } from '../core/defaultContainers'
import { units } from '../core/units'
import { useLocale } from '../i18n/context/contextHook'
import { useContainers } from '../stores/containers.store'
import { styles } from './Select'

interface PercentButtonProps {
    percentage: number
    drank: number
    recommended: number
}

export function PercentButton({ percentage, drank, recommended }: PercentButtonProps) {
    const { t } = useLocale()

    const volumeUnit = units.useConfigVolume()
    const formattedPercentage = percentage < 999 ? `${percentage.toFixed(0)}%` : '+999%'

    const convertedDrank = units.convertVolume(drank, {
        from: 'ml',
        to: volumeUnit,
        decimals: 0,
    })

    const convertedRecommended = units.convertVolume(recommended, {
        from: 'ml',
        to: volumeUnit,
        decimals: 0,
    })

    const formattedDrank = new Intl.NumberFormat().format(convertedDrank)
    const formattedRecommended = new Intl.NumberFormat().format(convertedRecommended)

    const containers = useContainers((state) => state.data?.containers)

    const {
        addDefaultContainerRecord,
        requestOpenAddWaterModal,
        addVolumeRecord,
        addContainerRecord,
    } = useAppHandler()

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
                                {formattedDrank} / {formattedRecommended}{' '}
                                {units.getVolume(volumeUnit).symbol}
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
                    onClick={() => addDefaultContainerRecord('glass')}
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
                    onClick={() => addDefaultContainerRecord('bottle')}
                >
                    {t('generic.bottle')} (
                    {units.convertVolume(defaultContainers.bottle, {
                        to: volumeUnit,
                        symbol: true,
                        decimals: 0,
                    })}
                    )
                </MenuItem>

                {/* custom containers below */}
                {containers &&
                    containers.length > 0 &&
                    containers.map((container) => {
                        const volume = units.convertVolume(container.volume, {
                            to: volumeUnit,
                            symbol: true,
                            decimals: 0,
                        })

                        if (!container.name) {
                            // add volume
                            return (
                                <MenuItem
                                    key={container.id}
                                    as='button'
                                    className={styles.selectOption}
                                    onClick={() => addVolumeRecord(container.volume)}
                                >
                                    {volume}
                                </MenuItem>
                            )
                        }

                        return (
                            <MenuItem
                                key={container.id}
                                as='button'
                                className={styles.selectOption}
                                onClick={() => addContainerRecord(container.id, container.volume)}
                            >
                                {container.name} ({volume})
                            </MenuItem>
                        )
                    })}

                <MenuSeparator className='border-t border-neutral-800' />

                <MenuItem
                    as='button'
                    className={styles.selectOption}
                    onClick={() => requestOpenAddWaterModal()}
                >
                    <PlusCircle size={20} strokeWidth={2} />
                    {t('generic.add')}
                </MenuItem>
            </MenuItems>
        </Menu>
    )
}
