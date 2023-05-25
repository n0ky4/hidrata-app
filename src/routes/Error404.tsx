import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { P } from '../components/About/AboutComponents'
import Button from '../components/Button'
import NavBar from '../components/NavBar'
import Stagger from '../components/Stagger'

export default function Error404() {
    return (
        <>
            <NavBar onlyTitle />
            <main className='max-w-screen-md mx-auto px-4 py-16 flex flex-col gap-4 text-center'>
                <Stagger
                    delay={200}
                    show={true}
                    enter='transition-all duration-200 ease-out'
                    enterFrom='opacity-0 -translate-y-2'
                    enterTo='opacity-100 translate-y-0'
                >
                    <h1 className='text-6xl font-white font-semibold'>Ops...</h1>
                    <P>Essa página não existe!</P>
                    <Link to='/'>
                        <Button className='mt-10'>
                            <ArrowLeft size={24} weight='bold' /> Voltar
                        </Button>
                    </Link>
                </Stagger>
            </main>
        </>
    )
}
