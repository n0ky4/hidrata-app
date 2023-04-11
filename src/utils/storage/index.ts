import localforage from 'localforage'
import { StorageSchema, StorageType } from './schema'

export class Storage {
    constructor() {}

    async getData() {
        return await localforage.getItem('data')
    }

    async setData(data: StorageType) {
        const parsed = StorageSchema.parse(data)
        await localforage.setItem('data', parsed)
    }
}
