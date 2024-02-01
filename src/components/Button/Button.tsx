import React from 'react'
import { twMerge } from 'tailwind-merge'

export const baseStyle = twMerge(
    'inline-flex items-center justify-center gap-1.5 ring-focus',
    'rounded-lg font-semibold select-none',
    'transition-all ease-out'
)

export const themes = {
    primary: 'py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
    ghost: 'py-2 px-4 bg-transparent text-zinc-300 hover:text-white hover:bg-white/20 focus-visible:bg-white/20 focus-visible:text-white focus-visible:ring-white/75',
} as const
export type Theme = keyof typeof themes

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    theme?: Theme
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, type, theme, ...rest }, ref) => {
        const _theme = themes[theme || 'primary']

        return (
            <button
                ref={ref}
                className={twMerge(baseStyle, _theme, className)}
                type={type || 'button'}
                {...rest}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
