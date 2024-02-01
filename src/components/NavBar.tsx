import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

interface NavBarProps {
    children?: React.ReactNode
    title?: string
    noTitle?: boolean
    onlyTitle?: boolean
}

export default function NavBar({
    children,
    title = 'hidrata-app',
    noTitle = false,
    onlyTitle = false,
}: NavBarProps) {
    const titleElement = (
        <h1 className='text-2xl font-white font-semibold select-none'>
            <Link to='/'>{title}</Link>
        </h1>
    )

    return (
        <nav>
            <div
                className={twMerge(
                    'max-w-screen-md mx-auto p-4 border-b-2 flex items-center border-zinc-700',
                    onlyTitle ? 'justify-center' : 'justify-between'
                )}
            >
                {onlyTitle ? (
                    <>{titleElement}</>
                ) : (
                    <>
                        <div>{noTitle ? <></> : <>{titleElement}</>}</div>
                        <div className='flex items-center gap-2'>{children}</div>
                    </>
                )}
            </div>
        </nav>
    )
}
