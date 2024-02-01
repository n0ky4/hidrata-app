import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Theme, baseStyle, themes } from './Button'

interface LinkButtonProps extends LinkProps {
    children: React.ReactNode
    className?: string
    theme?: Theme
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({ children, className, theme, ...rest }, ref) => {
        const _theme = themes[theme || 'primary']

        return (
            <Link ref={ref} className={twMerge(baseStyle, _theme)} {...rest}>
                {children}
            </Link>
        )
    }
)

LinkButton.displayName = 'LinkButton'

export default LinkButton
