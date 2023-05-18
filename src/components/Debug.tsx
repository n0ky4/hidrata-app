interface DebugProps {
    children: React.ReactNode
}

// Modal de debug
export function Debug({ children }: DebugProps) {
    return (
        <div className='w-full h-full fixed top-0 left-0 bg-black/50 z-50 overflow-auto'>
            <div className='max-w-screen-md mx-auto p-4 bg-zinc-800 py-10'>{children}</div>
        </div>
    )
}
