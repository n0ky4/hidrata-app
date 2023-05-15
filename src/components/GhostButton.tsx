import clsx from 'clsx'
import React from 'react'

interface GhostButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>(
    ({ children, className, ...rest }, ref) => (
        <button
            ref={ref}
            className={clsx(
                'p-2 rounded-lg bg-transparent text-zinc-300 hover:text-white transition-colors hover:bg-white/20',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
)

GhostButton.displayName = 'GhostButton'

export default GhostButton
