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

    async getData() {
        return await localforage.getItem('data')
    }

    async setData(data: StorageType) {
        const parsed = StorageSchema.parse(data)
        await localforage.setItem('data', parsed)
    }
}
