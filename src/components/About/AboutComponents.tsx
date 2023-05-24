interface AProps {
    href: string
    children: React.ReactNode
    target?: string
}

export function GitVersion() {
    return (
        <a
            href={`${__REPO__}/commit/${__COMMIT_HASH__}`}
            target='_blank'
            className='text-sm font-mono text-zinc-400 underline'
            rel='noopener noreferrer'
        >
            {__COMMIT_HASH__}/{__COMMIT_DATE__}
        </a>
    )
}

export function A({ href, children, target = '_blank' }: AProps) {
    return (
        <a href={href} target={target} rel='noopener noreferrer' className='underline text-white'>
            {children}
        </a>
    )
}

export function P({ children }: { children: React.ReactNode }) {
    return <p className='text-lg justify text-zinc-300'>{children}</p>
}
