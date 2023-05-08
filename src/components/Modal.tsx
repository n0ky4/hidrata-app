import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'
import { Fragment } from 'react'
import { GhostButton } from './GhostButton'

interface ModalProps {
    children: React.ReactNode
    title?: string
    description?: string
    show: boolean
    canClose?: boolean
    onModalClose?: () => void
}

export default function Modal({
    children,
    title,
    description,
    show,
    onModalClose,
    canClose = true,
}: ModalProps) {
    const closeModal = () => {
        if (canClose && onModalClose) onModalClose()
    }

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
                            <h1 className='text-2xl font-bold'>{title}</h1>
                            {canClose ? (
                                <GhostButton onClick={() => closeModal()}>
                                    <X weight='bold' size={24} />
                                </GhostButton>
                            ) : null}
                        </div>

                        {description ? <p className='text-md'>{description}</p> : null}
                        {children}
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
