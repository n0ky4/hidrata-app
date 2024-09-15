/// <reference types="vite-plugin-svgr/client" />
import { Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Illustration from './../assets/empty.svg?react'

export default function EmptyRecords() {
    const { t } = useTranslation()
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
                    <span className='text-zinc-500'>{t('noRecords')}</span>
                </div>
            </div>
        </Transition>
    )
}
