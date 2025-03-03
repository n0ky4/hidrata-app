import { twMerge } from 'tailwind-merge'

const themes = {
    primary: twMerge(
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'focus-visible:ring-2 focus-visible:ring-blue-100/75'
    ),
    ghost: twMerge(
        'bg-white/5 text-white',
        'hover:bg-white/10',
        'focus-visible:ring-2 focus-visible:ring-white/50'
    ),
}
type Theme = keyof typeof themes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: Theme
}

export function Button({ theme = 'primary', children, className, ...rest }: ButtonProps) {
    const th = themes[theme]

    return (
        <button
            className={twMerge(
                'transition-all ease-out duration-200',
                'font-medium select-none px-4 py-2 rounded-lg',
                'focus-visible:outline-none',
                'flex items-center gap-1.5',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                th,
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
}
