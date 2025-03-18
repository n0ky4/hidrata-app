let interval: number | undefined

const setupInterval = () => {
    if (interval) return

    interval = setInterval(() => {
        postMessage({ type: 'tick' })
    }, 1000)
}
const clear = () => {
    if (!interval) return
    clearInterval(interval)
    interval = undefined
}

onmessage = (e) => {
    const type = e?.data?.type
    if (!type) return

    switch (type) {
        case 'start':
            setupInterval()
            break
        case 'stop':
            clear()
            break
        default:
            break
    }
}
