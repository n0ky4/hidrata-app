import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'
import React, { Children, Fragment, PropsWithChildren, ReactElement, useEffect } from 'react'
import Button from '../Button'

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

interface TitleProps {
    children: React.ReactNode
    custom?: boolean
}

const Title = ({ children, custom = false }: TitleProps) => {
    return custom ? <>{children}</> : <h1 className='text-2xl font-bold'>{children}</h1>
}

const Description = ({ children }: PropsWithChildren) => {
    return <p className='text-md'>{children}</p>
}

const Content = ({ children, flex = false }: ContentProps) => {
    return flex ? <div className='flex flex-col gap-4'>{children}</div> : <div>{children}</div>
}

function Modal({ children, show, onModalClose, canClose = true }: ModalProps) {
    const closeModal = () => {
        if (canClose && onModalClose) onModalClose()
    }

    const title = Children.map(children, (child) => {
        const item = child as ReactElement
        if (item.type === Title) return item
    })

    const description = Children.map(children, (child) => {
        const item = child as ReactElement
        if (item.type === Description) return item
    })

    const content = Children.map(children, (child) => {
        const item = child as ReactElement
        if (item.type === Content) return item
    })

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
                                <Button onClick={() => closeModal()} ghost title='Fechar'>
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
                        className='fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur'
                        onClick={() => closeModal()}
                    ></div>
                </Transition.Child>
            </div>
        </Transition.Root>
    )
}

Modal.Title = Title
Modal.Description = Description
Modal.Content = Content

export default Modal
