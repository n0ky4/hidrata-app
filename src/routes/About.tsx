import { ArrowLeft } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { A, GitVersion, P } from '../components/About/AboutComponents'
import LinkButton from '../components/LinkButton'
import NavBar from '../components/NavBar'
import Stagger from '../components/Stagger'

export default function About() {
    const { t } = useTranslation()

    const getAboutText = () => {
        const [prefix, githubRepoPlaceholder, licensePlaceholder] = t('about').split('{')

        const [githubRepo, suffixAfterRepo] = githubRepoPlaceholder.split('}')
        const [license, suffixAfterLicense] = licensePlaceholder.split('}')

        const repoUrl = `${__REPO__}`
        const licenseUrl = `${repoUrl}/blob/main/LICENSE`

        return (
            <P>
                {'hidrata-app '}
                {prefix}
                <A href={repoUrl}>{githubRepo}</A>
                {suffixAfterRepo}
                <A href={licenseUrl}>{license}</A>
                {suffixAfterLicense}
            </P>
        )
    }

    return (
        <>
            <NavBar noTitle>
                <LinkButton to='/'>
                    <ArrowLeft size={24} weight='bold' /> {t('goBack')}
                </LinkButton>
            </NavBar>

            <main className='max-w-screen-md mx-auto px-4 py-6 flex flex-col gap-6'>
                <Stagger
                    delay={200}
                    show={true}
                    enter='transition-all duration-200 ease-out'
                    enterFrom='opacity-0 -translate-y-2'
                    enterTo='opacity-100 translate-y-0'
                >
                    <div className='flex items-center gap-4'>
                        <Link to='/'>
                            <h1 className='text-4xl font-white font-semibold'>hidrata-app</h1>
                        </Link>
                        <GitVersion />
                    </div>
                    {getAboutText()}
                    <div>
                        <h2 className='text-lg text-white font-semibold'>{t('credits')}</h2>
                        <P>
                            {t('author')}: <A href='https://github.com/gukodev'>guko</A>
                        </P>
                        <P>
                            {t('illustrations')}:{' '}
                            <A href='https://twitter.com/fluoritemonkey'>Fluorite</A>
                        </P>
                    </div>
                </Stagger>
            </main>
        </>
    )
}
