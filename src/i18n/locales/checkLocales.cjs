// claude my beloved
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const BASE_LOCALE = 'en-US.json'
const LOCALES_DIR = path.resolve(__dirname, './')

// Helper to get all paths in an object with dot notation
function getObjectPaths(obj, prefix = '', paths = [], pathValues = {}) {
    Object.entries(obj).forEach(([key, value]) => {
        const newPath = prefix ? `${prefix}.${key}` : key
        paths.push(newPath)
        pathValues[newPath] = value

        if (typeof value === 'object' && value !== null) {
            getObjectPaths(value, newPath, paths, pathValues)
        }
    })

    return { paths, pathValues }
}

// Helper to get value at a specific path in an object
function getValueAtPath(obj, path) {
    return path.split('.').reduce((current, part) => current?.[part], obj)
}

// Helper to set value at a specific path in an object
function setValueAtPath(obj, path, value) {
    const parts = path.split('.')
    const lastPart = parts.pop()
    const target = parts.reduce((current, part) => {
        if (!current[part]) current[part] = {}
        return current[part]
    }, obj)

    target[lastPart] = value
    return obj
}

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Ask for confirmation
const askConfirm = async (question) => {
    return new Promise((resolve) => {
        rl.question(`${question} (y/n): `, (answer) => {
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
    })
}

// Get all locale files except the base locale
const getLocaleFiles = () => {
    return fs
        .readdirSync(LOCALES_DIR)
        .filter((file) => file.endsWith('.json') && file !== BASE_LOCALE)
}

// Get locale content for a specific file
const getLocaleContent = (file) => {
    return JSON.parse(fs.readFileSync(path.resolve(LOCALES_DIR, file), 'utf8'))
}

// Sort object keys recursively while preserving arrays
const sortObjectKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj

    if (Array.isArray(obj)) {
        return obj.map((item) => sortObjectKeys(item))
    }

    return Object.keys(obj)
        .sort()
        .reduce((sorted, key) => {
            sorted[key] = sortObjectKeys(obj[key])
            return sorted
        }, {})
}

// Save object to file
const saveLocale = (file, data) => {
    const filePath = path.resolve(LOCALES_DIR, file)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8')
    console.log(`✓ Saved ${file}`)
}

// Sort all locale files alphabetically
const sortAllFiles = async (files) => {
    const shouldSort = await askConfirm('\nWould you like to sort all locale files alphabetically?')
    if (shouldSort) {
        ;[BASE_LOCALE, ...files].forEach((file) => {
            const locale = getLocaleContent(file)
            const sortedLocale = sortObjectKeys(locale)
            saveLocale(file, sortedLocale)
        })
        console.log('✓ All locale files have been sorted alphabetically')
    }
    return shouldSort
}

// Main function
const main = async () => {
    const files = getLocaleFiles()
    console.log(`Checking ${files.length} locale files against ${BASE_LOCALE}`)

    const baseLocale = getLocaleContent(BASE_LOCALE)
    const { paths: basePaths, pathValues: basePathValues } = getObjectPaths(baseLocale)

    const missingEntries = []

    for (const file of files) {
        console.log(`\nAnalyzing ${file}...`)
        const locale = getLocaleContent(file)
        const { paths: localePaths, pathValues: localePathValues } = getObjectPaths(locale)

        const missingInLocale = basePaths.filter((path) => !localePaths.includes(path))
        if (missingInLocale.length > 0) {
            console.log(`  Found ${missingInLocale.length} keys missing in ${file}`)
            missingInLocale.forEach((path) => {
                missingEntries.push({
                    path,
                    missing: file,
                    source: BASE_LOCALE,
                    value: basePathValues[path],
                })
            })
        } else {
            console.log(`  ✓ All base keys found in ${file}`)
        }

        const missingInBase = localePaths.filter((path) => !basePaths.includes(path))
        if (missingInBase.length > 0) {
            console.log(
                `  Found ${missingInBase.length} keys in ${file} that are missing in ${BASE_LOCALE}`
            )
            missingInBase.forEach((path) => {
                missingEntries.push({
                    path,
                    missing: BASE_LOCALE,
                    source: file,
                    value: localePathValues[path],
                })
            })
        } else {
            console.log(`  ✓ No extra keys in ${file}`)
        }
    }

    if (missingEntries.length === 0) {
        console.log('\n✓ All locale files are in sync. No missing translations found.')
        await sortAllFiles(files)
        rl.close()
        return
    }

    const missingOthers = missingEntries.filter((entry) => entry.source === BASE_LOCALE)
    const missingBase = missingEntries.filter((entry) => entry.source !== BASE_LOCALE)

    if (missingOthers.length > 0) {
        console.log(
            `\n[${missingOthers.length}] Keys found in ${BASE_LOCALE} but missing in other locales:`
        )
        const byFile = missingOthers.reduce((acc, entry) => {
            acc[entry.missing] = acc[entry.missing] || []
            acc[entry.missing].push(entry)
            return acc
        }, {})

        Object.entries(byFile).forEach(([file, entries]) => {
            console.log(`\n  In ${file}:`)
            entries.forEach((entry) => console.log(`    - ${entry.path}`))
        })

        const addToOthers = await askConfirm('\nWould you like to add these keys to each file?')
        if (addToOthers) {
            Object.entries(byFile).forEach(([file, entries]) => {
                let locale = getLocaleContent(file)
                entries.forEach((entry) => {
                    locale = setValueAtPath(locale, entry.path, entry.value)
                })
                saveLocale(file, locale)
            })
            console.log('✓ Added missing keys to other locale files')
        }
    }

    if (missingBase.length > 0) {
        console.log(
            `\n[${missingBase.length}] Keys found in other files but missing in ${BASE_LOCALE}:`
        )
        const bySource = missingBase.reduce((acc, entry) => {
            acc[entry.source] = acc[entry.source] || []
            acc[entry.source].push(entry)
            return acc
        }, {})

        Object.entries(bySource).forEach(([file, entries]) => {
            console.log(`\n  From ${file}:`)
            entries.forEach((entry) => console.log(`    - ${entry.path}`))
        })

        const addToBase = await askConfirm('\nWould you like to add these keys to the base file?')
        if (addToBase) {
            let baseLocaleUpdated = getLocaleContent(BASE_LOCALE)
            missingBase.forEach((entry) => {
                baseLocaleUpdated = setValueAtPath(baseLocaleUpdated, entry.path, entry.value)
            })
            saveLocale(BASE_LOCALE, baseLocaleUpdated)
            console.log(`✓ Added missing keys to ${BASE_LOCALE}`)
        }
    }

    await sortAllFiles(files)

    console.log('\n[DONE] Locale check completed')
    rl.close()
}

// Handle errors
process.on('uncaughtException', (err) => {
    console.error('Error:', err)
    rl.close()
    process.exit(1)
})

main()
