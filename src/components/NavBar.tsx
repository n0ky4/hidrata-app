import clsx from 'clsx'
import { Link } from 'react-router-dom'
import Tag from './Tag'

interface NavBarProps {
    children?: React.ReactNode
    title?: string
    noTitle?: boolean
    noTag?: boolean
    onlyTitle?: boolean
}

export default function NavBar({
    children,
    title = 'hidrata-app',
    noTag = false,
    noTitle = false,
    onlyTitle = false,
}: NavBarProps) {
    const titleElement = (
        <h1 className='text-2xl font-white font-semibold select-none'>
            <Link to='/'>{title}</Link>
            {!noTag && (
                <>
                    {' '}
                    <Tag color='blue' shadow translate>
                        Beta
                    </Tag>
                </>
            )}
        </h1>
    )

    return (
        <nav>
            <div
                className={clsx(
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
