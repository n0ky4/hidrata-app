import { twMerge } from 'tailwind-merge'

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
    error?: boolean
}

export function Label({ children, className, error, ...rest }: LabelProps) {
    return (
        <label
            className={twMerge(
                'block mb-1 text-neutral-400 text-sm font-medium',
                error && 'text-red-400',
                className
            )}
            {...rest}
        >
            {children}
        </label>
    )
}
