import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react'

// check if component has a valid key (!= null or undefined)
function hasValidKey(component: ReactNode): component is ReactElement {
    return isValidElement(component) && component.key != null
}

const insert = (text: string, components: ReactNode[]): (string | ReactNode)[] => {
    // get parts of the text separated by '{}'
    const parts = text.split('{}')

    const result: (string | ReactNode)[] = []

    parts.forEach((part, index) => {
        if (part) result.push(part)

        // if it is the last part, return, as there is no component left to insert
        if (index === parts.length - 1) return

        // if there is a component to insert
        if (index < components.length) {
            const component = components[index]

            // check if the component has a key, if it does, just push it
            if (hasValidKey(component)) {
                result.push(component)
            } else {
                // else, clone the component and add a key associated to the index
                result.push(
                    isValidElement(component)
                        ? cloneElement(component, { key: `key-${index}` })
                        : component
                )
            }
        } else {
            // here, there is no enough components to insert, so just insert an empty object
            result.push('{}')
        }
    })

    return result
}

export const component = {
    insert,
}
