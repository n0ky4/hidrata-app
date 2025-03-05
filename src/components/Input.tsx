import { twMerge } from 'tailwind-merge'

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={twMerge(
                'bg-neutral-950 text-neutral-100 p-2 rounded-lg',
                'focus:outline-none focus-visible:ring-2 ring-blue-500',
                'common-transition',
                'border border-neutral-800',
                className
            )}
            {...rest}
        />
    )
}
