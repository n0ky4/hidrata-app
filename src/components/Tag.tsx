import clsx from "clsx"


const colors = {
    blue: {
        bg: 'bg-blue-500',
        text: 'text-white',
        shadow: 'shadow-md shadow-blue-500/25'
    },
    green: {
        bg: 'bg-green-500',
        text: 'text-white',
        shadow: 'shadow-md shadow-green-500/25'
    },
    red: {
        bg: 'bg-red-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-red-500/25'
    },
    yellow: {
        bg: 'bg-yellow-500',
        text: 'text-white',
        shadow: 'shadow-md shadow-yellow-500/25'
    },
    gray: {
        bg: 'bg-gray-200',
        text: 'text-gray-700',
        shadow: 'shadow-md shadow-gray-200/25'
    },
}

interface TagProps  {
    children: React.ReactNode
    className?: string
    color?: keyof typeof colors
    translate?: boolean
    shadow?: boolean
}

export default function Tag({ children, className, color, translate, shadow }: TagProps) {
    color = color || 'gray'
    return (
        <span className={clsx(
            'inline-block px-1.5 py-0.5 text-xs font-semibold rounded-md select-none',
            `${colors[color].bg} ${colors[color].text}`,
            translate && '-translate-y-3.5',
            shadow && colors[color].shadow,
            className
        )}>
            {children}
        </span>
    )
}