import Modal from '.'
import Button from '../Button/Button'

interface ConfirmModalProps {
    show: boolean
    children: React.ReactNode
    onConfirm: () => void
    onCancel: () => void
    onModalClose: () => void
    title?: string
    confirmText?: string
    cancelText?: string
}

export default function ConfirmModal({
    title = 'Confirmação',
    show,
    children,
    onCancel,
    onConfirm,
    onModalClose,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
}: ConfirmModalProps) {
    return (
        <Modal show={show} onModalClose={onModalClose}>
            <Modal.Title>{title}</Modal.Title>
            <Modal.Content>
                <div className='flex flex-col gap-4'>
                    <p className='text-zinc-400'>{children}</p>
                    <div className='flex flex-center gap-2 ml-auto'>
                        <Button theme='ghost' onClick={onCancel} title={cancelText}>
                            {cancelText}
                        </Button>
                        <Button onClick={onConfirm} title={confirmText}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
