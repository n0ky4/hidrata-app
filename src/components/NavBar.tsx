import { Link } from 'react-router-dom'
import Tag from './Tag'

interface NavBarProps {
    children: React.ReactNode
    title?: string
    noTitle?: boolean
    noTag?: boolean
}

export default function NavBar({
    children,
    title = 'hidrata-app',
    noTag = false,
    noTitle = false,
}: NavBarProps) {
    return (
        <nav>
            <div className='max-w-screen-md mx-auto p-4 border-b-2 flex items-center justify-between border-zinc-700'>
                <div>
                    {noTitle ? (
                        <></>
                    ) : (
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
                    )}
                </div>

                <div className='flex items-center gap-2'>{children}</div>
            </div>
        </nav>
    )
}
