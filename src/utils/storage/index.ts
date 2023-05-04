import localforage from 'localforage'
import { StorageSchema, StorageType } from './schema'

export function useStorage() {
    return new Storage()
}

interface RecordItem {
    type: StorageType['records'][0]['items'][0]['type']
    ml?: number
    createdAt?: string
}

export class Storage {
    constructor(doNotConfigLocalForage?: boolean) {
        if (!doNotConfigLocalForage)
            localforage.config({
                driver: localforage.LOCALSTORAGE,
                name: 'hidrata-app',
            })
    }

    isDataValid(data: any) {
        try {
            return StorageSchema.safeParse(data).success
        } catch {
            return false
        }
    }

    async clearData() {
        return await localforage.removeItem('data')
    }

    async getData(): Promise<any> {
        try {
            return await localforage.getItem('data')
        } catch {
            return null
        }
    }

    async getSafeData(): Promise<StorageType | null> {
        const data = await this.getData()
        if (!data) return null
        try {
            return StorageSchema.parse(data)
        } catch (err) {
            return null
        }
    }

    async setData(data: StorageType) {
        const parsed = StorageSchema.parse(data)
        await localforage.setItem('data', parsed)
    }

    private async dataMethodHandler(data: any, method: (data: StorageType) => any): Promise<any> {
        return new Promise(async (resolve) => {
            if (data && this.isDataValid(data)) return resolve(method(data))
            const _data = await this.getSafeData()
            if (!_data) return resolve(null)
            return resolve(method(_data))
        })
    }

    async getRecordsFrom(date: Date, data?: StorageType) {
        return await this.dataMethodHandler(data, (data) => {
            const dateStr = date.toISOString().split('T')[0]
            return data.records.filter((x) => x.date === dateStr)
        })
    }

    async getTodayRecordItems(data?: StorageType): Promise<StorageType['records'][0]['items']> {
        return await this.dataMethodHandler(data, async (data) => {
            const today = new Date().toISOString().split('T')[0]
            const record = data.records.find((x) => x.date === today)
            if (!record) return []
            return record.items
        })
    }

    async hasTodayRecord(data?: StorageType) {
        return await this.dataMethodHandler(data, (data) => {
            const today = new Date().toISOString().split('T')[0]
            return data.records.some((x) => x.date === today)
        })
    }

    async getCurrentSettings(data?: StorageType): Promise<StorageType['settings'] | null> {
        return await this.dataMethodHandler(data, (data) => {
            return data.settings
        })
    }

    async createRecord(date: Date) {
        const data = await this.getSafeData()
        if (!data) return

        const settings = await this.getCurrentSettings(data)
        if (!settings) return

        const record = {
            date: date.toISOString().split('T')[0],
            settings,
            items: [],
        }

        data.records.push(record)
        await this.setData(data)
    }

    async addItem(item: RecordItem) {
        const data = await this.getSafeData()
        if (!data) return
        const record: StorageType['records'][0]['items'][0] = {
            id: crypto.randomUUID(),
            createdAt: item.createdAt ?? new Date().toISOString(),
            ...item,
        }
        const today = new Date().toISOString().split('T')[0]
        const todayRecord = data.records.find((x) => x.date === today)
        if (!todayRecord) return
        todayRecord.items.push(record)
        await this.setData(data)
    }

    async deleteItem(id: string) {
        const data = await this.getSafeData()
        if (!data) return
        const today = new Date().toISOString().split('T')[0]
        const todayRecord = data.records.find((x) => x.date === today)
        if (!todayRecord) return
        todayRecord.items = todayRecord.items.filter((x) => x.id !== id)
        await this.setData(data)
    }
}
