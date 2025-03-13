import { twMerge } from 'tailwind-merge'

const themes = {
    primary: twMerge(
        'bg-blue-600 text-neutral-100',
        'hover:bg-blue-700',
        'focus-visible:ring-2 focus-visible:ring-blue-100/75'
    ),
    ghost: twMerge(
        'bg-white/5 text-neutral-100',
        'hover:bg-white/10',
        'focus-visible:ring-2 focus-visible:ring-white/50'
    ),
    danger: twMerge(
        'bg-red-700 text-neutral-100',
        'hover:bg-red-800',
        'focus-visible:ring-2 focus-visible:ring-red-100/75'
    ),
}
type Theme = keyof typeof themes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: Theme
    square?: boolean
}

export function Button({
    theme = 'primary',
    children,
    className,
    square = false,
    ...rest
}: ButtonProps) {
    const th = themes[theme]

    return (
        <button
            className={twMerge(
                'common-transition',
                'font-medium select-none px-4 py-2 rounded-lg',
                'focus-visible:outline-none',
                'flex items-center justify-center gap-1.5',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                th,
                square && 'p-0 w-10 h-10',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
}
