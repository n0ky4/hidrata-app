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

const getCoords = (query: string): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.length === 0) {
                    console.error(data)
                    return reject('No data received')
                }

                const formattedLat = parseFloat(Number(data[0].lat).toFixed(4))
                const formattedLon = parseFloat(Number(data[0].lon).toFixed(4))

                if (!formattedLat || !formattedLon || isNaN(formattedLat) || isNaN(formattedLon))
                    return reject('Invalid coordinates')

                return resolve({ lat: formattedLat, lon: formattedLon })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export const location = {
    fetchLocation,
    getLocationValue,
    getCoords,
}
