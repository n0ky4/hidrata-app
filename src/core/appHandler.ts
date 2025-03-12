import { HistoryEntry, Record } from '../schemas/data.schema'
import { useAppStore } from '../stores/app.store'
import { useData } from '../stores/data.store'
import { DefaultContainer, getContainer } from './defaultContainers'

export function useAppHandler() {
    const hasHistory = useData((state) => state.hasHistory)
    const addHistoryEntry = useData((state) => state.addHistoryEntry)
    const addRecord = useData((state) => state.addRecord)
    const removeRecord = useData((state) => state.removeRecord)
    const recommended = useAppStore((state) => state.water.recommended)
    const weatherData = useAppStore((state) => state.weatherData)
    const setShowAddWaterModal = useAppStore((state) => state.setShowAddWaterModal)

    const getDateId = () => new Date().toISOString().split('T')[0]

    const getDailyRecords = (histories: HistoryEntry[]): Record[] => {
        if (!histories.length) return []
        const dateId = getDateId()
        return histories.find((x) => x.date === dateId)?.records || []
    }

    const getDailyConsumed = (records: Record[]): number => {
        return records.reduce((acc, record) => acc + record.amount, 0)
    }

    const getPercentage = (drank: number, recommended: number): number => {
        if (!drank || !recommended) return 0
        const percentage = Math.max(0, (drank / recommended) * 100)
        return percentage || 0
    }

    const onAddRecord = (type: DefaultContainer | 'custom') => {
        if (type === 'custom') {
            setShowAddWaterModal(true)
            return
        }

        const dateId = new Date().toISOString().split('T')[0]

        if (!hasHistory(dateId)) {
            addHistoryEntry({
                consumed: 0,
                date: dateId,
                goal: recommended,
                records: [],
                weather: weatherData?.condition || 'favorable',
            })
        }

        const amount = getContainer(type)
        console.log('add', amount)

        addRecord(dateId, {
            amount,
            time: new Date().toISOString(),
        })
    }

    const onRemoveRecord = (id: string) => {
        console.log('remove', id)
        removeRecord(id)
    }

    return {
        getDailyRecords,
        getDailyConsumed,
        getPercentage,
        onAddRecord,
        onRemoveRecord,
    }
}
