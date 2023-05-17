import clsx from 'clsx'
import React from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    ghost?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, ghost, ...rest }, ref) => (
        <button
            ref={ref}
            className={clsx(
                'rounded-lg transition-colors font-semibold',
                ghost
                    ? 'p-2 bg-transparent text-zinc-300 hover:text-white hover:bg-white/20'
                    : 'py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
)

Button.displayName = 'Button'

export default Button