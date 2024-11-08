import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { A, GitVersion, P } from '../components/About/AboutComponents'
import LinkButton from '../components/LinkButton'
import NavBar from '../components/NavBar'
import Stagger from '../components/Stagger'

export default function About() {
    return (
        <>
            <NavBar noTitle>
                <LinkButton to='/'>
                    <ArrowLeft size={24} weight='bold' /> Voltar
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
                    <P>
                        hidrata-app é um projeto open-source disponível neste{' '}
                        <A href={__REPO__}>repositório do GitHub</A> e está licenciado sob a{' '}
                        <A href={`${__REPO__}/blob/main/LICENSE`}>Licença MIT</A>.
                    </P>
                    <div>
                        <h2 className='text-lg text-white font-semibold'>Créditos</h2>
                        <P>
                            Autor: <A href='https://github.com/n0ky4'>nokya</A>
                        </P>
                        <P>
                            Ilustrações: <A href='https://twitter.com/fluoritemonkey'>Fluorite</A>
                        </P>
                    </div>
                </Stagger>
            </main>
        </>
    )
}
