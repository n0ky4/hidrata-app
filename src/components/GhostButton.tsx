import clsx from 'clsx'

interface GhostButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    red?: boolean
}

export function GhostButton(props: GhostButtonProps) {
    return (
        <button
            className={clsx(
                'p-2 rounded-lg bg-transparent text-zinc-300 hover:text-white transition-colors',
                props.red ? 'hover:bg-red-500' : 'hover:bg-white/20'
            )}
            {...props}
        >
            {props.children}
        </button>
    )
}
