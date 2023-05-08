import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'
import React, { Fragment } from 'react'
import { GhostButton } from './GhostButton'

interface ModalProps {
    children: React.ReactNode
    title?: string | React.ReactNode
    description?: string | React.ReactNode
    show: boolean
    canClose?: boolean
    onModalClose?: () => void
}

type SubComponentType = {
    type: {
        name?: string
    }
}

function Modal({ children, show, onModalClose, canClose = true }: ModalProps) {
    const closeModal = () => {
        if (canClose && onModalClose) onModalClose()
    }

    const subComponentList = Object.keys(Modal)

    const subComponents = subComponentList.map((key) => {
        return React.Children.map(children, (child) => {
            return (child as ).type.name === key ? child : null
        })
    })

    const title = subComponents.find((component) => component[0].type.name === 'Title')
    const description = subComponents.find((component) => component[0].type.name === 'Description')
    const content = subComponents.find((component) => component[0].type.name === 'Content')

    return (
        <Transition.Root show={show}>
            <div className='fixed top-0 left-0 w-screen h-screen p-5 pt-20 z-50'>
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
                                <GhostButton onClick={() => closeModal()}>
                                    <X weight='bold' size={24} />
                                </GhostButton>
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
                        className='absolute top-0 left-0 w-full h-full bg-black/50'
                        onClick={() => closeModal()}
                    ></div>
                </Transition.Child>
            </div>
        </Transition.Root>
    )
}

const Title = ({ children }: { children: React.ReactNode }) => {
    return <h1 className='text-2xl font-bold'>{children}</h1>
}
Modal.Title = Title

const Description = ({ children }: { children: React.ReactNode }) => {
    return <p className='text-md'>{children}</p>
}
Modal.Description = Description

const Content = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}
Modal.Content = Content

export default Modal
