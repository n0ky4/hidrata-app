import localforage from 'localforage'
import { StorageSchema, StorageType } from './schema'

export function useStorage() {
    return new Storage()
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
        return StorageSchema.safeParse(data).success
    }

    async clearData() {
        return await localforage.removeItem('data')
    }

    async getData(): Promise<any> {
        return await localforage.getItem('data')
    }

    async getSafeData(): Promise<StorageType | null> {
        const data = await this.getData()
        if (!data) return null
        return StorageSchema.parse(data)
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
}
