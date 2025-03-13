import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Data, dataSchema, HistoryEntry, Record, RecordCreateData } from '../schemas/data.schema'
import { LSKEY } from '../util/localStorage'
import { shortId } from '../util/nanoid'

interface State {
    data: Data | null
}

interface Actions {
    init: () => void
    setData: (data: Data) => void
    updateData: (data: Partial<Data>) => void

    historyArrayModifier: (operation: (history: HistoryEntry[]) => HistoryEntry[]) => void

    hasHistory: (date: string) => boolean
    addHistoryEntry: (entry: HistoryEntry) => void
    updateHistoryEntry: (entry: HistoryEntry) => void
    removeHistoryEntry: (date: string) => void

    recordsArrayModifier: (date: string, operation: (records: Record[]) => Record[]) => void

    addRecord: (date: string, record: RecordCreateData) => void
    removeRecord: (recordId: string) => void
}

type DataStore = State & Actions

export const useData = create(
    persist<DataStore>(
        (set, get) => ({
            data: null,
            init: () => {
                const parsed = dataSchema.parse({})
                set({ data: parsed })
            },
            setData: (data: Data) => {
                set({ data })
            },
            updateData: (data: Partial<Data>) => {
                set((state) => {
                    if (!state.data) return state
                    return { data: { ...state.data, ...data } }
                })
            },

            historyArrayModifier: (operation: (history: HistoryEntry[]) => HistoryEntry[]) =>
                set((state) => {
                    if (!state.data) return state

                    return {
                        data: {
                            ...state.data,
                            consumption: {
                                ...state.data.consumption,
                                history: operation(state.data.consumption.history),
                            },
                        },
                    }
                }),

            hasHistory: (date: string) => {
                return !!get().data?.consumption.history.find((x) => x.date === date)
            },

            addHistoryEntry: (entry: HistoryEntry) =>
                get().historyArrayModifier((history) => [...history, entry]),

            updateHistoryEntry: (entry: HistoryEntry) =>
                get().historyArrayModifier((history) =>
                    history.map((h) => (h.date === entry.date ? entry : h))
                ),

            removeHistoryEntry: (date: string) =>
                get().historyArrayModifier((history) => history.filter((h) => h.date !== date)),

            recordsArrayModifier: (date: string, operation: (records: Record[]) => Record[]) =>
                set((state) => {
                    if (!state.data) return state

                    return {
                        data: {
                            ...state.data,
                            consumption: {
                                ...state.data.consumption,
                                history: state.data.consumption.history.map((h) =>
                                    h.date === date ? { ...h, records: operation(h.records) } : h
                                ),
                            },
                        },
                    }
                }),

            addRecord: (date: string, record: RecordCreateData) =>
                get().recordsArrayModifier(date, (records) => [
                    ...records,
                    {
                        id: shortId(),
                        ...record,
                    },
                ]),

            removeRecord: (recordId: string) => {
                const records = get().data?.consumption.history.flatMap((x) => x.records) || []
                const record = records.find((x) => x.id === recordId)
                if (!record) return

                const recordDateId = record.time.split('T')[0]

                get().recordsArrayModifier(recordDateId, (records) =>
                    records.filter((x) => x.id !== record.id)
                )
            },
        }),
        {
            name: LSKEY.DATA,
            version: 1,
        }
    )
)
