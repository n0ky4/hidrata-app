import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}

export function Input({ className, error, ...rest }: InputProps) {
    return (
        <input
            className={twMerge(
                'bg-neutral-950 text-neutral-100 p-2 rounded-lg',
                'focus:outline-none focus-visible:ring-2 ring-blue-500',
                'common-transition',
                'border border-neutral-800',
                error && 'border-red-500 ring-red-500/50',
                className
            )}
            {...rest}
        />
    )
}
