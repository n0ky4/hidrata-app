import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'

interface StaggerProps {
    delay?: number
    show?: boolean
    enter?: string
    enterFrom?: string
    enterTo?: string
    children: React.ReactNode[]
}

export default function Stagger({
    delay = 200,
    show = true,
    enter = 'transition-all duration-200 ease-out',
    enterFrom = 'opacity-0 -translate-y-2',
    enterTo = 'opacity-100 translate-y-0',
    children,
}: StaggerProps) {
    const [childStates, setChildStates] = useState<boolean[]>([])
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        if (show) {
            const timeoutIds: number[] = []

            children.forEach((_, index) => {
                const timeoutId = window.setTimeout(() => {
                    setChildStates((prevChildStates) => {
                        const updatedStates = [...prevChildStates]
                        updatedStates[index] = true
                        return updatedStates
                    })
                }, delay * index)
                timeoutIds.push(timeoutId)
            })

            setHydrated(true)
            return () => {
                timeoutIds.forEach((timeoutId) => {
                    clearTimeout(timeoutId)
                })
            }
        }
    }, [show, children, delay])

    if (!show || !hydrated) {
        return null
    }

    return (
        <>
            {children.map((child, index) => (
                <Transition
                    key={index}
                    show={childStates[index] || false}
                    enter={enter}
                    enterFrom={enterFrom}
                    enterTo={enterTo}
                >
                    {child}
                </Transition>
            ))}
        </>
    )
}
