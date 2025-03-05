import { Settings2 } from 'lucide-react'
import { useLocale } from '../i18n/context/contextHook'
import { Button } from './Button'

export function NavBar() {
    const { t } = useLocale()

    return (
        <nav className='flex items-center justify-between pb-6 border-b-2 border-neutral-900'>
            <div>
                <h1 className='text-3xl font-bold'>{t('appName')}</h1>
            </div>
            <div>
                <Button className='p-0 w-10 h-10' theme='ghost'>
                    <Settings2 size={24} strokeWidth={2} />
                </Button>
            </div>
        </nav>
    )
}
