import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'
import React, { Fragment, useEffect } from 'react'
import { WithChildren } from '../utils/types'
import Button from './Button'

type SubComponentNode = {
    type?: {
        name?: string
    }
}

interface ModalProps {
    children: React.ReactNode
    show: boolean
    canClose?: boolean
    onModalClose?: () => void
}

interface ContentProps {
    children: React.ReactNode
    flex?: boolean
}

function Modal({ children, show, onModalClose, canClose = true }: ModalProps) {
    const closeModal = () => {
        if (canClose && onModalClose) onModalClose()
    }

    const subComponentList = Object.keys(Modal)

    const subComponents = subComponentList.map((key) => {
        return React.Children.map(children, (child) => {
            return child && (child as SubComponentNode)?.type?.name === key ? child : null
        })
    })

    const title = subComponents.filter(
        (component) => component && (component as SubComponentNode[])[0]?.type?.name === 'Title'
    )[0]
    const description = subComponents.filter(
        (component) =>
            component && (component as SubComponentNode[])[0]?.type?.name === 'Description'
    )[0]
    const content = subComponents.filter(
        (component) => component && (component as SubComponentNode[])[0]?.type?.name === 'Content'
    )[0]

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal()
        })
    }, [])

    return (
        <Transition.Root show={show} as={Fragment}>
            <div className='fixed top-0 left-0 w-screen h-screen px-5 py-16 z-50 overflow-auto'>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-200'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                >
                    <div className='max-w-xl mx-auto z-10 relative p-6 rounded-xl bg-zinc-800 flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            {title}
                            {canClose ? (
                                <Button onClick={() => closeModal()} ghost>
                                    <X weight='bold' size={24} />
                                </Button>
                            ) : null}
                        </div>
                        {description}
                        {content}
                    </div>
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div
                        className='fixed top-0 left-0 w-full h-full bg-black/50'
                        onClick={() => closeModal()}
                    ></div>
                </Transition.Child>
            </div>
        </Transition.Root>
    )
}

const Title = ({ children }: WithChildren) => {
    return <h1 className='text-2xl font-bold'>{children}</h1>
}
Modal.Title = Title

const Description = ({ children }: WithChildren) => {
    return <p className='text-md'>{children}</p>
}
Modal.Description = Description

const Content = ({ children, flex = false }: ContentProps) => {
    return flex ? <div className='flex flex-col gap-4'>{children}</div> : <div>{children}</div>
}
Modal.Content = Content

export default Modal
