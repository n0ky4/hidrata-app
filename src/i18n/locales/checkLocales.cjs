const fs = require('fs')
const path = require('path')

const BASE_LOCALE = 'en-US.json'

function getObjectPaths(obj, prefix = '') {
    let paths = []

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newPath = prefix ? `${prefix}.${key}` : key
            paths.push(newPath)

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                paths = paths.concat(getObjectPaths(obj[key], newPath))
            }
        }
    }

    return paths
}

const getFiles = () => {
    const files = fs.readdirSync(path.resolve(__dirname, './'))
    return files.filter((file) => file.endsWith('.json') && file !== BASE_LOCALE)
}

const getBaseLocale = () => {
    return require(path.resolve(__dirname, BASE_LOCALE))
}

function check() {
    const files = getFiles()
    console.log(`Checking ${files.length} files`)

    const baseLocale = getBaseLocale()
    const basePaths = getObjectPaths(baseLocale)

    for (const file of files) {
        console.log(`Checking ${file}`)
        const locale = require(path.resolve(__dirname, file))
        const localePaths = getObjectPaths(locale)

        for (const path of basePaths) {
            if (!localePaths.includes(path)) {
                console.error(`Path ${path} not found in ${file}`)
            }
        }
    }

    console.log('Done')
}

check()
