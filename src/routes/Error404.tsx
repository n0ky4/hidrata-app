import { ArrowLeft } from '@phosphor-icons/react'
import { P } from '../components/About/AboutComponents'
import LinkButton from '../components/Button/LinkButton'
import NavBar from '../components/NavBar'
import Stagger from '../components/Stagger'

export default function Error404() {
    return (
        <>
            <NavBar onlyTitle />
            <main className='max-w-screen-md mx-auto px-4 py-16 flex flex-col gap-4 text-center'>
                <Stagger>
                    <h1 className='text-6xl font-white font-semibold'>Ops...</h1>
                    <P>Essa página não existe!</P>
                    <LinkButton to='/' className='mt-10'>
                        <ArrowLeft size={24} weight='bold' /> Voltar
                    </LinkButton>
                </Stagger>
            </main>
        </>
    )
}
