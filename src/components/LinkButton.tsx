import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { buttonClasses } from './Button'

interface LinkButtonProps extends LinkProps {
    children: React.ReactNode
    ghost?: boolean
    className?: string
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({ children, className, ghost, ...rest }, ref) => (
        <Link ref={ref} className={buttonClasses(ghost, className)} {...rest}>
            {children}
        </Link>
    )
)

LinkButton.displayName = 'LinkButton'

export default LinkButton
