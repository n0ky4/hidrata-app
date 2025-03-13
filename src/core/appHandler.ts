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

    /**
     * Get the current date as a string
     * @returns string
     */
    const getDateId = () => new Date().toISOString().split('T')[0]

    /**
     * Get the records for the current day
     * @param histories
     * @returns Record[]
     */
    const getDailyRecords = (histories: HistoryEntry[]): Record[] => {
        if (!histories.length) return []

        const dateId = getDateId()
        const found = histories.find((x) => x.date === dateId)?.records

        if (!found) return []

        // sort by descending time
        return found.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    }

    /**
     * Get the total volume consumed for the day based on the provided records
     * @param records
     * @returns number
     */
    const getDailyConsumed = (records: Record[]): number => {
        return records.reduce((acc, record) => acc + record.volume, 0)
    }

    /**
     * Get the percentage of drank water compared to the recommended amount
     * @param drank
     * @param recommended
     * @returns number
     */
    const getPercentage = (drank: number, recommended: number): number => {
        if (!drank || !recommended) return 0
        const percentage = Math.max(0, (drank / recommended) * 100)
        return percentage || 0
    }

    /**
     * Ensure that a history entry exists for the current day
     * @param dateId
     */
    const ensureHistory = (dateId: string) => {
        if (!hasHistory(dateId)) {
            addHistoryEntry({
                consumed: 0,
                date: dateId,
                goal: recommended,
                records: [],
                weather: weatherData?.condition || 'favorable',
            })
        }
    }

    /**
     * Add a default container to the current day
     * @param type DefaultContainer
     */
    const addDefaultContainerRecord = (type: DefaultContainer) => {
        const dateId = getDateId()
        ensureHistory(dateId)

        const volume = getContainer(type)
        console.log('add', volume)

        addRecord(dateId, {
            volume,
            time: new Date().toISOString(),
        })
    }

    /**
     * Add a record with a custom volume to the current day
     * @param volume
     */
    const addVolumeRecord = (volume: number) => {
        const dateId = getDateId()
        ensureHistory(dateId)

        addRecord(dateId, {
            volume,
            time: new Date().toISOString(),
        })
    }

    /**
     * Add a record with a custom container to the current day
     * @param containerId
     */
    const addContainerRecord = (containerId: string, volume: number) => {
        const dateId = getDateId()
        ensureHistory(dateId)

        addRecord(dateId, {
            volume,
            time: new Date().toISOString(),
            containerId,
        })
    }

    const requestOpenAddWaterModal = () => setShowAddWaterModal(true)

    return {
        getDailyRecords,
        getDailyConsumed,
        getPercentage,
        //
        addDefaultContainerRecord,
        addVolumeRecord,
        addContainerRecord,
        removeRecord,
        //
        requestOpenAddWaterModal,
    }
}
