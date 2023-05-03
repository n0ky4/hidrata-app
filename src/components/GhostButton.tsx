interface GhostButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

export function GhostButton({ children }: GhostButtonProps) {
    return (
        <button className='p-2 rounded-lg bg-transparent text-zinc-300 hover:bg-white/20 hover:text-white transition-colors'>
            {children}
        </button>
    )
}
