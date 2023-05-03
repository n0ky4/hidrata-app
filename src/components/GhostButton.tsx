import clsx from 'clsx'

interface GhostButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

export function GhostButton({ children, className }: GhostButtonProps) {
    return (
        <button
            className={clsx(
                'p-2 rounded-lg bg-transparent text-zinc-300 hover:text-white transition-colors hover:bg-white/20',
                className
            )}
        >
            {children}
        </button>
    )
}
