export const LSKEY = {
    TEMPERATURE: 'temperatureData',
    CONFIG: 'config',
    CONTAINERS: 'containers',
    DATA: 'data',
    LANG: 'lang',
}

export const removeAllData = () => {
    const values = Object.values(LSKEY)
    values.forEach((key) => localStorage.removeItem(key))
}
