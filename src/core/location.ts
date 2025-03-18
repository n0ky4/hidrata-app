import { produce } from 'immer'
import { useCallback, useRef, useState } from 'react'

export interface IpData {
    ip: string
    network: string
    version: string
    city: string
    region: string
    region_code: string
    country: string
    country_name: string
    country_code: string
    country_code_iso3: string
    country_capital: string
    country_tld: string
    continent_code: string
    in_eu: boolean
    postal: string
    latitude: number
    longitude: number
    timezone: string
    utc_offset: string
    country_calling_code: string
    currency: string
    currency_name: string
    languages: string
    country_area: number
    country_population: number
    asn: string
    org: string
}

export interface Coords {
    latitude: number
    longitude: number
}

export interface GetCoordsInfo {
    coords: Coords
    place: string
}

const getLocationValue = (data: IpData) => {
    return data ? `${data.city}, ${data?.region || data.region_code}, ${data.country}` : ''
}

const fetchLocation = (): Promise<IpData> => {
    return new Promise((resolve, reject) => {
        fetch(`https://ipapi.co/json`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || !data.city) {
                    console.error(data)
                    return reject('No data received')
                }
                return resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

const fetchCoords = (query: string, lang?: string): Promise<GetCoordsInfo> => {
    return new Promise((resolve, reject) => {
        let options: undefined | object

        if (lang) {
            options = {
                headers: {
                    'Accept-Language': `${lang},${lang.split('-')[0]}`,
                },
            }
        }

        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`, options)
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.length === 0) {
                    console.log(data)
                    return reject('No data received')
                }

                const latitude = parseFloat(Number(data[0].lat).toFixed(4))
                const longitude = parseFloat(Number(data[0].lon).toFixed(4))

                if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude))
                    return reject('Invalid coordinates')

                return resolve({
                    coords: { latitude, longitude },
                    place: data[0].display_name,
                })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export interface LocationState {
    show: boolean
    inputValue: string
    placeName: string | null
    coords: Coords | null
}

interface LocationManagementOptions {
    lang: string
    defaultInputValue?: string
}

// location management hook
function useLocationManagement({ lang, defaultInputValue }: LocationManagementOptions) {
    const [enabled, setEnabled] = useState(false)
    const [canContinue, setCanContinue] = useState(true)
    const locationDetected = useRef<IpData | null>(null)
    const [locState, setLocState] = useState<LocationState>({
        show: false,
        inputValue: defaultInputValue || '',
        placeName: null,
        coords: null,
    })

    const updateLocationState = useCallback((updates: Partial<LocationState>) => {
        setLocState((prev) =>
            produce(prev, (draft) => {
                Object.assign(draft, updates)
            })
        )
    }, [])

    const fetchLocationData = useCallback(async () => {
        try {
            const data = await location.fetchLocation()
            const locVal = location.getLocationValue(data)
            locationDetected.current = data

            const { latitude, longitude } = data

            updateLocationState({
                show: true,
                inputValue: locVal,
                placeName: locVal,
                coords: { latitude, longitude },
            })
            setCanContinue(true)
        } catch (err) {
            console.error(err)
            updateLocationState({
                show: false,
                inputValue: '',
                placeName: null,
                coords: null,
            })
            setCanContinue(false)
        }
    }, [updateLocationState])

    const handleLocationToggle = useCallback(
        (checked: boolean) => {
            setEnabled(checked)

            if (checked) {
                if (!locationDetected.current) {
                    fetchLocationData()
                } else {
                    updateLocationState({ show: true })
                }
            } else {
                updateLocationState({ show: false })
            }
        },
        [fetchLocationData, updateLocationState]
    )

    const fetchCustomCoords = useCallback(async () => {
        const data = locationDetected.current
        const detectedLoc = data ? location.getLocationValue(data) : null

        if (detectedLoc && locState.inputValue === detectedLoc) {
            const { latitude, longitude } = data || {}
            if (!latitude || !longitude) throw new Error('No coordinates found')

            updateLocationState({
                show: true,
                inputValue: detectedLoc,
                placeName: detectedLoc,
                coords: { latitude, longitude },
            })
            setCanContinue(true)
            return
        }

        try {
            const { coords, place } = await location.fetchCoords(locState.inputValue, lang)
            updateLocationState({
                show: true,
                inputValue: place,
                placeName: place,
                coords,
            })
            setCanContinue(true)
        } catch (error) {
            console.error('Failed to fetch coordinates', error)
            setCanContinue(false)
        }
    }, [lang, locState.inputValue, updateLocationState])

    const handleLocationChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            updateLocationState({ inputValue: value })
            setCanContinue(false)
        },
        [updateLocationState]
    )

    return {
        enabled,
        canContinue,
        locState,
        handleLocationToggle,
        handleLocationChange,
        fetchCustomCoords,
    }
}

export const location = {
    fetchLocation,
    getLocationValue,
    fetchCoords,
    useLocationManagement,
}
