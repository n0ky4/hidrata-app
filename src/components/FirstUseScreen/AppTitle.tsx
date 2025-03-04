import { useLocale } from '../../i18n/context/contextHook'

export function AppTitle() {
    const { t } = useLocale()
    const appTitle = <b className='text-white'>{t('appName')}</b>
    return <>{appTitle}</>
}
