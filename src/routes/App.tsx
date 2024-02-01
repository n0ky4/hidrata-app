import { GearSix } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import colors from 'tailwindcss/colors'
import Button from '../components/Button'
import { Debug } from '../components/Debug'
import EmptyRecords from '../components/EmptyRecords'
import ConfirmModal from '../components/Modal/ConfirmModal'
import CustomWaterIntakeModal from '../components/Modal/CustomWaterIntakeModal'
import EditItemModal, { ItemEditDataType } from '../components/Modal/EditItemModal'
import FirstUsePopup from '../components/Modal/FirstUseModal'
import SettingsModal from '../components/Modal/SettingsModal'
import NavBar from '../components/NavBar'
import { RecordCard } from '../components/RecordCard'
import { WaterIntakeDropdown } from '../components/WaterIntakeDropdown'
import { clamp, getAdequateIntake } from '../utils/helpers'
import log from '../utils/log'
import { EditChangesType, useStorage } from '../utils/storage'
import {
    ContainerType,
    ItemsType,
    RecordItemType,
    SettingsDataType,
    StorageType,
    TodaySettingsDataType,
} from '../utils/storage/schema'

function App() {
    const { t, i18n } = useTranslation()
    const storage = useStorage()
    const [data, setData] = useState<StorageType | null>(null)
    const [todayRecords, setTodayRecords] = useState<RecordItemType>([])
    const [containers, setContainers] = useState<ContainerType>([])
    const [itemEditData, setItemEditData] = useState<ItemEditDataType | null>(null)
    const [settingsData, setSettingsData] = useState<SettingsDataType>({
        age: 0,
        weight: 0,
        containers: [],
    })
    const [ageWeightToEdit, setAgeWeightToEdit] = useState<TodaySettingsDataType | null>(null)

    const [debug, setDebug] = useState(false)
    const [showFirstUse, setShowFirstUse] = useState(false)
    const [showCustomWaterIntakeModal, setShowCustomWaterIntakeModal] = useState(false)
    const [showEditItemModal, setShowEditItemModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showSettingsConfirmModal, setShowSettingsConfirmModal] = useState(false)

    const [percent, setPercent] = useState(0)
    const [waterIntake, setWaterIntake] = useState(0)
    const [adequateIntake, setAdequateIntake] = useState(0)

    // Data refresh
    const refreshData = async (): Promise<boolean> => {
        const data = await storage.getSafeData()
        if (!data) return false

        // check if daily record exists, if not, create it
        const hasToday = await storage.hasTodayRecord(data)
        if (!hasToday) await storage.createRecord(new Date())

        setData(data as StorageType)
        return true
    }

    // check if data is valid
    // if not, show first use screen
    const checkData = async () => {
        log.info('checando dados...', 'validation')
        if (!storage) {
            log.warn('não há storage, mostrando tela de primeiro uso', 'validation')
            setShowFirstUse(true)
            return
        }

        const refresh = await refreshData()
        if (!refresh) {
            log.warn('não há dados, mostrando tela de primeiro uso', 'validation')
            setShowFirstUse(true)
            return
        }

        log.info('há dados, mostrando tela principal e setando state...', 'validation')
        setShowFirstUse(false)
    }

    useEffect(() => {
        // dayjs setup
        dayjs.extend(relativeTime)
        dayjs.locale(i18n.language.toLowerCase())

        // debug modal
        if (import.meta.env.DEV) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault()
                    setDebug((prev) => !prev)
                }
            })
        }

        ;(async () => {
            await checkData()
        })()
    }, [])

    // on data change effect
    useEffect(() => {
        log.info('checando dados...', 'data')
        if (!data) {
            log.info('dados inexistentes, retornando...', 'data')
            return
        }

        const isValid = storage.isDataValid(data)
        // if data is invalid, clear data and reload page
        if (!isValid) {
            log.info('dados inválidos, limpando dados e recarregando página.', 'data')
            storage.clearData()
            setShowFirstUse(true)
        }

        // set custom containers
        const { containers } = data.settings
        setContainers(containers)
        ;(async () => {
            const waterIntake = await storage.calculateTodayWaterIntake()
            setWaterIntake(waterIntake)

            const { items, settings } = await storage.getTodayRecord()
            if (!items || !settings) return

            const { age, weight } = settings
            const adequateIntake = getAdequateIntake(age, weight)

            // set adequate intake
            setAdequateIntake(adequateIntake)

            // sort items by date
            setTodayRecords(
                items.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
            )

            // calculate percent
            const percent = Number(((waterIntake / adequateIntake) * 100).toFixed(0))
            setPercent(percent)
        })()
    }, [data])

    const handleSetFirstSettings = async (data: StorageType) => {
        await storage.setData(data)
        await checkData()
    }

    // first use screen
    if (showFirstUse)
        return (
            <main>
                <FirstUsePopup onSaveSettings={handleSetFirstSettings} />
            </main>
        )
    else if (!data) return null

    const { age, weight } = data.settings

    // debug data (for the debug modal)
    const dataList = [
        ['age', age],
        ['weight', weight],
        ['adequate intake', `${adequateIntake} ml`],
    ]

    const handleAddWaterIntake = async (type: ItemsType, quantity?: number, label?: string) => {
        log.info(`adicionando água; tipo: ${type}, ml: ${quantity}, label: ${label}`)
        await storage.addItem({
            type,
            quantity,
            label,
        })
        await checkData()
    }

    const handleAddCustomContainer = async (quantity: number, label?: string) => {
        log.info(`adicionando container customizado; ml: ${quantity}, label: ${label}`)
        await storage.addContainer(quantity, label)
        await handleAddWaterIntake('custom', quantity, label)
    }

    const handleItemDelete = async (id: string) => {
        log.info(`deletando item ${id}`)
        await storage.deleteItem(id)
        await checkData()
    }

    const handleItemEdit = async (id: string, edit: EditChangesType) => {
        log.info(`editando item ${id}; edit: ${JSON.stringify(edit)}`)
        await storage.editItem(id, edit)
        await checkData()
    }

    const handleOpenItemEditModal = async (id: string) => {
        log.info(`editando item ${id}`)

        const item = await storage.getItemById(id)
        if (!item) return

        if (item.type === 'custom') {
            setItemEditData({
                id: item.id,
                type: item.type,
                quantity: item.quantity,
                label: item.label,
            })
        } else {
            setItemEditData({
                id: item.id,
                type: item.type,
            })
        }

        setShowEditItemModal(true)
    }

    const getParsedSettings = async () => {
        const settings = await storage.getCurrentSettings()
        if (!settings) return null

        const { age, weight, containers } = settings
        return {
            age,
            weight,
            containers,
        }
    }

    const handleOpenSettingsModal = async () => {
        const settings = await getParsedSettings()
        if (!settings) return

        const { age, weight, containers } = settings
        setSettingsData({
            age,
            weight,
            containers,
        })
        setShowSettingsModal(true)
    }

    const handleSaveSettings = async (settings: SettingsDataType, ageWeightChanged?: boolean) => {
        const ogSettings = await getParsedSettings()
        if (!ogSettings) return

        // check if nothing changed
        if (JSON.stringify(ogSettings) === JSON.stringify(settings)) return

        await storage.setSettings(settings)
        await checkData()

        if (ageWeightChanged) {
            setAgeWeightToEdit({
                age: settings.age,
                weight: settings.weight,
            })
            setTimeout(() => setShowSettingsConfirmModal(true), 300)
        }
    }

    const handleSettingsConfirm = async () => {
        if (!ageWeightToEdit) return

        await storage.setTodaySettings(ageWeightToEdit)
        setShowSettingsConfirmModal(false)
        setAgeWeightToEdit(null)

        await checkData()
    }

    return (
        <>
            {/* debug modal */}
            {debug && import.meta.env.DEV && (
                <Debug>
                    <div className='my-5'>
                        <h1 className='font-white font-semibold text-xl'>Dados</h1>
                        <div className='my-2'>
                            {dataList.map((x) => {
                                return (
                                    <p className='text-zinc-300' key={x[0]}>
                                        <span className='text-white'>{x[0]}:</span> {x[1]}
                                    </p>
                                )
                            })}
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1 className='font-white font-semibold text-xl'>JSON</h1>
                        <pre className='text-zinc-300 font-mono text-sm'>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </Debug>
            )}
            {/* confirm modal for the `SettingsModal` */}
            <ConfirmModal
                title={t('recalculateTitle')}
                show={showSettingsConfirmModal}
                onConfirm={handleSettingsConfirm}
                onCancel={() => setShowSettingsConfirmModal(false)}
                onModalClose={() => setShowSettingsConfirmModal(false)}
            >
                {t('recalculateText')}
            </ConfirmModal>
            {/* config modal */}
            <SettingsModal
                data={settingsData}
                show={showSettingsModal}
                onSave={handleSaveSettings}
                onModalClose={() => setShowSettingsModal(false)}
            />
            {/* add new record modal */}
            <CustomWaterIntakeModal
                onSaveCustomContainer={handleAddCustomContainer}
                onAddWaterIntake={(quantity: number) => handleAddWaterIntake('custom', quantity)}
                show={showCustomWaterIntakeModal}
                onModalClose={() => setShowCustomWaterIntakeModal(false)}
            />
            {/* edit record modal */}
            <EditItemModal
                data={itemEditData}
                show={showEditItemModal}
                onEdit={handleItemEdit}
                onModalClose={() => setShowEditItemModal(false)}
            />
            <NavBar>
                <Button ghost onClick={handleOpenSettingsModal} title='Configurações'>
                    <GearSix size={24} weight='bold' />
                </Button>
            </NavBar>
            <main className='max-w-screen-md mx-auto px-4 py-6 flex flex-col gap-6'>
                <section className='flex flex-col gap-4 text-center'>
                    <p className='font-semibold text-lg text-zinc-200 uppercase'>
                        {t('adequateIntake')}
                    </p>
                    <div className='mx-auto w-full max-w-[300px] select-none'>
                        <CircularProgressbarWithChildren
                            value={clamp(percent, 0, 100)}
                            strokeWidth={5}
                            styles={buildStyles({
                                strokeLinecap: 'round',
                                pathTransitionDuration: 0.5,
                                textColor: colors.blue[300],
                                trailColor: colors.zinc[700],
                                pathColor: colors.blue[300],
                            })}
                        >
                            <div className='flex items-center gap-2'>
                                <div className='relative group'>
                                    <h1 className='text-6xl font-bold text-blue-100'>
                                        {percent <= 999 ? percent : '+999'}%
                                    </h1>
                                    <span className='absolute -bottom-3 left-0 text-sm font-mono text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        {waterIntake}/{adequateIntake}ml
                                    </span>
                                </div>
                                <WaterIntakeDropdown
                                    containers={containers}
                                    onAdd={handleAddWaterIntake}
                                    onOpenModal={() => setShowCustomWaterIntakeModal(true)}
                                />
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>

                    <p className='text-sm text-zinc-400'>
                        {adequateIntake - waterIntake > 0 ? (
                            <>
                                {t('letsGo').replaceAll(
                                    '{ml}',
                                    (adequateIntake - waterIntake).toString()
                                )}
                            </>
                        ) : (
                            <>{t('youGotIt')}</>
                        )}
                    </p>
                </section>
                <section className='flex flex-col gap-2'>
                    <h1 className='text-xl font-bold'>{t('history')}</h1>
                    <div className='flex flex-col gap-2'>
                        {todayRecords.length ? (
                            todayRecords.map((x) => {
                                return (
                                    <RecordCard
                                        key={x.id}
                                        item={x}
                                        onDelete={handleItemDelete}
                                        onEdit={handleOpenItemEditModal}
                                    />
                                )
                            })
                        ) : (
                            <EmptyRecords />
                        )}
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <a
                            href='#'
                            className='block text-sm text-zinc-400 underline hover:text-white transition-colors'
                        >
                            {t('viewPreviousRecords')}
                        </a>
                    </div>
                </section>
            </main>
        </>
    )
}

export default App
