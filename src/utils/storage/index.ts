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

    async hasTodayRecord() {
        const data = await this.getSafeData()
        if (!data || !data.records) return false
        const today = new Date().toISOString().split('T')[0]
        return data.records.some((x) => x.date === today)
    }
}
