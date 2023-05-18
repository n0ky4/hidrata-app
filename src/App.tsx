import { GearSix } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import colors from 'tailwindcss/colors'
import Button from './components/Button'
import CustomWaterIntakeModal from './components/CustomWaterIntakeModal'
import { Debug } from './components/Debug'
import EditItemModal, { ItemEditDataType } from './components/EditItemModal'
import FirstUsePopup from './components/FirstUsePopup'
import { RecordCard } from './components/RecordCard'
import { WaterIntakeDropdown } from './components/WaterIntakeDropdown'
import { clamp, getRecommendedWaterIntake } from './utils/helpers'
import log from './utils/log'
import { EditChangesType, useStorage } from './utils/storage'
import { ContainerType, ItemsType, RecordItemType, StorageType } from './utils/storage/schema'

function App() {
    const storage = useStorage()
    const [data, setData] = useState<StorageType | null>(null)
    const [debug, setDebug] = useState(false)
    const [showFirstUse, setShowFirstUse] = useState(false)
    const [todayRecords, setTodayRecords] = useState<RecordItemType>([])
    const [percent, setPercent] = useState(0)
    const [waterIntake, setWaterIntake] = useState(0)
    const [recommendedWater, setRecommendedWater] = useState(0)
    const [showCustomWaterIntakeModal, setShowCustomWaterIntakeModal] = useState(false)
    const [containers, setContainers] = useState<ContainerType>([])
    const [itemEditData, setItemEditData] = useState<ItemEditDataType | null>(null)
    const [showEditItemModal, setShowEditItemModal] = useState(false)

    // Data refresh
    const refreshData = async (): Promise<boolean> => {
        const data = await storage.getSafeData()
        if (!data) return false

        // Checar se o registro diário existe, se não existir, criar
        const hasToday = await storage.hasTodayRecord(data)
        if (!hasToday) await storage.createRecord(new Date())

        // Setar o state
        setData(data as StorageType)
        return true
    }

    // Validação de dados, detecta se os dados são válidos.
    // Caso não sejam, mostra o popup de primeiro uso.
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
        // Setup do dayjs
        dayjs.extend(relativeTime)
        dayjs.locale('pt-BR')

        // Atalho do modal de debug
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

    // Hook de update dos dados (data), para atualizar outros states
    useEffect(() => {
        log.info('checando dados...', 'data')
        if (!data) {
            log.info('dados inexistentes, retornando...', 'data')
            return
        }

        const isValid = storage.isDataValid(data)
        if (!isValid) {
            log.info('dados inválidos, limpando dados e recarregando página.', 'data')
            storage.clearData()
            window.location.reload()
        }

        const { age, weight, containers } = data.settings
        setContainers(containers)

        const dailyWater = getRecommendedWaterIntake(age, weight)
        setRecommendedWater(dailyWater)
        ;(async () => {
            const waterIntake = await storage.calculateTodayWaterIntake()
            setWaterIntake(waterIntake)

            const items = await storage.getTodayRecordItems(data)
            if (!items) return

            // Ordenar por data de criação, do mais recente para o mais antigo
            setTodayRecords(
                items.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
            )

            // Calcular porcentagem com decimais
            const percent = Number(((waterIntake / dailyWater) * 100).toFixed(0))
            setPercent(percent)
        })()
    }, [data])

    // Popup de primeiro uso caso o state seja true
    if (showFirstUse)
        return (
            <main>
                <FirstUsePopup storage={storage} />
            </main>
        )
    else if (!data) return null

    const { age, weight } = data.settings

    // Dados do modal de debug
    const dataList = [
        ['Idade', age],
        ['Peso', weight],
        ['Qtd. Água Diária', `${recommendedWater} ml`],
    ]

    // Handler para adicionar um registro de ingestão de água
    const handleAddWaterIntake = async (type: ItemsType, quantity?: number, label?: string) => {
        log.info(`adicionando água; tipo: ${type}, ml: ${quantity}, label: ${label}`)
        await storage.addItem({
            type,
            quantity,
            label,
        })
        await checkData()
    }

    // Handler para adicionar um recipiente personalizado
    const handleAddCustomContainer = async (quantity: number, label?: string) => {
        log.info(`adicionando container customizado; ml: ${quantity}, label: ${label}`)
        await storage.addContainer(quantity, label)
        await handleAddWaterIntake('custom', quantity, label)
    }

    // Handler para deletar um registro de ingestão de água
    const handleItemDelete = async (id: string) => {
        log.info(`deletando item ${id}`)
        await storage.deleteItem(id)
        await checkData()
    }

    // Handler para editar um registro de ingestão de água
    const handleItemEdit = async (id: string, edit: EditChangesType) => {
        log.info(`editando item ${id}; edit: ${JSON.stringify(edit)}`)
        await storage.editItem(id, edit)
        await checkData()
    }

    // Handler para abrir o modal de editar um registro. Aqui,
    // pegamos o id do registro, retornamos os dados e setamos
    // o state "itemEditData", que é usado no modal de edição.
    const handleOpenItemEditModal = async (id: string) => {
        log.info(`editando item ${id}`)

        const item = await storage.getItemById(id)
        if (!item) return

        if (item.type === 'custom') {
            // Se o tipo do registro for "custom", adicionar "quantity" e "label"
            // (propriedades típicas de um registro "custom")
            setItemEditData({
                id: item.id,
                type: item.type,
                quantity: item.quantity,
                label: item.label,
            })
        } else {
            // Caso não for custom, apenas adicionar o id e o tipo.
            setItemEditData({
                id: item.id,
                type: item.type,
            })
        }

        // Abrir o modal
        setShowEditItemModal(true)
    }

    return (
        <>
            {/* Modal de debug */}
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
            {/* Modal para adicionar um registro */}
            <CustomWaterIntakeModal
                onSaveCustomContainer={handleAddCustomContainer}
                onAddWaterIntake={(quantity: number) => handleAddWaterIntake('custom', quantity)}
                show={showCustomWaterIntakeModal}
                onModalClose={() => setShowCustomWaterIntakeModal(false)}
            />
            {/* Modal para editar um registro */}
            <EditItemModal
                data={itemEditData}
                show={showEditItemModal}
                onEdit={handleItemEdit}
                onModalClose={() => setShowEditItemModal(false)}
            />
            <nav>
                <div className='max-w-screen-md mx-auto p-4 border-b-2 flex items-center justify-between border-zinc-700'>
                    <h1 className='text-2xl font-white font-semibold'>hidrata-app</h1>
                    <div className='flex items-center gap-2'>
                        <Button ghost>
                            <GearSix size={24} weight='bold' />
                        </Button>
                    </div>
                </div>
            </nav>
            <main className='max-w-screen-md mx-auto px-4 py-6 flex flex-col gap-6'>
                <section className='flex flex-col gap-4 text-center'>
                    <p className='font-semibold text-lg text-zinc-200 uppercase'>
                        Consumo Diário de Água
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
                                        {/* Mostra a porcentagem. Se for maior que 999, mostra +999 */}
                                        {percent <= 999 ? percent : '+999'}%
                                    </h1>
                                    <span className='absolute -bottom-3 left-0 text-sm font-mono text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        {waterIntake}/{recommendedWater}ml
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
                        {recommendedWater - waterIntake > 0 ? (
                            <>
                                Vamos lá! Ainda faltam <b>{recommendedWater - waterIntake} ml</b> de
                                água💧
                            </>
                        ) : (
                            <>
                                Parabéns! Você ingeriu a quantidade de água recomendada de hoje 😊👏
                            </>
                        )}
                    </p>
                </section>
                <section className='flex flex-col gap-2'>
                    <h1 className='text-xl font-bold'>Histórico</h1>
                    <div className='flex flex-col gap-2'>
                        {todayRecords.length ? (
                            // Caso tenha registros
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
                            // Caso não tenha registros
                            <span className='text-zinc-400'>
                                Não há nenhum registro de hoje... Que tal começar tomando um copo
                                d'água? 😊💧
                            </span>
                        )}
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <a
                            href='#'
                            className='block text-sm text-zinc-400 underline hover:text-white transition-colors'
                        >
                            ver registros anteriores
                        </a>
                    </div>
                </section>
            </main>
        </>
    )
}

export default App
