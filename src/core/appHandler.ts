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
        const percentage = (drank / recommended) * 100
        return Math.max(0, percentage)
    }

    const onAdd = (type: DefaultContainer | 'custom') => {
        if (type === 'custom') {
            // setShowAddWaterModal(true)
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

    const onRemove = (id: string) => {
        console.log('remove', id)
        removeRecord(id)
    }

    return {
        getDailyRecords,
        getDailyConsumed,
        getPercentage,
        onAdd,
        onRemove,
    }
}
