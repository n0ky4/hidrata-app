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

export const location = {
    fetchLocation,
    getLocationValue,
    fetchCoords,
}
