import { ReactNode } from 'react'

const insert = (text: string, components: ReactNode[]): (string | ReactNode)[] => {
    const parts = text.split('{}')
    const result: (string | ReactNode)[] = []

    parts.forEach((part, index) => {
        if (part) result.push(part)

        if (index < parts.length - 1) {
            if (index < components.length) {
                result.push(components[index])
            } else {
                // no enough args provided
                result.push('{}')
            }
        }
    })

    return result
}

export const component = {
    insert,
}
