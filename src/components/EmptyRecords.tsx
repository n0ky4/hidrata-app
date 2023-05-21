import { Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ReactComponent as Illustration } from './../assets/empty.svg'

export default function EmptyRecords() {
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        setShow(true)
    }, [])

    return (
        <Transition
            as={Fragment}
            show={show}
            enter='transition-all duration-500'
            enterFrom='opacity-0 -translate-y-2'
            enterTo='opacity-100 translate-y-0'
        >
            <div className='flex items-center justify-center pb-6'>
                <div className='flex flex-wrap items-center justify-center max-w-md text-center gap-5'>
                    <Illustration width='192px' className='text-white' opacity={0.25} />
                    <span className='text-zinc-500'>
                        Não há nenhum registro de hoje... Que tal começar tomando um copo d'água?
                        😊💧
                    </span>
                </div>
            </div>
        </Transition>
    )
}
