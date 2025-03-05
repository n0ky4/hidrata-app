/* eslint-disable @typescript-eslint/no-explicit-any */

const prefixes = {
    global: {
        prefix: 'hidrata-app',
        style: 'color: white; background-color: oklch(0.546 0.245 262.881); padding: 1px 3px; border-radius: 3px;',
    },
    info: {
        prefix: 'INFO',
        style: 'color: black; background-color: oklch(0.718 0.202 349.761); padding: 1px 3px; border-radius: 3px;',
    },
    warn: {
        prefix: 'WARN',
        style: 'color: black; background-color: oklch(0.905 0.182 98.111); padding: 1px 3px; border-radius: 3px;',
    },
    error: {
        prefix: 'ERROR',
        style: 'color: black; background-color: oklch(0.577 0.245 27.325); padding: 1px 3px; border-radius: 3px;',
    },
}

export const log = {
    info: (...args: any[]) => {
        console.log(
            `%c${prefixes.global.prefix}%c %c${prefixes.info.prefix}`,
            prefixes.global.style,
            '',
            prefixes.info.style,
            ...args
        )
    },
    warn: (...args: any[]) => {
        console.log(
            `%c${prefixes.global.prefix}%c %c${prefixes.warn.prefix}`,
            prefixes.global.style,
            '',
            prefixes.warn.style,
            ...args
        )
    },
    error: (...args: any[]) => {
        console.log(
            `%c${prefixes.global.prefix}%c %c${prefixes.error.prefix}`,
            prefixes.global.style,
            '',
            prefixes.error.style,
            ...args
        )
    },
}
