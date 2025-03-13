import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../Button'

export interface CommonModalProps {
    show: boolean
    onClose: () => void
    noBackdrop?: boolean
    className?: string
    transition?: boolean
}

interface ModalProps extends CommonModalProps {
    children: React.ReactNode
}

interface ModalTitleProps {
    children: React.ReactNode
    onClose?: () => void
}

interface ModalSectionProps {
    title: string
    children: React.ReactNode
}

export function ModalTitle({ children, onClose }: ModalTitleProps) {
    const title = <DialogTitle className='text-2xl font-bold'>{children}</DialogTitle>

    if (!onClose) return title

    return (
        <div className='flex items-center w-full justify-between'>
            {title}
            <Button onClick={onClose} square theme='ghost'>
                <X />
            </Button>
        </div>
    )
}

export function ModalDescription({ children }: PropsWithChildren) {
    return <Description className='text-neutral-300'>{children}</Description>
}

export function ModalActions({ children }: PropsWithChildren) {
    return <div className='flex items-center justify-end gap-4 mt-8'>{children}</div>
}

export function ModalSection({ title, children }: ModalSectionProps) {
    return (
        <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-semibold text-neutral-100'>{title}</h3>
            {children}
        </div>
    )
}

export function Modal({
    onClose,
    show,
    children,
    noBackdrop = false,
    transition = true,
    className,
}: ModalProps) {
    return (
        <Dialog
            open={show}
            onClose={onClose}
            className={twMerge(
                'fixed top-0 left-0 w-screen h-screen z-50 group',
                transition && 'common-transition',
                className
            )}
        >
            {!noBackdrop && (
                <DialogBackdrop
                    transition={transition}
                    className={twMerge(
                        'fixed inset-0 bg-black/30 common-transition',
                        // closed
                        'data-[closed]:opacity-0 data-[closed]:backdrop-blur-[0px]',
                        // open
                        'backdrop-blur-sm opacity-100'
                    )}
                />
            )}

            <div className='fixed flex w-screen items-center justify-center p-4 lg:pt-20 pt-10'>
                <DialogPanel
                    transition={transition}
                    className={twMerge(
                        'relative overflow-hidden w-full max-w-xl',
                        'p-12 rounded-xl',
                        'border border-neutral-800 bg-neutral-900',
                        'flex flex-col gap-4',
                        'common-transition',
                        // closed
                        'data-[closed]:scale-95 data-[closed]:opacity-0',
                        // open
                        'scale-100 opacity-100'
                    )}
                >
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}
