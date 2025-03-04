import { twMerge } from 'tailwind-merge'

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={twMerge(
                'bg-neutral-950 text-white p-2 rounded-lg',
                'focus:outline-none focus-visible:ring-2 ring-blue-500',
                'transition-all ease-out duration-200',
                'border border-neutral-800',
                className
            )}
            {...rest}
        />
    )
}
