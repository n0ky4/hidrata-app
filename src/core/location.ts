import { produce } from 'immer'
import { useCallback, useRef, useState } from 'react'

export interface IpData {
    city: string
    country: string
    lat: number
    lon: number
    region: string
    regionName: string
    status: string
}

const getLocationValue = (data: IpData) => {
    return data ? `${data.city}, ${data?.regionName || data.region}, ${data.country}` : ''
}

const fetchLocation = (lang?: string): Promise<IpData> => {
    const langArg = lang ? `?lang=${lang}` : ''
    return new Promise((resolve, reject) => {
        fetch(`http://ip-api.com/json${langArg}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.status !== 'success') {
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

export interface Coords {
    lat: number
    lon: number
}

export interface GetCoordsInfo {
    coords: Coords
    place: string
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

                const formattedLat = parseFloat(Number(data[0].lat).toFixed(4))
                const formattedLon = parseFloat(Number(data[0].lon).toFixed(4))

                if (!formattedLat || !formattedLon || isNaN(formattedLat) || isNaN(formattedLon))
                    return reject('Invalid coordinates')

                return resolve({
                    coords: { lat: formattedLat, lon: formattedLon },
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

// location management hook
function useLocationManagement(lang: string) {
    const [enabled, setEnabled] = useState(false)
    const [canContinue, setCanContinue] = useState(true)
    const locationDetected = useRef<IpData | null>(null)
    const [locState, setLocState] = useState<LocationState>({
        show: false,
        inputValue: '',
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
            const data = await location.fetchLocation(lang)
            const locVal = location.getLocationValue(data)
            locationDetected.current = data

            updateLocationState({
                show: true,
                inputValue: locVal,
                placeName: locVal,
                coords: { lat: data.lat, lon: data.lon },
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
    }, [lang, updateLocationState])

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
            const { lat, lon } = data || {}
            if (!lat || !lon) throw new Error('No coordinates found')

            updateLocationState({
                show: true,
                inputValue: detectedLoc,
                placeName: detectedLoc,
                coords: { lat, lon },
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
