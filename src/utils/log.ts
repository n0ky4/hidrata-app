function lg(message: string, prefix: string, subprefix?: string) {
    if (!import.meta.env.DEV) return
    let prefixStyle = ''
    let subprefixStyle = ''
    let messageStyle = ''

    switch (prefix) {
        case 'INFO':
            prefixStyle = 'color: cyan'
            subprefixStyle = 'color: white'
            messageStyle = 'color: lightgray'
            break
        case 'WARN':
            prefixStyle = 'color: yellow'
            subprefixStyle = 'color: white'
            messageStyle = 'color: lightgray'
            break
        case 'ERROR':
            prefixStyle = 'color: red'
            subprefixStyle = 'color: white'
            messageStyle = 'color: lightgray'
            break
    }

    if (subprefix) {
        console.log(
            `%c[${prefix}] ${`%c(${subprefix})`} %c${message}`,
            prefixStyle,
            subprefixStyle,
            messageStyle
        )
        return
    }

    console.log(`%c[${prefix}] %c${message}`, prefixStyle, messageStyle)
}

const log = {
    info: (message: string, subprefix?: string) => {
        lg(message, 'INFO', subprefix)
    },
    warn: (message: string, subprefix?: string) => {
        lg(message, 'WARN', subprefix)
    },
    error: (message: string, subprefix?: string) => {
        lg(message, 'ERROR', subprefix)
    },
}

export default log
