import { twMerge } from 'tailwind-merge'

export function Label({ children, className, ...rest }: React.HTMLProps<HTMLLabelElement>) {
    return (
        <label
            className={twMerge('block mb-1 text-neutral-400 text-sm font-medium', className)}
            {...rest}
        >
            {children}
        </label>
    )
}
