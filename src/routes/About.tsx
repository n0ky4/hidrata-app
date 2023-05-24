import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { A, GitVersion, P } from '../components/About/AboutComponents'
import Button from '../components/Button'
import NavBar from '../components/NavBar'

export default function About() {
    return (
        <>
            <NavBar title='Sobre' noTitle>
                <Link to='/'>
                    <Button>
                        <ArrowLeft size={24} weight='bold' /> Voltar
                    </Button>
                </Link>
            </NavBar>
            <main className='max-w-screen-md mx-auto px-4 py-6 flex flex-col gap-6'>
                <div className='flex items-center gap-4'>
                    <Link to='/'>
                        <h1 className='text-4xl font-white font-semibold'>hidrata-app</h1>
                    </Link>
                    <GitVersion />
                </div>
                <div className='flex flex-col gap-6'>
                    <P>
                        hidrata-app é um projeto open-source disponível neste{' '}
                        <A href={__REPO__}>repositório do GitHub</A> e está licenciado sob a{' '}
                        <A href={`${__REPO__}/blob/main/LICENSE`}>Licença MIT</A>.
                    </P>
                    <div>
                        <h2 className='text-lg text-white font-semibold'>Créditos</h2>
                        <P>
                            Autor: <A href='https://github.com/umgustavo'>Gustavo Rocha</A>
                        </P>
                    </div>
                </div>
            </main>
        </>
    )
}
